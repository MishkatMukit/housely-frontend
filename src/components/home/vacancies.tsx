import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { formatTaka, type Listing } from "@/lib/api/properties";

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
            <Reveal as="li" key={listing.id} delay={(i % 3) * 90}>
              <Link
                href={`/properties/${listing.id}`}
                className="group block border border-ink/15 bg-surface transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(25,23,19,0.45)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-ink/15">
                  {listing.image ? (
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="facade h-full w-full" />
                  )}
                  <span className="figure absolute left-3 top-3 bg-ink px-2 py-1 text-[0.625rem] text-paper">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="figure absolute right-3 top-3 bg-paper/90 px-2 py-1 text-[0.625rem] text-ink">
                    {listing.reference}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="display text-2xl text-ink transition-colors group-hover:text-tolet">
                    {listing.title}
                  </h3>
                  <p className="figure mt-1.5 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-soft">
                    {listing.locality} · {listing.city}, {listing.district}
                  </p>

                  <div className="rule-top rule-bottom mt-4 flex items-end justify-between gap-3 py-3">
                    <div>
                      <span className="eyebrow text-[0.5625rem]">
                        {listing.unit ? `${listing.unit} · from` : "From"}
                      </span>
                      <div className="display mt-0.5 text-2xl text-tolet">
                        {listing.fromRent
                          ? `${formatTaka(listing.fromRent)}/mo`
                          : "Rent on request"}
                      </div>
                    </div>
                    <span
                      className={`stamp ${
                        listing.available > 0 ? "stamp-green" : "stamp-blue"
                      }`}
                    >
                      {listing.available > 0
                        ? `${listing.available} vacant`
                        : "Registering"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="figure text-[0.6875rem] text-ink-soft">
                      {listing.flats} flats · {listing.ownerName}
                    </span>
                    <span className="figure text-xs text-ledger transition-transform duration-300 group-hover:translate-x-1">
                      Open entry →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
