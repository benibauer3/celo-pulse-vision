import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { isMiniPay, truncateAddress } from "@/lib/minipay";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/governance", label: "Governança" },
  { to: "/ecosystem", label: "Ecossistema" },
  { to: "/validators", label: "Validadores" },
  { to: "/report", label: "Submeter" },
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
      ? "Conectando..."
      : "Conectar Carteira";

  return (
    <header className="border-b border-celo-onyx/10 bg-celo-cream/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="bg-celo-yellow border-2 border-celo-onyx rounded px-3 py-2 leading-none">
            <span className="font-serif text-celo-onyx font-bold text-lg sm:text-xl tracking-tight">Celo Pulse</span>
          </div>
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

        <button
          onClick={() => {
            if (isConnected && !inMiniPay) disconnect();
            else if (!isConnected) connect({ connector: injected({ target: "metaMask" }) });
          }}
          className={`shrink-0 rounded-full px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
            isConnected
              ? "bg-celo-green text-white"
              : "bg-celo-onyx text-celo-cream hover:bg-celo-onyx/90"
          }`}
        >
          {label}
        </button>
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
