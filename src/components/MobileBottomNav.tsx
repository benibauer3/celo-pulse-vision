import { Link, useRouterState } from "@tanstack/react-router";

const ITEMS = [
  { to: "/", label: "Home", icon: "◎" },
  { to: "/proposals", label: "Proposals", icon: "✦" },
  { to: "/validators", label: "Validators", icon: "▲" },
] as const;

export function MobileBottomNav() {
  const { location } = useRouterState();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-celo-cream/95 backdrop-blur border-t-2 border-celo-onyx">
      <ul className="grid grid-cols-3">
        {ITEMS.map((item) => {
          const active =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex flex-col items-center justify-center py-2.5 text-[11px] font-semibold transition-colors ${
                  active ? "text-celo-onyx" : "text-celo-onyx/50"
                }`}
              >
                <span
                  className={`text-lg leading-none mb-0.5 ${
                    active ? "text-celo-onyx" : "text-celo-onyx/40"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
                {active && (
                  <span className="absolute -mt-2 h-1 w-8 bg-celo-yellow rounded-full translate-y-[34px]" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
