import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

const INCOME_ROWS = [
  { ref: "GR-101", flat: "3 Bed · Dhanmondi", amount: "15,000", type: "Rent" },
  { ref: "GR-102", flat: "3 Bed · Dhanmondi", amount: "15,000", type: "Rent" },
  {
    ref: "3A-201",
    flat: "Advance · Uttara",
    amount: "45,000",
    type: "Advance",
  },
];

export function ForOwners() {
  return (
    <section id="for-owners" className="paper-rules">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div>
          <p className="eyebrow">For property owners</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
            Your rent as a <span className="text-tolet">ledger</span>, not a
            notebook stack.
          </h2>
          <p className="mt-5 max-w-prose leading-relaxed text-ink-soft">
            List your building in minutes. We file the applications, the
            decisions, the leases and the bKash receipts — one ruling line at a
            time. You just check whose month is settled.
          </p>

          <ul className="mt-7 space-y-3">
            {[
              "Applications come to you; every decision is recorded, either way.",
              "Leases signed digitally — rent, advance and dates in writing.",
              "Rent collected by bKash; every payment receipted to its month.",
            ].map((item) => (
              <li key={item} className="rule-bottom flex gap-3 pb-3">
                <span className="figure text-xs text-tolet">✓</span>
                <span className="text-[0.9375rem] leading-relaxed text-ink">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="group rounded-none bg-tolet text-primary-foreground hover:bg-tolet/90"
              render={<Link href="/register" />}
            >
              Become a verified owner
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <p className="figure mt-4 text-[0.625rem] uppercase tracking-[0.14em] text-ink-soft">
            Verification: 2 documents · usually settled within 48 hours
          </p>
        </div>

        <Reveal delay={120} className="justify-self-center">
          <div className="w-full max-w-[380px] -rotate-1 border-2 border-ink bg-surface shadow-[0_24px_48px_-30px_rgba(25,23,19,0.55)] transition-transform duration-300 hover:rotate-0">
            <div className="rule-bottom flex items-center justify-between px-5 py-3">
              <span className="eyebrow">Income register · Sept</span>
              <span className="stamp stamp-green mt-0.5">Settled</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="rule-bottom text-left">
                  {["Ref", "Entry", "Tk", ""].map((head, i) => (
                    <th
                      key={head}
                      className={`figure px-5 py-2 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink-soft ${
                        i === 2 ? "text-right" : ""
                      }`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INCOME_ROWS.map((row) => (
                  <tr key={row.ref} className="rule-bottom">
                    <td className="figure px-5 py-3 text-[0.6875rem] text-ink">
                      {row.ref}
                    </td>
                    <td className="figure px-5 py-3 text-[0.6875rem] text-ink-soft">
                      {row.flat}
                    </td>
                    <td className="figure px-5 py-3 text-right text-[0.8125rem] font-semibold text-ink">
                      {row.amount}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="figure text-[0.5625rem] uppercase tracking-[0.12em] text-stamp">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-baseline justify-between px-5 py-4">
              <span className="figure text-[0.625rem] uppercase tracking-[0.14em] text-ink-soft">
                Receipted this month
              </span>
              <span className="display text-2xl text-ink">75,000</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
