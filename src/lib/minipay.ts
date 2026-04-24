// MiniPay detection helper
export function isMiniPay(): boolean {
  if (typeof window === "undefined") return false;
  // @ts-expect-error injected provider
  return Boolean(window.ethereum?.isMiniPay);
}

export function truncateAddress(address?: string): string {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
