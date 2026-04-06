"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <header className="relative overflow-hidden px-6 pb-16 pt-20 sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.18),transparent)]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-5xl text-center"
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-cyan-300/80">
          Knowledge Graph · GraphRAG
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
          SciGraph
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          A research-grade platform for large-scale scientific triples, multi-hop
          GraphRAG discovery, and evidence-weighted ranking using composite
          confidence scoring.
        </p>
      </motion.div>
    </header>
  );
}
