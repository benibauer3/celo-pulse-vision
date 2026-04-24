import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  fetchCommunityFundBalance,
  fetchValidatorCount,
  fetchLatestBlock,
  fetchCeloPriceUsd,
} from "@/lib/celo";
import { truncateAddress } from "@/lib/minipay";
import { SectionCard, ActionItem, Kpi } from "@/components/ui-celo";
import { proposals } from "@/data/projects";
import { useGovernance } from "@/hooks/useGovernance";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Celo Pulse — Treasury & Governance" },
      { name: "description", content: "Community Fund balance, approved proposals and ecosystem health for the Celo network." },
    ],
  }),
  component: Index,
});

function Index() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<string>("Loading...");
  const [balanceRaw, setBalanceRaw] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [validators, setValidators] = useState<number | null>(null);
  const [block, setBlock] = useState<bigint | null>(null);
  const governance = useGovernance();

  useEffect(() => {
    fetchCommunityFundBalance().then((r) => {
      setBalance(r.formatted);
      setBalanceRaw(r.raw);
    });
    fetchCeloPriceUsd().then(setPrice);
    fetchValidatorCount().then(setValidators);
    fetchLatestBlock().then(setBlock);
  }, []);

  const approved = proposals.filter((p) => p.status === "Executed" || p.status === "Adopted").length;
  const voting = proposals.filter((p) => p.status === "Voting").length;
  const totalCgps = 234;

  const usdValue =
    balanceRaw !== null && price !== null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(balanceRaw * price)
      : null;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-24 md:pb-10">
      {/* Hero */}
      <section className="mb-14 sm:mb-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-celo-onyx/50 mb-4">
          Community Fund Balance
        </p>
        <h1 className="font-serif text-6xl sm:text-8xl leading-none text-celo-onyx tracking-tight mb-4">
          {balance}{" "}
          <span className="inline-block align-middle text-base sm:text-2xl font-bold bg-celo-yellow text-celo-onyx border-2 border-celo-onyx px-3 py-1.5 rounded ml-2">
            CELO
          </span>
        </h1>
        <p className="font-serif text-2xl sm:text-3xl text-celo-onyx/80 mb-5">
          {usdValue ? (
            <>
              ≈ <span className="font-bold">{usdValue}</span>{" "}
              <span className="text-sm font-sans uppercase tracking-widest text-celo-onyx/50">
                USD {price ? `· 1 CELO = $${price.toFixed(3)}` : ""}
              </span>
            </>
          ) : (
            <span className="text-celo-onyx/40 text-base">Calculating USD value…</span>
          )}
        </p>
        <p className="text-base sm:text-lg text-celo-onyx/70 max-w-2xl leading-relaxed mb-6">
          {isConnected
            ? `Welcome. Your wallet ${truncateAddress(address)} is connected to the Celo network.`
            : "Community Fund treasury powered by epoch rewards from the Celo protocol."}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://forum.celo.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-celo-onyx text-celo-cream px-5 py-2.5 text-sm font-semibold hover:bg-celo-onyx/90 transition"
          >
            Discussions on Celo Forum ↗
          </a>
          <a
            href="https://mondo.celo.org/governance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-celo-yellow text-celo-onyx border-2 border-celo-onyx px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
          >
            View on Celo Mondo ↗
          </a>
          <a
            href="https://docs.celo.org/home/protocol/epoch-rewards/community-fund"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white text-celo-onyx border border-celo-onyx/30 px-5 py-2.5 text-sm font-semibold hover:bg-celo-cream transition"
          >
            About the Community Fund ↗
          </a>
        </div>
      </section>

      {/* KPI bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-14 sm:mb-20">
        <Kpi
          label="Total CGPs"
          value={`${totalCgps}`}
          hint="Proposals on record"
          accent
        />
        <Kpi
          label="Approved / Executed"
          value={`${approved}`}
          hint="Latest from Mondo"
        />
        <Kpi
          label="In voting"
          value={`${voting}`}
          hint="Awaiting quorum"
        />
        <Kpi
          label="Network Health"
          value="99.9%"
          hint={validators !== null ? `${validators} validators` : "Average uptime"}
        />
      </section>

      {/* Recent proposals */}
      <div className="grid grid-cols-1 gap-5 mb-10">
        <SectionCard
          title="Recent Proposals · Celo Mondo"
          action={
            <a
              href="https://mondo.celo.org/governance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-celo-onyx/70 hover:text-celo-onyx underline underline-offset-2"
            >
              View all ↗
            </a>
          }
        >
          {proposals.slice(0, 4).map((p) => (
            <ActionItem
              key={p.id}
              label={`${p.id}: ${p.title}`}
              sub={`${p.category}${p.yes ? ` • Yes ${p.yes}` : ""}${p.no ? ` • No ${p.no}` : ""}`}
              badge={p.status}
              href={p.url}
            />
          ))}
        </SectionCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SectionCard title="Community & Discussion">
            <ActionItem
              label="Official Celo Forum"
              sub="Debate proposals before they go on-chain"
              badge="Live"
              href="https://forum.celo.org/"
            />
            <ActionItem
              label="CGPs on GitHub"
              sub="Official repository of Celo Governance Proposals"
              href="https://github.com/celo-org/governance"
            />
          </SectionCard>

          <SectionCard title="Validators & Network">
            <ActionItem
              label="Network Health Status"
              sub="Uptime and performance monitoring"
              badge="99.9%"
              href="/validators"
            />
            <ActionItem
              label={block ? `Latest block #${block.toString()}` : "Latest block —"}
              sub="Celo Mainnet • chainId 42220"
              href="https://celoscan.io"
            />
          </SectionCard>
        </div>

        {/* On-chain governance data — CeloPulseGovernance contract */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SectionCard
            title={`Health Reports · On-chain${
              governance.reportsCount !== null ? ` (${governance.reportsCount})` : ""
            }`}
            action={
              <a
                href={`https://celoscan.io/address/${governance.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-celo-onyx/70 hover:text-celo-onyx underline underline-offset-2"
              >
                Contract ↗
              </a>
            }
          >
            {governance.loading && (
              <div className="text-sm text-celo-onyx/50 p-4">Loading reports from Celo Mainnet…</div>
            )}
            {!governance.loading && governance.error && (
              <div className="text-sm text-celo-onyx/60 p-4">{governance.error}</div>
            )}
            {!governance.loading && !governance.error && governance.reports.length === 0 && (
              <div className="text-sm text-celo-onyx/60 p-4">No health reports submitted yet.</div>
            )}
            {governance.reports.slice(0, 5).map((r, i) => (
              <ActionItem
                key={`${r.timestamp}-${i}`}
                label={r.componentName || "Component"}
                sub={`${r.statusMessage || "—"} • ${new Date(r.timestamp * 1000).toLocaleDateString()}`}
                badge={`${r.uptimeScore}/100`}
              />
            ))}
          </SectionCard>

          <SectionCard
            title={`Project Milestones · On-chain${
              governance.milestonesCount !== null ? ` (${governance.milestonesCount})` : ""
            }`}
            action={
              <a
                href={`https://celoscan.io/address/${governance.contractAddress}#readContract`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-celo-onyx/70 hover:text-celo-onyx underline underline-offset-2"
              >
                Read ↗
              </a>
            }
          >
            {governance.loading && (
              <div className="text-sm text-celo-onyx/50 p-4">Loading milestones…</div>
            )}
            {!governance.loading && !governance.error && governance.milestones.length === 0 && (
              <div className="text-sm text-celo-onyx/60 p-4">No milestones recorded yet.</div>
            )}
            {governance.milestones.slice(0, 5).map((m) => (
              <ActionItem
                key={m.id}
                label={m.projectName || `Milestone #${m.id}`}
                sub={`${m.milestoneDescription || "—"} • ${
                  m.dateReported ? new Date(m.dateReported * 1000).toLocaleDateString() : "—"
                }`}
                badge={m.isCompleted ? "Done" : "In progress"}
              />
            ))}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
