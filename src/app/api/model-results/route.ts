import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

type StoredResults = {
  model_name?: string;
  dataset?: string;
  test_metrics?: {
    eval_micro_f1?: number;
    eval_macro_f1?: number;
    micro_f1?: number;
    macro_f1?: number;
  };
};

export async function GET() {
  const baseline = {
    bertBaseMicroF1: 0.7503,
    scibertPaperMicroF1: 0.8364,
  };

  try {
    const p = path.join(process.cwd(), "training", "results.json");
    const raw = await readFile(p, "utf-8");
    const parsed = JSON.parse(raw) as StoredResults;
    const tm = parsed.test_metrics ?? {};
    const micro = tm.eval_micro_f1 ?? tm.micro_f1 ?? null;
    const macro = tm.eval_macro_f1 ?? tm.macro_f1 ?? null;

    return NextResponse.json({
      available: micro !== null || macro !== null,
      modelName: parsed.model_name ?? "Trained model",
      dataset: parsed.dataset ?? "SciERC",
      microF1: micro,
      macroF1: macro,
      baseline,
    });
  } catch {
    return NextResponse.json({
      available: false,
      modelName: "Trained model",
      dataset: "SciERC",
      microF1: null,
      macroF1: null,
      baseline,
    });
  }
}
