/** Plain objects for seeding — match KnowledgeTriple fields */
export type SeedTriple = {
  subject: string;
  predicate: string;
  object: string;
  confidenceScore: number;
  sourceQuality: number;
  timestamp: Date;
};

function d(monthsAgo: number): Date {
  const t = new Date();
  t.setMonth(t.getMonth() - monthsAgo);
  return t;
}

/**
 * Curated scientific triples forming multi-hop paths for GraphRAG demos
 * (e.g. drug → pathway → disease).
 */
export const SCIENTIFIC_SEED_TRIPLES: SeedTriple[] = [
  {
    subject: "Paracetamol",
    predicate: "inhibits",
    object: "Prostaglandin synthesis",
    confidenceScore: 0.92,
    sourceQuality: 41.3,
    timestamp: d(3),
  },
  {
    subject: "Prostaglandin synthesis",
    predicate: "drives",
    object: "Fever",
    confidenceScore: 0.87,
    sourceQuality: 37.8,
    timestamp: d(2),
  },
  {
    subject: "Fever",
    predicate: "associated_with",
    object: "Viral infection",
    confidenceScore: 0.84,
    sourceQuality: 35.6,
    timestamp: d(6),
  },
  {
    subject: "Ibuprofen",
    predicate: "inhibits",
    object: "COX enzymes",
    confidenceScore: 0.91,
    sourceQuality: 43.1,
    timestamp: d(1),
  },
  {
    subject: "COX enzymes",
    predicate: "increase",
    object: "Inflammation",
    confidenceScore: 0.86,
    sourceQuality: 39.4,
    timestamp: d(4),
  },
  {
    subject: "Inflammation",
    predicate: "can_cause",
    object: "Sore throat",
    confidenceScore: 0.81,
    sourceQuality: 33.7,
    timestamp: d(7),
  },
  {
    subject: "Amoxicillin",
    predicate: "treats",
    object: "Bacterial infection",
    confidenceScore: 0.93,
    sourceQuality: 45.8,
    timestamp: d(2),
  },
  {
    subject: "Bacterial infection",
    predicate: "can_cause",
    object: "Fever",
    confidenceScore: 0.82,
    sourceQuality: 36.5,
    timestamp: d(5),
  },
  {
    subject: "Cetirizine",
    predicate: "blocks",
    object: "Histamine H1 receptor",
    confidenceScore: 0.9,
    sourceQuality: 40.6,
    timestamp: d(6),
  },
  {
    subject: "Histamine H1 receptor",
    predicate: "mediates",
    object: "Sneezing",
    confidenceScore: 0.85,
    sourceQuality: 34.9,
    timestamp: d(9),
  },
  {
    subject: "Adrenaline",
    predicate: "alias_of",
    object: "Epinephrine",
    confidenceScore: 0.99,
    sourceQuality: 72.0,
    timestamp: d(24),
  },
  {
    subject: "Epinephrine",
    predicate: "used_for",
    object: "Anaphylaxis",
    confidenceScore: 0.86,
    sourceQuality: 45.0,
    timestamp: d(9),
  },
  {
    subject: "Dextromethorphan",
    predicate: "suppresses",
    object: "Cough reflex",
    confidenceScore: 0.83,
    sourceQuality: 32.4,
    timestamp: d(15),
  },
  {
    subject: "Cough reflex",
    predicate: "associated_with",
    object: "Cough",
    confidenceScore: 0.79,
    sourceQuality: 30.8,
    timestamp: d(11),
  },
];
