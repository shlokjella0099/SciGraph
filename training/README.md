# SciBERT Training (SciERC)

This folder contains a reproducible training workflow for a real scientific relation extractor.

## Dataset
- **SciERC** (Luan et al., 2018), loaded from Hugging Face: `allenai/scierc`.
- Task used here: relation classification between entity pairs.

## Notebook
- `colab_scierc_relation_extraction.ipynb`
- Intended runtime: **Google Colab GPU**.

## What the notebook does
1. Installs dependencies.
2. Loads SciERC.
3. Builds pairwise relation examples.
4. Fine-tunes `allenai/scibert_scivocab_uncased`.
5. Evaluates test metrics (micro/macro F1).
6. Exports model artifacts and metrics JSON.

## Artifacts produced
- `training/artifacts/scibert-scierc-relation/`
- `training/results.json`
- optional zip: `training/scibert-scierc-artifacts.zip`

## How to use after training
1. Download artifacts into this same path inside the repo.
2. Run triple extraction:
   ```bash
   python3 scripts/extract-triples.py \
     --model-dir training/artifacts/scibert-scierc-relation \
     --input-file data/abstracts.txt \
     --output-file data/extracted_triples.jsonl
   ```
3. Seed MongoDB with extracted triples:
   ```bash
   npm run seed:extractions -- --file data/extracted_triples.jsonl --replace
   ```
