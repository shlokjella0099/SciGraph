import "dotenv/config";
import mongoose from "mongoose";
import { KnowledgeTriple } from "../src/models/KnowledgeTriple";
import { SCIENTIFIC_SEED_TRIPLES } from "../src/lib/seed-triples";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Set MONGODB_URI in .env");
    process.exit(1);
  }
  await mongoose.connect(uri);
  await KnowledgeTriple.deleteMany({});
  await KnowledgeTriple.insertMany(SCIENTIFIC_SEED_TRIPLES);
  console.log(`Seeded ${SCIENTIFIC_SEED_TRIPLES.length} knowledge triples.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
