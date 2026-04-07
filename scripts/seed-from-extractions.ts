import "dotenv/config";
import mongoose from "mongoose";
import { readFile } from "node:fs/promises";
import { KnowledgeTriple } from "../src/models/KnowledgeTriple";

type TripleInput = {
  subject: string;
  predicate: string;
  object: string;
  confidenceScore?: number;
  sourceQuality?: number;
  timestamp?: string;
};

function parseArgs(argv: string[]) {
  const args = new Map<string, string | boolean>();
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i];
    if (!v) continue;
    if (v === "--replace") {
      args.set("replace", true);
      continue;
    }
    if (v.startsWith("--")) {
      const key = v.slice(2);
      const val = argv[i + 1];
      if (val && !val.startsWith("--")) {
        args.set(key, val);
        i++;
      } else {
        args.set(key, true);
      }
    }
  }
  return {
    file: String(args.get("file") ?? ""),
    replace: Boolean(args.get("replace")),
  };
}

function isTripleLike(v: unknown): v is TripleInput {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.subject === "string" &&
    typeof o.predicate === "string" &&
    typeof o.object === "string"
  );
}

async function loadJsonl(path: string) {
  const raw = await readFile(path, "utf-8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const out: Array<{
    subject: string;
    predicate: string;
    object: string;
    confidenceScore: number;
    sourceQuality: number;
    timestamp: Date;
  }> = [];

  for (const [idx, line] of lines.entries()) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      throw new Error(`Invalid JSON on line ${idx + 1}`);
    }
    if (!isTripleLike(parsed)) {
      throw new Error(`Missing required triple fields on line ${idx + 1}`);
    }
    out.push({
      subject: parsed.subject.trim(),
      predicate: parsed.predicate.trim(),
      object: parsed.object.trim(),
      confidenceScore: Math.max(0, Math.min(1, Number(parsed.confidenceScore ?? 0.6))),
      sourceQuality: Number(parsed.sourceQuality ?? 10),
      timestamp: parsed.timestamp ? new Date(parsed.timestamp) : new Date(),
    });
  }
  return out;
}

async function main() {
  const { file, replace } = parseArgs(process.argv.slice(2));
  if (!file) {
    throw new Error("Usage: npm run seed:extractions -- --file data/extracted_triples.jsonl [--replace]");
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment.");
  }

  const triples = await loadJsonl(file);
  if (triples.length === 0) {
    throw new Error("No triples found in JSONL input.");
  }

  await mongoose.connect(uri);
  if (replace) {
    await KnowledgeTriple.deleteMany({});
  }
  await KnowledgeTriple.insertMany(triples);
  const total = await KnowledgeTriple.countDocuments();
  await mongoose.disconnect();

  console.log(
    `Inserted ${triples.length} triples from ${file}. Collection total: ${total}.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
