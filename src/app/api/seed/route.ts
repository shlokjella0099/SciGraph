import { NextResponse } from "next/server";
import { connectMongo, MONGODB_URI } from "@/lib/mongodb";
import { KnowledgeTriple } from "@/models/KnowledgeTriple";
import { SCIENTIFIC_SEED_TRIPLES } from "@/lib/seed-triples";

/**
 * POST /api/seed — inserts curated scientific triples (dev / admin convenience).
 * Disable in production by omitting SEED_SECRET or wrong header.
 */
export async function POST(req: Request) {
  const secret = process.env.SEED_SECRET;
  if (secret) {
    const auth = req.headers.get("x-seed-secret");
    if (auth !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!MONGODB_URI) {
    return NextResponse.json(
      { error: "MONGODB_URI not configured", inserted: 0 },
      { status: 503 }
    );
  }

  try {
    await connectMongo();
    const existing = await KnowledgeTriple.countDocuments();
    if (existing > 0 && process.env.SEED_FORCE !== "1") {
      return NextResponse.json({
        skipped: true,
        message: "Collection non-empty; set SEED_FORCE=1 to replace.",
        count: existing,
      });
    }
    if (process.env.SEED_FORCE === "1") {
      await KnowledgeTriple.deleteMany({});
    }
    await KnowledgeTriple.insertMany(SCIENTIFIC_SEED_TRIPLES);
    const count = await KnowledgeTriple.countDocuments();
    return NextResponse.json({ inserted: SCIENTIFIC_SEED_TRIPLES.length, count });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
