import Link from "next/link";
import { PropertyCard } from "@/components/properties/property-card";
import type { Listing } from "@/lib/api/properties";

export function Vacancies({ listings }: { listings: Listing[] }) {
  return (
    <section id="vacancies" className="rule-bottom">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow">Vacancies on the register</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
              Flats with <span className="text-tolet">vacancy</span>
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Each entry carries its reference, its rent and how many flats are
              still open. Open one to read the full jamin — and apply.
            </p>
          </div>
          <Link
            href="/properties"
            className="figure text-xs uppercase tracking-[0.18em] text-ledger underline decoration-ledger/40 underline-offset-4 hover:decoration-ledger"
          >
            See the full register →
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, i) => (
            <PropertyCard key={listing.id} listing={listing} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
