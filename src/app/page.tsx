import { Hero } from "@/components/scigraph/Hero";
import { GraphRagSearch } from "@/components/scigraph/GraphRagSearch";
import { PipelineSection } from "@/components/scigraph/PipelineSection";
import { BenchmarksDashboard } from "@/components/scigraph/BenchmarksDashboard";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Hero />
      <GraphRagSearch />
      <PipelineSection />
      <BenchmarksDashboard />
      <footer className="border-t border-white/5 px-6 py-10 text-center text-xs text-slate-600 sm:px-10">
        SciGraph · BTech / research demo · MongoDB knowledge triples · Next.js App
        Router
      </footer>
    </div>
  );
}
