# SciGraph

SciGraph is a Next.js + MongoDB research demo for scientific knowledge graph discovery:
- dark academic UI with GraphRAG-style 3-hop traversal
- confidence ranking with `Cs = (M_conf × S_cred) / D_age`
- real model training workflow for relation extraction using SciBERT on SciERC

## 1) Run the web app

```bash
cd ~/scigraph2
npm install
npm run dev
```

Open `http://localhost:3000`.

## 2) Configure MongoDB

Create `.env` from `.env.example`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/scigraph
```

Optional bootstrap with curated sample triples:

```bash
npm run seed
```

## 3) Train the real extractor model (Google Colab GPU)

Use notebook:

- `training/colab_scierc_relation_extraction.ipynb`

Dataset:

- SciERC (`allenai/scierc`)

Base model:

- `allenai/scibert_scivocab_uncased`

Notebook outputs:

- `training/artifacts/scibert-scierc-relation/`
- `training/results.json` (includes micro/macro F1)

Detailed training notes:

- `training/README.md`

## 4) Generate triples with the trained model

After downloading model artifacts into `training/artifacts/scibert-scierc-relation/`, run:

```bash
python3 scripts/extract-triples.py \
  --model-dir training/artifacts/scibert-scierc-relation \
  --input-file data/abstracts.txt \
  --output-file data/extracted_triples.jsonl \
  --source-quality 12.0 \
  --min-confidence 0.45
```

Input formats accepted by `extract-triples.py`:
- plain text lines (heuristic entity pairs)
- TSV lines: `subject<TAB>object<TAB>context`

## 5) Seed MongoDB with extracted triples

```bash
npm run seed:extractions -- --file data/extracted_triples.jsonl --replace
```

Flags:
- `--file` JSONL emitted by extractor
- `--replace` optionally clears existing collection before insert

## 6) Verify end-to-end pipeline

1. Start app: `npm run dev`
2. Query the discovery UI with entities present in your extracted triples
3. Confirm APIs:
   - `GET /api/triples`
   - `POST /api/discover`

## Project structure (model pipeline)

- Training notebook: `training/colab_scierc_relation_extraction.ipynb`
- Inference CLI: `scripts/extract-triples.py`
- Mongo seeding from extracted triples: `scripts/seed-from-extractions.ts`
- Triple schema: `src/models/KnowledgeTriple.ts`
