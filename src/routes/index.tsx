import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchCommunityFundBalance, fetchValidatorCount, fetchLatestBlock } from "@/lib/celo";
import { truncateAddress } from "@/lib/minipay";
import { SectionCard, ActionItem, Kpi } from "@/components/ui-celo";
import { proposals } from "@/data/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Celo Pulse — Tesouro & Governança" },
      { name: "description", content: "Saldo do Community Fund, propostas aprovadas e saúde do ecossistema Celo." },
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

  const approved = proposals.filter((p) => p.status === "Executada" || p.status === "Adotada").length;
  const voting = proposals.filter((p) => p.status === "Em votação").length;
  const totalCgps = 234; // most recent CGP number on Mondo

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-24 md:pb-10">
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
        <p className="text-base sm:text-lg text-celo-onyx/70 max-w-2xl leading-relaxed mb-6">
          {isConnected
            ? `Bem-vindo. Sua carteira ${truncateAddress(address)} está conectada à rede Celo.`
            : "Transparência absoluta. Monitorando o tesouro de governança da rede Celo em tempo real."}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://forum.celo.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-celo-onyx text-celo-cream px-5 py-2.5 text-sm font-semibold hover:bg-celo-onyx/90 transition"
          >
            Discussões no Fórum Celo ↗
          </a>
          <a
            href="https://mondo.celo.org/governance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-celo-yellow text-celo-onyx border-2 border-celo-onyx px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
          >
            Ver no Celo Mondo ↗
          </a>
        </div>
      </section>

      {/* KPI bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-14 sm:mb-20">
        <Kpi
          label="Total de CGPs"
          value={`${totalCgps}`}
          hint="Propostas registradas"
          accent
        />
        <Kpi
          label="Aprovadas / Executadas"
          value={`${approved}`}
          hint="Últimas no Mondo"
        />
        <Kpi
          label="Em votação"
          value={`${voting}`}
          hint="Aguardando quorum"
        />
        <Kpi
          label="Network Health"
          value="99.9%"
          hint={validators !== null ? `${validators} validadores` : "Uptime médio"}
        />
      </section>

      {/* Recent proposals */}
      <div className="grid grid-cols-1 gap-5 mb-10">
        <SectionCard
          title="Propostas Recentes · Celo Mondo"
          action={
            <a
              href="https://mondo.celo.org/governance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-celo-onyx/70 hover:text-celo-onyx underline underline-offset-2"
            >
              Ver todas ↗
            </a>
          }
        >
          {proposals.slice(0, 4).map((p) => (
            <ActionItem
              key={p.id}
              label={`${p.id}: ${p.title}`}
              sub={`${p.category}${p.yes ? ` • Sim ${p.yes}` : ""}${p.no ? ` • Não ${p.no}` : ""}`}
              badge={p.status}
              href={p.url}
            />
          ))}
        </SectionCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SectionCard title="Comunidade & Discussão">
            <ActionItem
              label="Fórum oficial Celo"
              sub="Debata propostas antes do on-chain"
              badge="Live"
              href="https://forum.celo.org/"
            />
            <ActionItem
              label="GitHub CGPs"
              sub="Repositório oficial das Celo Governance Proposals"
              href="https://github.com/celo-org/governance"
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
              label={block ? `Bloco atual #${block.toString()}` : "Bloco atual —"}
              sub="Celo Mainnet • chainId 42220"
              href="https://celoscan.io"
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
