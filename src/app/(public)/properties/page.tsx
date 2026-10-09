import Link from "next/link";
import { Pagination } from "@/components/properties/pagination";
import { PropertyCard } from "@/components/properties/property-card";
import {
  PropertyFilters,
  type PropertyFilterValues,
} from "@/components/properties/property-filters";
import { Button } from "@/components/ui/button";
import { getPropertyPage } from "@/lib/api/properties";

export const metadata = {
  title: "Vacancies",
  description:
    "Browse vacant flats and properties on the Housely register across Bangladesh.",
};

type SearchParams = Promise<{
  page?: string;
  search?: string;
  city?: string;
  district?: string;
}>;

function pageHref(filters: PropertyFilterValues, page: number): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.city) params.set("city", filters.city);
  if (filters.district) params.set("district", filters.district);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/properties?${qs}` : "/properties";
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters: PropertyFilterValues = {
    search: params.search?.trim() || undefined,
    city: params.city?.trim() || undefined,
    district: params.district?.trim() || undefined,
  };
  const page = Math.max(1, Number(params.page) || 1);

  const result = await getPropertyPage({ ...filters, page, limit: 9 });

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="eyebrow">The register · Open entries</p>
        <h1 className="display mt-4 text-4xl text-ink sm:text-5xl">
          Flats with <span className="text-tolet">vacancy</span>
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Every property on the register, with its rent, its flats and how many
          doors are still open. Filter the book, then open an entry to apply.
        </p>
      </div>

      <div className="mt-8">
        <PropertyFilters values={filters} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="figure text-xs uppercase tracking-[0.16em] text-ink-soft">
          {result.total} {result.total === 1 ? "entry" : "entries"} on file
        </span>
      </div>

      {result.listings.length === 0 ? (
        <div className="rule-top rule-bottom mt-6 flex flex-col items-center gap-4 py-20 text-center">
          <span className="stamp stamp-blue">No entries</span>
          <div className="max-w-md">
            <h2 className="display text-2xl text-ink">
              Nothing on this page of the book
            </h2>
            <p className="mt-2 text-ink-soft">
              Try a different city, district or search term — or clear the
              filters to see the whole register.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-none border-ink/40 text-ink hover:bg-ink hover:text-paper"
            render={<Link href="/properties" />}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.listings.map((listing, i) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
              index={(result.page - 1) * result.limit + i}
            />
          ))}
        </ul>
      )}

      {result.totalPages > 1 && (
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          limit={result.limit}
          buildHref={(target) => pageHref(filters, target)}
        />
      )}
    </div>
  );
}
