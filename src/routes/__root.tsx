import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-celo-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-serif text-celo-onyx">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-celo-onyx">Page not found</h2>
        <p className="mt-2 text-sm text-celo-onyx/60">
          The address you tried doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-celo-onyx px-5 py-2.5 text-sm font-medium text-celo-cream hover:bg-celo-onyx/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Celo Pulse — Governance Dashboard" },
      { name: "description", content: "Absolute transparency across treasury, governance, and the broader Celo ecosystem." },
      { name: "author", content: "Beni Bauer" },
      { property: "og:title", content: "Celo Pulse — Governance Dashboard" },
      { property: "og:description", content: "Absolute transparency across treasury, governance, and the broader Celo ecosystem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Celo Pulse — Governance Dashboard" },
      { name: "twitter:description", content: "Absolute transparency across treasury, governance, and the broader Celo ecosystem." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d7a39411-d099-44c8-8bd3-11ca1a2078ed/id-preview-0994bb04--4724e888-ed76-4a50-953a-7917cb575439.lovable.app-1777044926757.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d7a39411-d099-44c8-8bd3-11ca1a2078ed/id-preview-0994bb04--4724e888-ed76-4a50-953a-7917cb575439.lovable.app-1777044926757.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <MobileBottomNav />
          <div className="h-16 md:hidden" aria-hidden />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
