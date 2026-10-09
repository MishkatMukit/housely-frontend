import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyCta } from "@/components/properties/apply-cta";
import { PropertyGallery } from "@/components/properties/property-gallery";
import {
  formatTaka,
  getPropertyDetail,
  getPropertyFlats,
} from "@/lib/api/properties";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = await getPropertyDetail(id);
  if (!detail) return { title: "Entry not found" };
  const { property } = detail;
  return {
    title: property.title,
    description:
      property.description ??
      `${property.title} in ${property.address}, ${property.city} — listed on the Housely register.`,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const detail = await getPropertyDetail(id);
  if (!detail) notFound();

  const { property, variants, available } = detail;
  const flats = await getPropertyFlats(id);

  const rents = variants
    .map((variant) => Number(variant.rentAmount))
    .filter((value) => Number.isFinite(value));
  const cheapestRent = rents.length > 0 ? Math.min(...rents) : null;

  const ownerName =
    property.owner?.user?.name ?? property.companyName ?? "Housely owner";
  const flatsCount = property._count?.flats ?? property.totalFlats ?? 0;
  const reference = `REF-${property.id.slice(0, 4).toUpperCase()}`;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-10 sm:px-8 lg:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/properties"
          className="figure text-xs uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink"
        >
          ← Back to the register
        </Link>
        <span className="figure text-xs uppercase tracking-[0.16em] text-ink-soft">
          Entry {reference}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] lg:gap-12">
        <div>
          <PropertyGallery
            images={property.images ?? []}
            title={property.title}
          />

          <div className="mt-8">
            <p className="eyebrow">
              {property.city}, {property.district}
              {property.postalCode ? ` · ${property.postalCode}` : ""}
            </p>
            <h1 className="display mt-3 text-4xl text-ink sm:text-5xl">
              {property.title}
            </h1>
            <p className="figure mt-3 text-sm text-ink-soft">
              {property.address}
            </p>
            {property.companyName && (
              <p className="figure mt-1 text-xs uppercase tracking-[0.14em] text-ink-soft">
                Registered to {property.companyName}
              </p>
            )}
          </div>

          {property.description && (
            <div className="rule-top mt-8 pt-6">
              <p className="eyebrow">The jamin</p>
              <p className="mt-4 max-w-prose leading-relaxed text-ink-soft">
                {property.description}
              </p>
            </div>
          )}

          <div className="mt-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow">Units on this property</p>
                <h2 className="display mt-3 text-3xl text-ink">
                  {variants.length > 0
                    ? "Configurations & rent"
                    : "No configurations yet"}
                </h2>
              </div>
            </div>

            {variants.length > 0 ? (
              <ul className="mt-6 divide-y divide-ink/15 border-y border-ink/15">
                {variants.map((variant, i) => (
                  <li
                    key={variant.id}
                    className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <span className="figure text-xs text-ink-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="display text-xl text-ink">
                        {variant.name}
                      </h3>
                      <p className="figure mt-1 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-soft">
                        {variant.bedrooms} bed · {variant.bathrooms} bath
                        {variant.sizeSqft ? ` · ${variant.sizeSqft} sqft` : ""}{" "}
                        · {variant.totalUnits}{" "}
                        {variant.totalUnits === 1 ? "unit" : "units"}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <div className="display text-2xl text-tolet">
                        {formatTaka(Number(variant.rentAmount))}
                        <span className="ml-1 align-middle text-[0.6rem] font-medium tracking-wide text-ink-soft">
                          /mo
                        </span>
                      </div>
                      <p className="figure mt-1 text-[0.6875rem] text-ink-soft">
                        Advance {formatTaka(Number(variant.advanceAmount))}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 border-y border-dashed border-ink/30 py-10 text-center text-ink-soft">
                The owner has not registered any configurations for this
                property yet.
              </p>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-ink/15 bg-surface">
            <div className="rule-bottom flex items-center justify-between p-5">
              <span className="eyebrow">Rent from</span>
              <span
                className={`stamp ${
                  available > 0 ? "stamp-green" : "stamp-blue"
                }`}
              >
                {available > 0 ? `${available} vacant` : "Registering"}
              </span>
            </div>

            <div className="p-5">
              <div className="display text-4xl text-tolet">
                {cheapestRent !== null ? formatTaka(cheapestRent) : "—"}
                <span className="ml-1 align-middle text-[0.65rem] font-medium tracking-wide text-ink-soft">
                  / month
                </span>
              </div>
              <p className="figure mt-2 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-soft">
                Advance negotiated separately
              </p>

              <dl className="figure mt-5 space-y-2 border-t border-dashed border-ink/30 pt-4 text-[0.8125rem]">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Flats on register</dt>
                  <dd className="font-semibold">{flatsCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Open for application</dt>
                  <dd className="font-semibold">{flats.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Owner</dt>
                  <dd className="font-semibold">{ownerName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Reference</dt>
                  <dd className="font-semibold">{reference}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <ApplyCta
                  propertyId={property.id}
                  propertyTitle={property.title}
                  flats={flats}
                  available={available}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 border border-ink/15 p-5">
            <p className="eyebrow">Where it stands</p>
            <p className="figure mt-3 text-sm leading-relaxed text-ink">
              {property.address}
              <br />
              {property.city}, {property.district}
              {property.postalCode ? ` ${property.postalCode}` : ""}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
