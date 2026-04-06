/**
 * Composite confidence score used for GraphRAG ranking:
 * Cs = (M_conf × S_cred) / D_age
 *
 * D_age: document age in **years** (fractional), floored to avoid division blow-ups on same-day ingest.
 */
export function compositeConfidenceScore(
  modelConfidence: number,
  sourceCredibility: number,
  documentTimestamp: Date,
  now: Date = new Date()
): number {
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const ageYears = Math.max(msPerYear / 12, now.getTime() - documentTimestamp.getTime()) / msPerYear;
  return (modelConfidence * sourceCredibility) / ageYears;
}
