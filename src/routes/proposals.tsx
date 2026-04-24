import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { GOVERNANCE_CONTRACT } from "@/lib/celo";
import { proposals } from "@/data/projects";
import { isMiniPay } from "@/lib/minipay";

export const Route = createFileRoute("/proposals")({
  head: () => ({
    meta: [
      { title: "Propostas CGP — Celo Pulse" },
      { name: "description", content: "Vote em propostas de governança Celo (CGPs) diretamente da sua carteira ou MiniPay." },
      { property: "og:title", content: "Propostas CGP — Celo Pulse" },
      { property: "og:description", content: "Acompanhe e vote em propostas ativas da rede Celo." },
    ],
  }),
  component: ProposalsPage,
});

// Minimal vote ABI — Celo governance vote(proposalId, index, value)
const voteAbi = [
  {
    name: "vote",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "index", type: "uint256" },
      { name: "value", type: "uint8" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

type VoteValue = "Yes" | "No" | "Abstain";

function ProposalsPage() {
  const { isConnected } = useAccount();
  const inMiniPay = typeof window !== "undefined" && isMiniPay();
  const { writeContractAsync, isPending } = useWriteContract();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const handleVote = async (id: string, value: VoteValue) => {
    if (!isConnected) {
      setFeedback((f) => ({ ...f, [id]: "Conecte sua carteira para votar." }));
      return;
    }
    setPendingId(id);
    try {
      const numericId = BigInt(id.replace(/\D/g, "") || "0");
      const valueMap = { Abstain: 1, No: 2, Yes: 3 } as const;
      await writeContractAsync({
        address: GOVERNANCE_CONTRACT,
        abi: voteAbi,
        functionName: "vote",
        args: [numericId, 0n, valueMap[value]],
      });
      setFeedback((f) => ({ ...f, [id]: `Voto "${value}" enviado.` }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar voto.";
      setFeedback((f) => ({ ...f, [id]: msg.slice(0, 120) }));
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-24 md:pb-10">
      <header className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-celo-onyx/50 mb-3">
          Celo Governance Proposals
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl text-celo-onyx leading-none tracking-tight mb-4">
          Propostas em votação
        </h1>
        <p className="text-base sm:text-lg text-celo-onyx/70 max-w-2xl">
          Vote diretamente nas CGPs ativas. {inMiniPay ? "Conectado via MiniPay." : "Conecte sua carteira para participar."}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {proposals.map((p) => {
          const voting = pendingId === p.id && isPending;
          const msg = feedback[p.id];
          return (
            <article
              key={p.id}
              className="bg-white rounded-2xl border border-celo-onyx/10 p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-celo-onyx text-celo-cream px-2 py-1 rounded">
                    {p.id}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-celo-yellow text-celo-onyx border border-celo-onyx/30 px-2 py-1 rounded">
                    {p.status}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-celo-onyx/60">
                    {p.category}
                  </span>
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-celo-onyx/70 hover:text-celo-onyx underline underline-offset-2"
                >
                  Mondo ↗
                </a>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-celo-onyx leading-tight mb-2">
                {p.title}
              </h2>
              <p className="text-sm text-celo-onyx/70 mb-5">
                Solicitação: <span className="font-semibold text-celo-onyx">{p.request}</span>
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={voting}
                  onClick={() => handleVote(p.id, "Yes")}
                  className="rounded-full py-2.5 text-sm font-semibold bg-celo-green text-white hover:opacity-90 disabled:opacity-50 transition"
                >
                  {voting ? "..." : "Sim"}
                </button>
                <button
                  disabled={voting}
                  onClick={() => handleVote(p.id, "No")}
                  className="rounded-full py-2.5 text-sm font-semibold bg-celo-onyx text-celo-cream hover:opacity-90 disabled:opacity-50 transition"
                >
                  Não
                </button>
                <button
                  disabled={voting}
                  onClick={() => handleVote(p.id, "Abstain")}
                  className="rounded-full py-2.5 text-sm font-semibold bg-white text-celo-onyx border border-celo-onyx/30 hover:bg-celo-cream disabled:opacity-50 transition"
                >
                  Abster
                </button>
              </div>

              {msg && (
                <p className="text-xs text-celo-onyx/70 mt-3 break-words">{msg}</p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
