import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchCommunityFundBalance, fetchValidatorCount, fetchLatestBlock } from "@/lib/celo";
import { truncateAddress } from "@/lib/minipay";
import { SectionCard, ActionItem, Kpi } from "@/components/ui-celo";
import { proposals, proofOfShipProjects } from "@/data/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Celo Pulse — Tesouro & Governança" },
      { name: "description", content: "Saldo do Community Fund, propostas em votação e saúde do ecossistema Celo." },
    ],
  }),
  component: Index,
});

function Index() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<string>("Carregando...");
  const [validators, setValidators] = useState<number | null>(null);
  const [block, setBlock] = useState<bigint | null>(null);

  useEffect(() => {
    fetchCommunityFundBalance().then(setBalance);
    fetchValidatorCount().then(setValidators);
    fetchLatestBlock().then(setBlock);
  }, []);

  const activeProjects = proofOfShipProjects.filter((p) => p.status === "Building" || p.status === "Reviewing").length;
  const fundedProjects = proofOfShipProjects.filter((p) => p.status === "Funded" || p.status === "Shipped").length;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16">
      {/* Hero */}
      <section className="mb-14 sm:mb-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-celo-onyx/50 mb-4">
          Community Fund Balance
        </p>
        <h1 className="font-serif text-6xl sm:text-8xl leading-none text-celo-onyx tracking-tight mb-5">
          {balance}{" "}
          <span className="inline-block align-middle text-base sm:text-2xl font-bold bg-celo-yellow text-celo-onyx border-2 border-celo-onyx px-3 py-1.5 rounded ml-2">
            CELO
          </span>
        </h1>
        <p className="text-base sm:text-lg text-celo-onyx/70 max-w-2xl leading-relaxed">
          {isConnected
            ? `Bem-vindo. Sua carteira ${truncateAddress(address)} está conectada à rede Celo.`
            : "Transparência absoluta. Monitorando o tesouro de governança da rede Celo em tempo real."}
        </p>
      </section>

      {/* KPI bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-14 sm:mb-20">
        <Kpi
          label="Proof of Ship"
          value={`${proofOfShipProjects.length}`}
          hint="Projetos no pipeline"
          accent
        />
        <Kpi
          label="MiniPay Grants"
          value={`${fundedProjects}`}
          hint="Alocações ativas"
        />
        <Kpi
          label="Network Health"
          value="99.9%"
          hint={validators !== null ? `${validators} validadores ativos` : "Uptime médio"}
        />
        <Kpi
          label="Bloco atual"
          value={block ? `#${block.toString().slice(0, 4)}…` : "—"}
          hint="Celo Mainnet • 42220"
        />
      </section>

      {/* Governance + Ecosystem */}
      <div className="grid grid-cols-1 gap-5 mb-10">
        <SectionCard title="Propostas de Governança">
          {proposals.slice(0, 3).map((p) => (
            <ActionItem
              key={p.id}
              label={`${p.id}: ${p.title}`}
              sub={`Solicitação: ${p.request} • ${p.category}`}
              badge={p.status}
              href={p.url}
            />
          ))}
        </SectionCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SectionCard title="Ecossistema · Proof of Ship">
            <ActionItem
              label="20 Projects in Pipeline"
              sub={`${activeProjects} construindo • ${fundedProjects} financiados`}
              badge="Live"
              href="/ecosystem"
            />
            <ActionItem
              label="MiniPay Builders Cohort"
              sub="Cohort 4 • Inscrições abertas até Q2"
              href="https://www.celo.org/buildonminipay"
            />
          </SectionCard>

          <SectionCard title="Validadores & Rede">
            <ActionItem
              label="Network Health Status"
              sub="Monitoramento de Uptime e Performance"
              badge="99.9%"
              href="/validators"
            />
            <ActionItem
              label="Voting Power Distribution"
              sub="Descentralização e pesos de voto"
              href="https://mondo.celo.org/delegate"
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
