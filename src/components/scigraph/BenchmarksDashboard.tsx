"use client";

import { motion } from "framer-motion";

/**
 * Numbers and claims are taken from the cited papers (see `source` on each row).
 * This UI does not claim the SciGraph demo reproduces those experiments—it only
 * grounds the “model story” in published literature.
 */
const BENCHMARKS = [
  {
    label: "Multi-task scientific NLP (macro F₁, test)",
    primary: "79.27",
    primarySub: "SciBERT (finetuned)",
    comparison: "76.01",
    comparisonSub: "BERT-Base (finetuned)",
    detail:
      "Macro-averaged test F₁ across the task suite in Table 1 (NER, PICO, REL, CLS, etc.); ChemProt uses micro F₁ and DEP uses LAS/UAS as in the paper.",
    source: {
      cite: "Beltagy, Lo & Cohan — SciBERT",
      url: "https://arxiv.org/abs/1903.10676",
      ref: "arXiv:1903.10676 · Table 1 (summary row)",
    },
    highlight: true,
  },
  {
    label: "ChemProt relation classification (micro F₁)",
    primary: "83.64",
    primarySub: "SciBERT (finetuned)",
    comparison: "75.03",
    comparisonSub: "BERT-Base (finetuned)",
    detail:
      "Binary/typed relation prediction on chemical–protein interactions; reported as micro F₁ in SciBERT Table 1.",
    source: {
      cite: "Beltagy, Lo & Cohan — SciBERT",
      url: "https://arxiv.org/abs/1903.10676",
      ref: "arXiv:1903.10676 · Table 1 (ChemProt)",
    },
  },
  {
    label: "Global sensemaking answers (LLM-as-judge)",
    primary: "Higher",
    primarySub: "GraphRAG (graph index + community summaries)",
    comparison: "Lower",
    comparisonSub: "Conventional vector RAG baseline",
    detail:
      "On global questions over ~1M-token private corpora, the authors report substantially better comprehensiveness and diversity of generated answers versus a conventional RAG baseline (same class of LLM).",
    source: {
      cite: "Edge et al. — From Local to Global (GraphRAG)",
      url: "https://arxiv.org/abs/2404.16130",
      ref: "arXiv:2404.16130 · Abstract & evaluation section",
    },
  },
  {
    label: "SciBERT pretraining corpus (scale)",
    primary: "3.17B",
    primarySub: "tokens (Semantic Scholar sample)",
    comparison: "1.14M",
    comparisonSub: "full-text papers in pretraining mix",
    detail:
      "Corpus statistics from the SciBERT paper (82% biomedical / 18% CS by paper count); vocabulary overlap with original BERT WordPiece is ~42%.",
    source: {
      cite: "Beltagy, Lo & Cohan — SciBERT",
      url: "https://arxiv.org/abs/1903.10676",
      ref: "arXiv:1903.10676 · §2 Methods",
    },
  },
  {
    label: "KG-based literature exploration (system goal)",
    primary: "KG + subgraph UI",
    primarySub: "DiscoverPath (biomedical)",
    comparison: "Keyword-only",
    comparisonSub: "Typical search (limitations discussed)",
    detail:
      "DiscoverPath builds a knowledge graph from abstract NER/POS relations and presents focused subgraphs plus query recommendations for interdisciplinary retrieval; the paper motivates limitations of terminology mismatch in keyword search.",
    source: {
      cite: "Chuang et al. — DiscoverPath",
      url: "https://arxiv.org/abs/2309.01808",
      ref: "arXiv:2309.01808",
    },
  },
];

export function BenchmarksDashboard() {
  return (
    <section className="relative px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-serif text-2xl font-semibold text-slate-50 sm:text-3xl">
            Literature-grounded benchmarks
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Quantitative and qualitative results reported in the cited research—not
            measurements produced by this course demo. Use the links to verify
            tables and experimental settings in the original papers.
          </p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-2">
          {BENCHMARKS.map((b, i) => (
            <motion.article
              key={b.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={
                b.highlight
                  ? "glass-panel relative overflow-hidden rounded-2xl border-cyan-500/30 p-6 ring-1 ring-cyan-400/20"
                  : "glass-panel rounded-2xl p-6"
              }
            >
              {b.highlight && (
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/20 blur-2xl" />
              )}
              <h3 className="font-serif text-lg font-semibold text-slate-100">
                {b.label}
              </h3>
              <div className="mt-4 flex flex-wrap items-end gap-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-cyan-300/80">
                    {b.primarySub}
                  </p>
                  <p
                    className={
                      b.highlight
                        ? "font-mono text-3xl font-bold text-cyan-300"
                        : "font-mono text-2xl font-semibold text-slate-100"
                    }
                  >
                    {b.primary}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" aria-hidden />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    {b.comparisonSub}
                  </p>
                  <p className="font-mono text-xl text-slate-400">{b.comparison}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                {b.detail}
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
                <span className="text-slate-500">Source: </span>
                <a
                  href={b.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400/90 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-300"
                >
                  {b.source.cite}
                </a>
                <span className="text-slate-600"> · {b.source.ref}</span>
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
