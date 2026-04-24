import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAccount } from "wagmi";
import { isMiniPay } from "@/lib/minipay";
import { SectionCard } from "@/components/ui-celo";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Submeter Milestone — Proof of Ship" },
      { name: "description", content: "Envie atualizações de milestone do seu projeto Proof of Ship na rede Celo." },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { address, isConnected } = useAccount();
  const [contributor, setContributor] = useState("");
  const [project, setProject] = useState("");
  const [milestone, setMilestone] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inMiniPay = typeof window !== "undefined" && isMiniPay();

  useEffect(() => {
    if (isConnected && address && !contributor) {
      setContributor(address);
    }
  }, [isConnected, address, contributor]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16">
      <header className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-celo-onyx/50 mb-3">
          Proof of Ship · Submissão
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl text-celo-onyx leading-none tracking-tight mb-4">
          Submeter milestone
        </h1>
        <p className="text-base sm:text-lg text-celo-onyx/70">
          Reporte o progresso do seu projeto. {inMiniPay && "Detectamos MiniPay — seu endereço foi preenchido automaticamente."}
        </p>
      </header>

      {submitted ? (
        <SectionCard title="Recebido">
          <div className="text-center py-8">
            <div className="font-serif text-3xl text-celo-onyx mb-3">Obrigado! ✓</div>
            <p className="text-celo-onyx/70 mb-6">
              Sua submissão foi registrada. A equipe de revisão entrará em contato em até 7 dias.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setProject("");
                setMilestone("");
                setProofUrl("");
              }}
              className="bg-celo-onyx text-celo-cream rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-celo-onyx/90"
            >
              Enviar outra
            </button>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="Detalhes do milestone">
          <form onSubmit={onSubmit} className="space-y-5">
            <Field label="Contributor Address" hint={inMiniPay ? "Auto-preenchido via MiniPay" : "Endereço da carteira do builder"}>
              <input
                type="text"
                value={contributor}
                onChange={(e) => setContributor(e.target.value)}
                placeholder="0x..."
                required
                readOnly={inMiniPay && Boolean(address)}
                className="w-full bg-celo-cream border border-celo-onyx/15 rounded-xl px-4 py-3 font-mono text-sm text-celo-onyx focus:outline-none focus:border-celo-onyx"
              />
            </Field>

            <Field label="Projeto" hint="Nome do projeto / time">
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Ex.: Halofi"
                required
                className="w-full bg-celo-cream border border-celo-onyx/15 rounded-xl px-4 py-3 text-sm text-celo-onyx focus:outline-none focus:border-celo-onyx"
              />
            </Field>

            <Field label="Milestone" hint="O que foi entregue neste ciclo?">
              <textarea
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                placeholder="Ex.: Lançamos o beta fechado para 200 usuários e processamos $50k em volume."
                required
                rows={5}
                className="w-full bg-celo-cream border border-celo-onyx/15 rounded-xl px-4 py-3 text-sm text-celo-onyx focus:outline-none focus:border-celo-onyx resize-none"
              />
            </Field>

            <Field label="Proof URL" hint="Link público (GitHub, deploy, vídeo, etc.)">
              <input
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://"
                required
                className="w-full bg-celo-cream border border-celo-onyx/15 rounded-xl px-4 py-3 text-sm text-celo-onyx focus:outline-none focus:border-celo-onyx"
              />
            </Field>

            <button
              type="submit"
              className="w-full sm:w-auto bg-celo-yellow text-celo-onyx border-2 border-celo-onyx rounded-full px-8 py-3 text-sm font-bold hover:bg-celo-yellow/90 transition-colors"
            >
              Submeter milestone
            </button>
          </form>
        </SectionCard>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-celo-onyx">{label}</span>
        {hint && <span className="text-[11px] text-celo-onyx/50">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
