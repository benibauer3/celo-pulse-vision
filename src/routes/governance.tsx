import { createFileRoute } from "@tanstack/react-router";
import { SectionCard, ActionItem } from "@/components/ui-celo";
import { proposals } from "@/data/projects";

export const Route = createFileRoute("/governance")({
  head: () => ({
    meta: [
      { title: "Governança — Celo Pulse" },
      { name: "description", content: "Propostas CGP em votação, focadas em casos de uso real e crescimento do ecossistema Celo." },
    ],
  }),
  component: GovernancePage,
});

function GovernancePage() {
  const real = proposals.filter((p) => p.category === "Adoção" || p.category === "Ecossistema" || p.category === "Builders");
  const treasury = proposals.filter((p) => p.category === "Tesouro" || p.category === "Rede");

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16">
      <header className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-celo-onyx/50 mb-3">
          Celo Governance Proposals
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl text-celo-onyx leading-none tracking-tight mb-4">
          Governança em ação
        </h1>
        <p className="text-base sm:text-lg text-celo-onyx/70 max-w-2xl">
          Propostas CGPs ativas — priorizando casos de uso real e crescimento do ecossistema Celo.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5">
        <SectionCard title="Real Use Cases · Crescimento do Ecossistema">
          {real.map((p) => (
            <ActionItem
              key={p.id}
              label={`${p.id}: ${p.title}`}
              sub={`Solicitação: ${p.request} • ${p.category}`}
              badge={p.status}
              href={p.url}
            />
          ))}
        </SectionCard>

        <SectionCard title="Tesouro & Parâmetros de Rede">
          {treasury.map((p) => (
            <ActionItem
              key={p.id}
              label={`${p.id}: ${p.title}`}
              sub={`Solicitação: ${p.request} • ${p.category}`}
              badge={p.status}
              href={p.url}
            />
          ))}
        </SectionCard>
      </div>
    </div>
  );
}
