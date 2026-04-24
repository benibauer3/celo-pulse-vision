import { createFileRoute } from "@tanstack/react-router";
import { SectionCard, ActionItem } from "@/components/ui-celo";
import { proposals } from "@/data/projects";

export const Route = createFileRoute("/governance")({
  head: () => ({
    meta: [
      { title: "Governance — Celo Pulse" },
      { name: "description", content: "Latest CGP proposals from Celo Mondo, focused on real use cases and ecosystem growth." },
    ],
  }),
  component: GovernancePage,
});

function GovernancePage() {
  const treasury = proposals.filter((p) => p.category === "Treasury" || p.category === "Tokenomics");
  const network = proposals.filter((p) => p.category === "Network" || p.category === "Ecosystem");

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-24 md:pb-10">
      <header className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-celo-onyx/50 mb-3">
          Celo Governance Proposals
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl text-celo-onyx leading-none tracking-tight mb-4">
          Governance in action
        </h1>
        <p className="text-base sm:text-lg text-celo-onyx/70 max-w-2xl mb-6">
          Most recent CGPs from Celo Mondo — including CGP-234.
        </p>
        <a
          href="https://forum.celo.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-celo-onyx text-celo-cream px-5 py-2.5 text-sm font-semibold hover:bg-celo-onyx/90 transition"
        >
          Discuss on Celo Forum ↗
        </a>
      </header>

      <div className="grid grid-cols-1 gap-5">
        <SectionCard title="Treasury & Tokenomics">
          {treasury.map((p) => (
            <ActionItem
              key={p.id}
              label={`${p.id}: ${p.title}`}
              sub={`${p.category} • Yes ${p.yes ?? "—"} · No ${p.no ?? "—"}`}
              badge={p.status}
              href={p.url}
            />
          ))}
        </SectionCard>

        <SectionCard title="Network & Ecosystem">
          {network.map((p) => (
            <ActionItem
              key={p.id}
              label={`${p.id}: ${p.title}`}
              sub={`${p.category} • Yes ${p.yes ?? "—"} · No ${p.no ?? "—"}`}
              badge={p.status}
              href={p.url}
            />
          ))}
        </SectionCard>
      </div>
    </div>
  );
}
