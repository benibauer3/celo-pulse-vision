import { useEffect, useState } from "react";
import { createPublicClient, http, type Address } from "viem";
import { celo } from "viem/chains";

/**
 * CeloPulseGovernance — verified contract on Celo Mainnet
 * https://celoscan.io/address/0x61984DBE528195BE6060d5b7c21cF26a5FbbDe0d#code
 */
export const CELO_PULSE_GOVERNANCE: Address =
  "0x61984DBE528195BE6060d5b7c21cF26a5FbbDe0d";

const RPCS = ["https://forno.celo.org", "https://rpc.ankr.com/celo"];

export const celoPulseGovernanceAbi = [
  {
    type: "function",
    name: "getReportsCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "healthReports",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "reporter", type: "address" },
      { name: "componentName", type: "string" },
      { name: "uptimeScore", type: "uint256" },
      { name: "statusMessage", type: "string" },
      { name: "timestamp", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "totalMilestones",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "projectMilestones",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "projectName", type: "string" },
      { name: "milestoneDescription", type: "string" },
      { name: "isCompleted", type: "bool" },
      { name: "dateReported", type: "uint256" },
    ],
  },
] as const;

export type HealthReport = {
  reporter: Address;
  componentName: string;
  uptimeScore: number;
  statusMessage: string;
  timestamp: number;
};

export type ProjectMilestone = {
  id: number;
  projectName: string;
  milestoneDescription: string;
  isCompleted: boolean;
  dateReported: number;
};

const MAX_ITEMS = 25;

type CeloClient = ReturnType<typeof createCeloClient>;
function createCeloClient(rpc: string) {
  return createPublicClient({ chain: celo, transport: http(rpc) });
}

async function readWithFallback<T>(
  fn: (client: CeloClient) => Promise<T>,
): Promise<T | null> {
  for (const rpc of RPCS) {
    try {
      return await fn(createCeloClient(rpc));
    } catch (e) {
      console.error("[useGovernance] RPC failed", rpc, e);
    }
  }
  return null;
}

export function useGovernance() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [reportsCount, setReportsCount] = useState<number | null>(null);
  const [milestonesCount, setMilestonesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);

      const result = await readWithFallback(async (client) => {
        const [reportsTotal, milestonesTotal] = await Promise.all([
          client.readContract({
            address: CELO_PULSE_GOVERNANCE,
            abi: celoPulseGovernanceAbi,
            functionName: "getReportsCount",
          }) as Promise<bigint>,
          client.readContract({
            address: CELO_PULSE_GOVERNANCE,
            abi: celoPulseGovernanceAbi,
            functionName: "totalMilestones",
          }) as Promise<bigint>,
        ]);

        const rTotal = Number(reportsTotal);
        const mTotal = Number(milestonesTotal);

        // Fetch the most recent items (capped at MAX_ITEMS)
        const reportStart = Math.max(0, rTotal - MAX_ITEMS);
        const reportIdxs = Array.from(
          { length: rTotal - reportStart },
          (_, i) => BigInt(reportStart + i),
        );
        const milestoneIdxs = Array.from(
          { length: Math.min(mTotal, MAX_ITEMS) },
          (_, i) => BigInt(i),
        );

        const [rawReports, rawMilestones] = await Promise.all([
          Promise.all(
            reportIdxs.map((i) =>
              client.readContract({
                address: CELO_PULSE_GOVERNANCE,
                abi: celoPulseGovernanceAbi,
                functionName: "healthReports",
                args: [i],
              }) as Promise<
                readonly [Address, string, bigint, string, bigint]
              >,
            ),
          ),
          Promise.all(
            milestoneIdxs.map((i) =>
              client.readContract({
                address: CELO_PULSE_GOVERNANCE,
                abi: celoPulseGovernanceAbi,
                functionName: "projectMilestones",
                args: [i],
              }) as Promise<readonly [string, string, boolean, bigint]>,
            ),
          ),
        ]);

        const parsedReports: HealthReport[] = rawReports
          .map(([reporter, componentName, uptimeScore, statusMessage, ts]) => ({
            reporter,
            componentName,
            uptimeScore: Number(uptimeScore),
            statusMessage,
            timestamp: Number(ts),
          }))
          .reverse();

        const parsedMilestones: ProjectMilestone[] = rawMilestones.map(
          ([projectName, milestoneDescription, isCompleted, dateReported], i) => ({
            id: Number(milestoneIdxs[i]),
            projectName,
            milestoneDescription,
            isCompleted,
            dateReported: Number(dateReported),
          }),
        );

        return {
          rTotal,
          mTotal,
          parsedReports,
          parsedMilestones,
        };
      });

      if (cancelled) return;

      if (!result) {
        setError("Could not reach a Celo RPC");
        setLoading(false);
        return;
      }

      setReportsCount(result.rTotal);
      setMilestonesCount(result.mTotal);
      setReports(result.parsedReports);
      setMilestones(result.parsedMilestones);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    reports,
    milestones,
    reportsCount,
    milestonesCount,
    loading,
    error,
    contractAddress: CELO_PULSE_GOVERNANCE,
  };
}
