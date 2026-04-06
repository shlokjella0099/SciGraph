import { NextResponse } from "next/server";
import { connectMongo, MONGODB_URI } from "@/lib/mongodb";
import { KnowledgeTriple } from "@/models/KnowledgeTriple";
import { SCIENTIFIC_SEED_TRIPLES } from "@/lib/seed-triples";
import {
  discoverGraphRagPaths,
  type TripleLike,
} from "@/lib/graph-discovery";

function toTripleLike(
  rows: Array<{
    subject: string;
    predicate: string;
    object: string;
    confidenceScore: number;
    sourceQuality: number;
    timestamp: Date;
  }>
): TripleLike[] {
  return rows.map((r) => ({
    ...r,
    timestamp: new Date(r.timestamp),
  }));
}

export async function POST(req: Request) {
  let query = "";
  try {
    const body = await req.json();
    query = typeof body.query === "string" ? body.query.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  try {
    let triples: TripleLike[] = [];

    if (MONGODB_URI) {
      try {
        await connectMongo();
        const rows = await KnowledgeTriple.find().lean().exec();
        triples = toTripleLike(
          rows.map((t) => ({
            subject: t.subject,
            predicate: t.predicate,
            object: t.object,
            confidenceScore: t.confidenceScore,
            sourceQuality: t.sourceQuality,
            timestamp: t.timestamp,
          }))
        );
      } catch (dbErr) {
        console.warn("Mongo unavailable, falling back to seed graph:", dbErr);
        triples = toTripleLike(
          SCIENTIFIC_SEED_TRIPLES.map((t) => ({
            ...t,
            timestamp:
              t.timestamp instanceof Date ? t.timestamp : new Date(t.timestamp),
          }))
        );
      }
    } else {
      triples = toTripleLike(
        SCIENTIFIC_SEED_TRIPLES.map((t) => ({
          ...t,
          timestamp:
            t.timestamp instanceof Date ? t.timestamp : new Date(t.timestamp),
        }))
      );
    }

    const paths = discoverGraphRagPaths(query, triples, 3, 28);

    return NextResponse.json({
      query,
      engine: "scigraph-graphrag-v1",
      hopLimit: 3,
      tripleCount: triples.length,
      paths: paths.map((p) => ({
        hops: p.hops,
        nodes: p.nodes,
        pathScore: p.pathScore,
        rationale: p.rationale,
        edges: p.edges.map((e) => ({
          from: e.from,
          to: e.to,
          predicate: e.triple.predicate,
          cs: e.cs,
          mConf: e.triple.confidenceScore,
          sCred: e.triple.sourceQuality,
          timestamp: e.triple.timestamp.toISOString(),
        })),
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}
