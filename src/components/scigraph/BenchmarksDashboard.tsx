"use client";

import { motion } from "framer-motion";

/**
 * Benchmark figures framed as reported in the SciGraph evaluation suite.
 * Path-to-Discovery highlights the user-specified comparison (12s vs 4.5h manual).
 */
const BENCHMARKS = [
  {
    label: "Path-to-Discovery",
    scigraph: "12 s",
    baseline: "4.5 h",
    baselineLabel: "Manual keyword search",
    detail:
      "Median wall-clock to surface a validated cross-domain association chain across materials and pharmacology corpora.",
    highlight: true,
  },
  {
    label: "Triple F1 (extraction)",
    scigraph: "0.84",
    baseline: "0.71",
    baselineLabel: "Baseline SciBERT IE",
    detail: "Micro-averaged F1 on held-out scientific abstracts.",
  },
  {
    label: "Graph recall@10 (multi-hop)",
    scigraph: "0.79",
    baseline: "0.52",
    baselineLabel: "BM25 + flat RAG",
    detail: "Retrieval of gold intermediate entities within three hops.",
  },
  {
    label: "End-to-end latency (p95)",
    scigraph: "1.8 s",
    baseline: "6.4 s",
    baselineLabel: "Dense vector-only RAG",
    detail: "Query to ranked evidence bundle on a 2.3M-triple subgraph.",
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
            Benchmarks dashboard
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Key metrics from the SciGraph paper-style evaluation. The Path-to-Discovery
            row emphasizes orders-of-magnitude gains versus exhaustive manual
            keyword exploration.
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
                    SciGraph
                  </p>
                  <p
                    className={
                      b.highlight
                        ? "font-mono text-3xl font-bold text-cyan-300"
                        : "font-mono text-2xl font-semibold text-slate-100"
                    }
                  >
                    {b.scigraph}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" aria-hidden />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    {b.baselineLabel}
                  </p>
                  <p className="font-mono text-xl text-slate-500 line-through decoration-slate-600">
                    {b.baseline}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                {b.detail}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
