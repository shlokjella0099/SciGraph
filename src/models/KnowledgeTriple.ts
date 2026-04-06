import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const knowledgeTripleSchema = new Schema(
  {
    subject: { type: String, required: true, index: true },
    predicate: { type: String, required: true },
    object: { type: String, required: true, index: true },
    /** M_conf — model confidence ∈ [0, 1] */
    confidenceScore: { type: Number, required: true, min: 0, max: 1 },
    /** S_cred — journal impact / source credibility (IF-scale proxy) */
    sourceQuality: { type: Number, required: true, min: 0 },
    timestamp: { type: Date, required: true, index: true },
  },
  { collection: "knowledge_triples" }
);

knowledgeTripleSchema.index({ subject: 1, object: 1 });

export type KnowledgeTripleDoc = InferSchemaType<typeof knowledgeTripleSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const KnowledgeTriple: Model<KnowledgeTripleDoc> =
  mongoose.models.KnowledgeTriple ||
  mongoose.model<KnowledgeTripleDoc>("KnowledgeTriple", knowledgeTripleSchema);
