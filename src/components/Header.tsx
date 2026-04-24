import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { isMiniPay, truncateAddress } from "@/lib/minipay";
import celoLogo from "@/assets/celo-logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/proposals", label: "Proposals" },
  { to: "/governance", label: "Governance" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/validators", label: "Validators" },
  { to: "/report", label: "Submit" },
] as const;

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { location } = useRouterState();
  const inMiniPay = typeof window !== "undefined" && isMiniPay();

  // Auto-connect inside MiniPay
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (inMiniPay && !isConnected) {
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, [inMiniPay, isConnected, connect]);

  const label = isConnected
    ? truncateAddress(address)
    : inMiniPay
      ? "Connecting..."
      : "Connect Wallet";

  return (
    <header className="border-b border-celo-onyx/10 bg-celo-cream/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-4 shrink-0" aria-label="Celo Pulse home">
          {/* Celo wordmark — Onyx on Snow per Celo brand guidelines. Do not distort. */}
          <img
            src={celoLogo}
            alt="Celo"
            className="h-7 sm:h-8 w-auto select-none"
            width={120}
            height={32}
            draggable={false}
          />
          <span className="hidden sm:inline-block h-5 w-px bg-celo-onyx/20" aria-hidden />
          <span className="hidden sm:inline-block font-serif text-celo-onyx font-semibold text-base tracking-tight">
            Pulse
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? "bg-celo-onyx text-celo-cream"
                    : "text-celo-onyx/70 hover:bg-celo-onyx/5 hover:text-celo-onyx"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {inMiniPay && isConnected ? (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-celo-green text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold">
            <span className="text-[10px]">●</span> Verified · {truncateAddress(address)}
          </span>
        ) : inMiniPay ? null : (
          <button
            onClick={() => {
              if (isConnected) disconnect();
              else connect({ connector: injected({ target: "metaMask" }) });
            }}
            className={`shrink-0 rounded-full px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
              isConnected
                ? "bg-celo-green text-white"
                : "bg-celo-onyx text-celo-cream hover:bg-celo-onyx/90"
            }`}
          >
            {label}
          </button>
        )}
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex overflow-x-auto gap-1 px-5 pb-3 scrollbar-none">
        {NAV.map((item) => {
          const active =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                active
                  ? "bg-celo-onyx text-celo-cream"
                  : "bg-white text-celo-onyx/70 border border-celo-onyx/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
