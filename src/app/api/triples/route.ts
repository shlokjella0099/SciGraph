import { NextResponse } from "next/server";
import { connectMongo, MONGODB_URI } from "@/lib/mongodb";
import { KnowledgeTriple } from "@/models/KnowledgeTriple";
import { SCIENTIFIC_SEED_TRIPLES } from "@/lib/seed-triples";

export async function GET() {
  try {
    if (!MONGODB_URI) {
      return NextResponse.json({
        source: "static_seed",
        count: SCIENTIFIC_SEED_TRIPLES.length,
        triples: SCIENTIFIC_SEED_TRIPLES.map((t) => ({
          ...t,
          timestamp:
            t.timestamp instanceof Date
              ? t.timestamp.toISOString()
              : new Date(t.timestamp).toISOString(),
        })),
      });
    }
    await connectMongo();
    const rows = await KnowledgeTriple.find().sort({ timestamp: -1 }).lean().exec();
    return NextResponse.json({
      source: "mongodb",
      count: rows.length,
      triples: rows.map((t) => ({
        id: String(t._id),
        subject: t.subject,
        predicate: t.predicate,
        object: t.object,
        confidenceScore: t.confidenceScore,
        sourceQuality: t.sourceQuality,
        timestamp: t.timestamp.toISOString(),
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load triples", triples: [] },
      { status: 500 }
    );
  }
}
