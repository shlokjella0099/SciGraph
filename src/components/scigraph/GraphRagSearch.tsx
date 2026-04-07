"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Edge = {
  from: string;
  to: string;
  predicate: string;
  cs: number;
  mConf: number;
  sCred: number;
  timestamp: string;
};

type PathResult = {
  hops: number;
  nodes: string[];
  pathScore: number;
  rationale: string;
  edges: Edge[];
};

type DiscoverResponse = {
  query: string;
  engine: string;
  hopLimit: number;
  tripleCount: number;
  paths: PathResult[];
  error?: string;
};

const SUGGESTIONS = [
  "Fever",
  "Paracetamol",
  "Ibuprofen",
  "Amoxicillin",
  "Cough",
];

export function GraphRagSearch() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DiscoverResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const run = useCallback(async () => {
    if (!q.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q.trim() }),
      });
      const json = (await res.json()) as DiscoverResponse & { error?: string };
      if (!res.ok) throw new Error(json.error || "Request failed");
      setData(json);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unknown error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [q]);

  return (
    <section className="relative px-6 pb-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-2xl p-6 sm:p-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-slate-50">
                GraphRAG Discovery Engine
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-400">
                Queries resolve to seed entities via synonym expansion and
                Levenshtein entity resolution, then traverse up to three hops
                through the knowledge graph—not a flat keyword match on rows.
              </p>
            </div>
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-200/90">
              <span className="font-mono text-cyan-400">Cs</span> = (M
              <sub className="text-[10px]">conf</sub> × S
              <sub className="text-[10px]">cred</sub>) / D
              <sub className="text-[10px]">age</sub>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="Try Fever, Paracetamol, Cough…"
              className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none ring-cyan-500/40 placeholder:text-slate-600 focus:ring-2"
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={run}
              disabled={loading || !q.trim()}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Traversing…" : "Run 3-hop discovery"}
            </motion.button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQ(s);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
              >
                {s}
              </button>
            ))}
          </div>

          {err && (
            <p className="mt-4 text-sm text-rose-400" role="alert">
              {err}
            </p>
          )}

          <AnimatePresence mode="wait">
            {data && (
              <motion.div
                key={data.query + String(data.paths?.length)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 space-y-4"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-slate-400">
                    {data.engine}
                  </span>
                  <span>Triples loaded: {data.tripleCount}</span>
                  <span>Hop cap: {data.hopLimit}</span>
                </div>

                {data.paths.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No graph paths from resolved seeds. Adjust the query or seed
                    the database.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {data.paths.map((p, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="rounded-xl border border-white/10 bg-slate-950/40 p-4"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-medium text-cyan-200/90">
                            {p.hops}-hop path · score{" "}
                            <span className="font-mono text-cyan-300">
                              {p.pathScore.toFixed(3)}
                            </span>
                          </p>
                          <p className="text-xs text-slate-500">{p.rationale}</p>
                        </div>
                        <p className="mt-2 font-mono text-xs text-slate-300">
                          {p.nodes.join(" → ")}
                        </p>
                        <ul className="mt-3 space-y-2 border-t border-white/5 pt-3">
                          {p.edges.map((e, j) => (
                            <li
                              key={j}
                              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400"
                            >
                              <span className="text-slate-200">{e.from}</span>
                              <span className="text-cyan-500/80">
                                —{e.predicate}→
                              </span>
                              <span className="text-slate-200">{e.to}</span>
                              <span className="ml-auto font-mono text-[10px] text-slate-500">
                                Cs {e.cs.toFixed(2)} · M {e.mConf.toFixed(2)} ·
                                IF {e.sCred.toFixed(1)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
