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
    subject: "Graphene",
    predicate: "exhibits",
    object: "Superconductivity",
    confidenceScore: 0.82,
    sourceQuality: 44.7,
    timestamp: d(8),
  },
  {
    subject: "Metformin",
    predicate: "inhibits",
    object: "MTOR pathway",
    confidenceScore: 0.91,
    sourceQuality: 56.2,
    timestamp: d(3),
  },
  {
    subject: "Metformin",
    predicate: "activates",
    object: "AMPK",
    confidenceScore: 0.88,
    sourceQuality: 52.1,
    timestamp: d(2),
  },
  {
    subject: "AMPK",
    predicate: "negatively_regulates",
    object: "MTOR pathway",
    confidenceScore: 0.85,
    sourceQuality: 48.3,
    timestamp: d(5),
  },
  {
    subject: "MTOR pathway",
    predicate: "implicated_in",
    object: "Insulin resistance",
    confidenceScore: 0.79,
    sourceQuality: 41.2,
    timestamp: d(6),
  },
  {
    subject: "Insulin resistance",
    predicate: "risk_factor_for",
    object: "Type 2 Diabetes",
    confidenceScore: 0.93,
    sourceQuality: 61.4,
    timestamp: d(1),
  },
  {
    subject: "MTOR pathway",
    predicate: "modulates",
    object: "Autophagy",
    confidenceScore: 0.77,
    sourceQuality: 38.9,
    timestamp: d(10),
  },
  {
    subject: "Rapamycin",
    predicate: "inhibits",
    object: "MTOR pathway",
    confidenceScore: 0.94,
    sourceQuality: 58.7,
    timestamp: d(4),
  },
  {
    subject: "Epinephrine",
    predicate: "binds_to",
    object: "Beta-2 adrenergic receptor",
    confidenceScore: 0.89,
    sourceQuality: 49.5,
    timestamp: d(7),
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
    subject: "Beta-2 adrenergic receptor",
    predicate: "mediates",
    object: "Bronchodilation",
    confidenceScore: 0.86,
    sourceQuality: 45.0,
    timestamp: d(9),
  },
  {
    subject: "Graphene",
    predicate: "interacts_with",
    object: "Phonon modes",
    confidenceScore: 0.71,
    sourceQuality: 35.2,
    timestamp: d(14),
  },
  {
    subject: "Phonon modes",
    predicate: "couple_to",
    object: "Electron pairing",
    confidenceScore: 0.68,
    sourceQuality: 33.1,
    timestamp: d(15),
  },
  {
    subject: "Electron pairing",
    predicate: "enables",
    object: "Superconductivity",
    confidenceScore: 0.74,
    sourceQuality: 40.5,
    timestamp: d(11),
  },
];
