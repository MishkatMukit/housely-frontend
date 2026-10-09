import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  tone = "ink",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "ink" | "tolet" | "ledger" | "stamp";
}) {
  const toneClass = {
    ink: "text-ink",
    tolet: "text-tolet",
    ledger: "text-ledger",
    stamp: "text-stamp",
  }[tone];

  return (
    <div className="rule-top bg-surface/50 px-4 py-4">
      <p className="eyebrow">{label}</p>
      <p className={cn("figure mt-2.5 text-3xl", toneClass)}>{value}</p>
      {hint ? <p className="mt-1.5 text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}
