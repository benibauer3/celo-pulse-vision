import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionCard, Kpi } from "@/components/ui-celo";
import { fetchValidatorCount, fetchLatestBlock } from "@/lib/celo";
import { validatorRows } from "@/data/projects";

export const Route = createFileRoute("/validators")({
  head: () => ({
    meta: [
      { title: "Validadores — Celo Pulse" },
      { name: "description", content: "Monitoramento de uptime, voting power e saúde dos validadores da rede Celo." },
    ],
  }),
  component: ValidatorsPage,
});

function ValidatorsPage() {
  const [count, setCount] = useState<number | null>(null);
  const [block, setBlock] = useState<bigint | null>(null);

  useEffect(() => {
    fetchValidatorCount().then(setCount);
    fetchLatestBlock().then(setBlock);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16">
      <header className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-celo-onyx/50 mb-3">
          Validator Monitoring
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl text-celo-onyx leading-none tracking-tight mb-4">
          Saúde da rede Celo
        </h1>
        <p className="text-base sm:text-lg text-celo-onyx/70 max-w-2xl">
          Performance, voting power e uptime dos validadores eleitos no consenso do Celo Mainnet.
        </p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <Kpi label="Validadores" value={count !== null ? `${count}` : "—"} hint="Registrados on-chain" accent />
        <Kpi label="Uptime médio" value="99.93%" hint="Últimas 24h" />
        <Kpi label="Bloco atual" value={block ? `#${block.toString()}` : "—"} hint="Celo Mainnet" />
        <Kpi label="Block time" value="5.0s" hint="Média confirmada" />
      </section>

      <SectionCard title="Top Validadores · Voting Power & Uptime">
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-celo-onyx/50 border-b border-celo-onyx/10">
                <th className="py-3 px-3">Validador</th>
                <th className="py-3 px-3">Grupo</th>
                <th className="py-3 px-3 text-right">Voting Power</th>
                <th className="py-3 px-3 text-right">Uptime</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {validatorRows.map((v) => (
                <tr key={v.name} className="border-b border-celo-onyx/5 last:border-0">
                  <td className="py-3 px-3 font-serif text-celo-onyx">{v.name}</td>
                  <td className="py-3 px-3 text-celo-onyx/70">{v.group}</td>
                  <td className="py-3 px-3 text-right font-mono text-celo-onyx">{v.votingPower}</td>
                  <td className="py-3 px-3 text-right font-mono text-celo-green font-semibold">{v.uptime}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        v.status === "Elected"
                          ? "bg-celo-green text-white"
                          : "bg-white text-celo-onyx border border-celo-onyx/30"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
