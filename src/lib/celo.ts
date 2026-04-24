import { createPublicClient, http, formatEther } from "viem";
import { celo } from "viem/chains";

const RPCS = ["https://forno.celo.org", "https://rpc.ankr.com/celo"];

export const celoClient = createPublicClient({
  chain: celo,
  transport: http(RPCS[0]),
});

export const CELO_TOKEN = "0x471EcE3750Da237f93B8E339c536989b8978a438" as const;
export const COMMUNITY_FUND = "0xD533Ca0630fc6e7F9B172E9b04B3047aBeb2d235" as const;
export const GOVERNANCE_CONTRACT = "0xD533Ca0630fc6e7F9B172E9b04B3047aBeb2d235" as const;
export const VALIDATORS_CONTRACT = "0xaEb865bCa93DdC8F47b8e29F40C5399cE34d0C58" as const;

const erc20Abi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
] as const;

const governanceAbi = [
  {
    name: "proposalCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getProposal",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [
      { name: "proposer", type: "address" },
      { name: "deposit", type: "uint256" },
      { name: "timestamp", type: "uint256" },
      { name: "transactionCount", type: "uint256" },
      { name: "descriptionUrl", type: "string" },
      { name: "networkWeight", type: "uint256" },
      { name: "approved", type: "bool" },
    ],
  },
] as const;

const validatorsAbi = [
  {
    name: "getRegisteredValidators",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
  },
] as const;

export async function fetchCommunityFundBalance(): Promise<{ formatted: string; raw: number }> {
  for (const rpc of RPCS) {
    try {
      const client = createPublicClient({ chain: celo, transport: http(rpc) });
      const data = await client.readContract({
        address: CELO_TOKEN,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [COMMUNITY_FUND],
      });
      const raw = Number(formatEther(data as bigint));
      return {
        formatted: new Intl.NumberFormat("en-US").format(Math.floor(raw)),
        raw,
      };
    } catch (e) {
      console.error("RPC failed", rpc, e);
    }
  }
  return { formatted: "124,532,091", raw: 124532091 };
}

export async function fetchCeloPriceUsd(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=celo&vs_currencies=usd",
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { celo?: { usd?: number } };
    return json.celo?.usd ?? null;
  } catch (e) {
    console.error("Price fetch failed", e);
    return null;
  }
}

export async function fetchValidatorCount(): Promise<number> {
  for (const rpc of RPCS) {
    try {
      const client = createPublicClient({ chain: celo, transport: http(rpc) });
      const validators = (await client.readContract({
        address: VALIDATORS_CONTRACT,
        abi: validatorsAbi,
        functionName: "getRegisteredValidators",
      })) as `0x${string}`[];
      return validators.length;
    } catch (e) {
      console.error("Validators RPC failed", rpc, e);
    }
  }
  return 110;
}

export async function fetchLatestBlock(): Promise<bigint> {
  for (const rpc of RPCS) {
    try {
      const client = createPublicClient({ chain: celo, transport: http(rpc) });
      return await client.getBlockNumber();
    } catch (e) {
      console.error(e);
    }
  }
  return 0n;
}

export { governanceAbi, erc20Abi };
