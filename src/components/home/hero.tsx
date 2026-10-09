import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ToLetPlacard } from "@/components/home/to-let-placard";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/lib/api/properties";

const HERO_NOTE = "K12142 — BALANCE CARRIED FROM FOLIO 08";

export function Hero({ featured }: { featured: Listing }) {
  return (
    <section className="relative border-b border-ink/15">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[4.5rem_minmax(0,1fr)_auto] lg:gap-8 lg:pb-24 lg:pt-16">
        <div className="hidden lg:flex lg:flex-col">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-ink/40" />
            <span className="figure text-[0.6875rem] text-ink-soft">F.01</span>
          </div>
          <span className="rule-left mt-6 flex-1" aria-hidden="true" />
          <span className="figure mt-6 origin-left -rotate-90 whitespace-nowrap text-[0.6875rem] tracking-[0.28em] text-ink-soft">
            {HERO_NOTE}
          </span>
        </div>

        <div className="flex flex-col justify-center lg:max-w-2xl">
          <p className="eyebrow">The rent register — Dhaka</p>

          <h1 className="display mt-5 text-5xl text-ink sm:text-6xl lg:text-[5.25rem]">
            A home,
            <br />
            entered on the
            <br />
            <span className="text-tolet">register.</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-soft">
            Housely is the ledger of rented life in Bangladesh. Browse vacant
            flats, hand your details to a verified owner, sign the lease, and
            pay every month by bKash — receipted and filed, like a proper khata.
          </p>

          <form
            action="/properties"
            method="get"
            className="rule-top rule-bottom mt-8 flex max-w-[34rem] items-center gap-3 py-3"
          >
            <span className="figure text-xs text-ink-soft" aria-hidden="true">
              ›
            </span>
            <input
              name="search"
              placeholder="Area, building or locality — try “Dhanmondi”"
              className="figure w-full bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-ink-soft/70"
              autoComplete="off"
            />
            <Button
              type="submit"
              size="sm"
              className="shrink-0 rounded-none bg-tolet text-primary-foreground hover:bg-tolet/90"
            >
              Search
            </Button>
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="group rounded-none bg-ink text-paper hover:bg-ink/90"
              render={<Link href="/properties" />}
            >
              Browse vacancies
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-none border-ink/40 text-ink hover:bg-ink hover:text-paper"
              render={<Link href="/register" />}
            >
              List a property
            </Button>
          </div>

          <ul className="figure mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-soft">
            <li>✔ Verified owners</li>
            <li>✔ Lease in writing</li>
            <li>✔ Rent by bKash</li>
          </ul>
        </div>

        <Reveal className="flex items-start justify-center lg:pr-2" delay={150}>
          <ToLetPlacard
            title={featured.title}
            locality={featured.locality}
            rent={featured.fromRent}
            unit={featured.unit ?? undefined}
            bedrooms={featured.bedrooms ?? undefined}
            bathrooms={featured.bathrooms ?? undefined}
            reference={featured.reference}
            available={featured.available}
          />
        </Reveal>
      </div>
    </section>
  );
}
