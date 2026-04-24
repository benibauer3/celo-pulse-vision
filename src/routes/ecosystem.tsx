import { createFileRoute } from "@tanstack/react-router";
import { SectionCard } from "@/components/ui-celo";
import { proofOfShipProjects } from "@/data/projects";

export const Route = createFileRoute("/ecosystem")({
  head: () => ({
    meta: [
      { title: "Ecosystem — Celo Pulse" },
      { name: "description", content: "20 projects in the Celo Proof of Ship pipeline, with status, category and milestones." },
    ],
  }),
  component: EcosystemPage,
});

const STATUS_STYLE: Record<string, string> = {
  Funded: "bg-celo-green text-white",
  Shipped: "bg-celo-onyx text-celo-cream",
  Building: "bg-celo-yellow text-celo-onyx border border-celo-onyx",
  Reviewing: "bg-white text-celo-onyx border border-celo-onyx/30",
};

function EcosystemPage() {
  const byStatus = {
    Funded: proofOfShipProjects.filter((p) => p.status === "Funded").length,
    Shipped: proofOfShipProjects.filter((p) => p.status === "Shipped").length,
    Building: proofOfShipProjects.filter((p) => p.status === "Building").length,
    Reviewing: proofOfShipProjects.filter((p) => p.status === "Reviewing").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-24 md:pb-10">
      <header className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-celo-onyx/50 mb-3">
          Proof of Ship Pipeline
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl text-celo-onyx leading-none tracking-tight mb-4">
          20 projects building on Celo
        </h1>
        <p className="text-base sm:text-lg text-celo-onyx/70 max-w-2xl">
          Live tracking of Proof of Ship projects — from MVPs in review to products with traction.
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          {(Object.entries(byStatus) as [keyof typeof byStatus, number][]).map(([k, v]) => (
            <span
              key={k}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLE[k]}`}
            >
              {v} {k}
            </span>
          ))}
        </div>
      </header>

      <SectionCard title="Pipeline · 20 Projects">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {proofOfShipProjects.map((p) => (
            <div
              key={p.name}
              className="bg-celo-cream border border-celo-onyx/10 rounded-xl p-4 hover:border-celo-onyx/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-serif text-lg text-celo-onyx leading-tight">{p.name}</h3>
                <span
                  className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${STATUS_STYLE[p.status]}`}
                >
                  {p.status}
                </span>
              </div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-celo-onyx/50 mb-2">
                {p.category}
              </div>
              <p className="text-sm text-celo-onyx/70 leading-relaxed mb-3">{p.description}</p>
              <div className="text-xs text-celo-onyx/60 border-t border-celo-onyx/10 pt-2">
                <span className="font-semibold">Milestone:</span> {p.milestone}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
