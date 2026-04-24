import type { ReactNode } from "react";

export function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-celo-onyx/10 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-celo-onyx/60">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function ActionItem({
  label,
  sub,
  badge,
  href,
}: {
  label: string;
  sub: string;
  badge?: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="font-serif font-semibold text-base sm:text-lg text-celo-onyx">
            {label}
          </div>
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-celo-yellow text-celo-onyx border border-celo-onyx/20 px-2 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>
        <div className="text-sm text-celo-onyx/60 mt-1">{sub}</div>
      </div>
      <span className="text-xl text-celo-green ml-3 shrink-0">→</span>
    </>
  );

  const className =
    "flex items-center justify-between p-4 sm:p-5 rounded-xl bg-celo-cream border border-celo-onyx/10 hover:border-celo-onyx/30 transition-colors mb-3 last:mb-0";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }
  return <div className={className}>{content}</div>;
}

export function Kpi({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 border ${
        accent
          ? "bg-celo-yellow border-celo-onyx"
          : "bg-white border-celo-onyx/10"
      }`}
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-celo-onyx/60">
        {label}
      </div>
      <div className="font-serif text-3xl sm:text-4xl text-celo-onyx mt-2 leading-none">
        {value}
      </div>
      <div className="text-xs text-celo-onyx/60 mt-2">{hint}</div>
    </div>
  );
}
