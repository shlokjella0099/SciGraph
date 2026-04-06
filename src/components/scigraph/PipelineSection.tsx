"use client";

import { motion } from "framer-motion";

const STAGES = [
  {
    title: "Layout-Aware Ingestion",
    badge: "CV + OCR",
    body: "Scientific PDFs are parsed with layout-preserving computer vision: two-column regions, figures, and tables are segmented before text extraction to preserve citation context and structural semantics.",
  },
  {
    title: "Semantic Triple Extraction",
    badge: "SciBERT-class",
    body: "Token-classification heads inspired by SciBERT identify subject–predicate–object spans in biomedical and materials abstracts, emitting provisional triples with per-token calibration for M_conf.",
  },
  {
    title: "Entity Resolution",
    badge: "Levenshtein + KB",
    body: "Surface forms such as “Adrenaline” and “Epinephrine” are normalized via string similarity (Levenshtein distance), dictionary synonyms, and optional UMLS/CheBI crosswalks before graph insertion.",
  },
  {
    title: "GraphRAG Reasoning",
    badge: "k-hop retrieval",
    body: "The discovery engine performs bounded multi-hop expansion over the knowledge graph, ranking chains with Cs = (M_conf × S_cred) / D_age to surface non-obvious associations for downstream generation.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function PipelineSection() {
  return (
    <section className="relative border-y border-white/5 bg-slate-950/50 px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-serif text-2xl font-semibold text-slate-50 sm:text-3xl">
            Interactive extraction pipeline
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            End-to-end flow from noisy PDFs to ranked GraphRAG evidence—aligned
            with how SciGraph-style systems combine vision, language models, and
            graph retrieval.
          </p>
        </motion.div>

        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {STAGES.map((s, i) => (
            <motion.li
              key={s.title}
              variants={item}
              className="glass-panel relative overflow-hidden rounded-2xl p-5"
            >
              <div className="absolute right-4 top-4 text-5xl font-serif font-bold text-white/[0.04]">
                {i + 1}
              </div>
              <span className="inline-block rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-200">
                {s.badge}
              </span>
              <h3 className="mt-3 font-serif text-lg font-semibold text-slate-100">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {s.body}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
