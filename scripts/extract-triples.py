#!/usr/bin/env python3
"""
Offline triple extraction using a trained SciBERT relation classifier.

Input formats:
1) --input-file lines of plain text (heuristic entity pair generation)
2) --input-file TSV rows: subject<TAB>object<TAB>context

Output (JSONL):
{"subject","predicate","object","confidenceScore","sourceQuality","timestamp","context","modelLabel"}
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable, List, Sequence, Tuple

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer


ENTITY_PATTERN = re.compile(r"\b([A-Z][a-zA-Z0-9\-]{2,}(?:\s+[A-Z][a-zA-Z0-9\-]{2,}){0,3})\b")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Extract SPO triples with a trained SciBERT relation model.")
    p.add_argument("--model-dir", required=True, help="Path to trained model artifacts directory.")
    p.add_argument("--input-file", required=True, help="Text/TSV input file path.")
    p.add_argument("--output-file", required=True, help="Output JSONL path.")
    p.add_argument(
        "--source-quality",
        type=float,
        default=10.0,
        help="Default source quality (journal impact proxy) written to each triple.",
    )
    p.add_argument(
        "--min-confidence",
        type=float,
        default=0.4,
        help="Drop predictions below this confidence threshold.",
    )
    return p.parse_args()


def read_lines(path: Path) -> List[str]:
    return [ln.strip() for ln in path.read_text(encoding="utf-8").splitlines() if ln.strip()]


def to_pairs(line: str) -> Iterable[Tuple[str, str, str]]:
    # TSV mode: subject, object, context
    parts = line.split("\t")
    if len(parts) >= 3:
        yield parts[0].strip(), parts[1].strip(), parts[2].strip()
        return

    # Plain-text mode: generate candidate entity pairs heuristically
    context = line
    ents = []
    seen = set()
    for m in ENTITY_PATTERN.finditer(line):
        ent = m.group(1).strip()
        if ent.lower() not in seen:
            ents.append(ent)
            seen.add(ent.lower())
    for i in range(len(ents)):
        for j in range(len(ents)):
            if i == j:
                continue
            yield ents[i], ents[j], context


def normalize_predicate(label: str) -> str:
    x = label.strip().lower()
    if x == "no_relation":
        return "unrelated_to"
    return re.sub(r"[^a-z0-9]+", "_", x).strip("_") or "related_to"


def encode_text(subject: str, obj: str, context: str) -> str:
    return f"[HEAD] {subject} [TAIL] {obj} [SEP] {context}"


def main() -> None:
    args = parse_args()
    model_dir = Path(args.model_dir)
    in_path = Path(args.input_file)
    out_path = Path(args.output_file)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if not model_dir.exists():
        raise FileNotFoundError(
            f"Model directory not found: {model_dir}. Run training first and place artifacts here."
        )
    if not (model_dir / "config.json").exists():
        raise FileNotFoundError(
            f"Missing config.json under {model_dir}. Ensure Colab artifacts were downloaded correctly."
        )

    model_dir_str = str(model_dir)
    tokenizer = AutoTokenizer.from_pretrained(model_dir_str, local_files_only=True)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_dir_str, local_files_only=True
    )
    model.eval()

    id2label = model.config.id2label
    now = datetime.now(timezone.utc).isoformat()

    rows = read_lines(in_path)
    written = 0

    with out_path.open("w", encoding="utf-8") as wf:
        for line in rows:
            for subject, obj, context in to_pairs(line):
                text = encode_text(subject, obj, context)
                batch = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
                with torch.no_grad():
                    logits = model(**batch).logits
                    probs = torch.softmax(logits, dim=-1)[0]
                    score, idx = torch.max(probs, dim=-1)
                conf = float(score.item())
                label = id2label[int(idx.item())]
                if conf < args.min_confidence or label == "NO_RELATION":
                    continue

                triple = {
                    "subject": subject,
                    "predicate": normalize_predicate(label),
                    "object": obj,
                    "confidenceScore": round(conf, 6),
                    "sourceQuality": float(args.source_quality),
                    "timestamp": now,
                    "context": context,
                    "modelLabel": label,
                }
                wf.write(json.dumps(triple, ensure_ascii=True) + "\n")
                written += 1

    print(f"Wrote {written} triples to {out_path}")


if __name__ == "__main__":
    main()
