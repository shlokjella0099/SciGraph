import { compositeConfidenceScore } from "@/lib/confidence";
import { levenshtein } from "@/lib/levenshtein";

export type TripleLike = {
  subject: string;
  predicate: string;
  object: string;
  confidenceScore: number;
  sourceQuality: number;
  timestamp: Date;
};

/** Canonical synonym groups for simulated entity resolution */
const ENTITY_SYNONYMS: Record<string, string[]> = {
  adrenaline: ["epinephrine", "adrenaline"],
  epinephrine: ["adrenaline", "epinephrine"],
  metformin: ["metformin", "glucophage"],
  glucophage: ["metformin", "glucophage"],
  t2d: ["type 2 diabetes", "t2dm", "diabetes mellitus type 2"],
  "type 2 diabetes": ["t2dm", "type 2 diabetes", "insulin resistance"],
};

function normalizeToken(s: string): string {
  return s.trim().toLowerCase();
}

function expandQueryTerms(raw: string): Set<string> {
  const q = normalizeToken(raw);
  const terms = new Set<string>([q]);
  for (const [key, syns] of Object.entries(ENTITY_SYNONYMS)) {
    if (q.includes(key) || syns.some((s) => q.includes(s))) {
      terms.add(key);
      syns.forEach((s) => terms.add(s));
    }
  }
  return terms;
}

function nodeMatchesEntity(node: string, query: string, expanded: Set<string>): boolean {
  const n = normalizeToken(node);
  const q = normalizeToken(query);
  if (n === q) return true;
  if (n.includes(q) || q.includes(n)) return true;
  for (const t of expanded) {
    if (!t) continue;
    if (n.includes(t) || t.includes(n)) return true;
    if (n.length <= 32 && t.length <= 32 && levenshtein(n, t) <= 2) return true;
  }
  return false;
}

export type GraphEdge = {
  from: string;
  to: string;
  triple: TripleLike;
  cs: number;
};

export type DiscoveryPath = {
  hops: number;
  nodes: string[];
  edges: GraphEdge[];
  /** Geometric mean of hop Cs — favors consistent high-evidence chains */
  pathScore: number;
  rationale: string;
};

type Adjacency = Map<string, GraphEdge[]>;

function buildAdjacency(triples: TripleLike[]): Adjacency {
  const adj: Adjacency = new Map();
  const add = (from: string, edge: GraphEdge) => {
    if (!adj.has(from)) adj.set(from, []);
    adj.get(from)!.push(edge);
  };
  for (const t of triples) {
    const ts = new Date(t.timestamp);
    const csForward = compositeConfidenceScore(
      t.confidenceScore,
      t.sourceQuality,
      ts
    );
    const forward: GraphEdge = {
      from: t.subject,
      to: t.object,
      triple: { ...t, timestamp: ts },
      cs: csForward,
    };
    add(t.subject, forward);
    /* Undirected exploration for multi-hop association discovery */
    const reverse: GraphEdge = {
      from: t.object,
      to: t.subject,
      triple: { ...t, timestamp: ts },
      cs: csForward,
    };
    add(t.object, reverse);
  }
  return adj;
}

function geometricMean(values: number[]): number {
  if (values.length === 0) return 0;
  const prod = values.reduce((a, v) => a * Math.max(v, 1e-9), 1);
  return Math.pow(prod, 1 / values.length);
}

/**
 * Simulated GraphRAG: 3-hop bounded traversal from seed entities derived from
 * the query (synonyms + Levenshtein), not a flat keyword scan over triple rows.
 */
export function discoverGraphRagPaths(
  query: string,
  triples: TripleLike[],
  maxHops: number = 3,
  maxPaths: number = 24
): DiscoveryPath[] {
  const expanded = expandQueryTerms(query);
  const nodes = new Set<string>();
  for (const t of triples) {
    nodes.add(t.subject);
    nodes.add(t.object);
  }

  const seeds: string[] = [];
  for (const n of nodes) {
    if (nodeMatchesEntity(n, query, expanded)) seeds.push(n);
  }
  if (seeds.length === 0) return [];

  const adj = buildAdjacency(triples);
  const paths: DiscoveryPath[] = [];
  const seen = new Set<string>();

  for (const seed of seeds) {
    type State = { node: string; hops: number; edges: GraphEdge[]; visited: Set<string> };
    const queue: State[] = [
      { node: seed, hops: 0, edges: [], visited: new Set([seed]) },
    ];

    while (queue.length) {
      const cur = queue.shift()!;
      if (cur.hops > 0 && cur.hops <= maxHops) {
        const nodeList = [seed, ...cur.edges.map((e) => e.to)];
        const key = nodeList.join("→");
        if (!seen.has(key)) {
          seen.add(key);
          const scores = cur.edges.map((e) => e.cs);
          const rationale =
            cur.hops >= 2
              ? `${maxHops}-hop latent association chain (GraphRAG expansion from seed "${seed}")`
              : `Direct neighborhood expansion from resolved entity "${seed}"`;
          paths.push({
            hops: cur.hops,
            nodes: nodeList,
            edges: cur.edges,
            pathScore: geometricMean(scores),
            rationale,
          });
        }
      }
      if (cur.hops >= maxHops) continue;
      const outs = adj.get(cur.node) ?? [];
      for (const e of outs) {
        if (cur.visited.has(e.to)) continue;
        const visited = new Set(cur.visited);
        visited.add(e.to);
        queue.push({
          node: e.to,
          hops: cur.hops + 1,
          edges: [...cur.edges, e],
          visited,
        });
      }
    }
  }

  paths.sort((a, b) => b.pathScore - a.pathScore);
  return paths.slice(0, maxPaths);
}
