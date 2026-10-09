import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface PropertyFilterValues {
  search?: string;
  city?: string;
  district?: string;
}

export function PropertyFilters({ values }: { values: PropertyFilterValues }) {
  const hasFilters = Boolean(values.search || values.city || values.district);

  return (
    <form
      action="/properties"
      method="get"
      className="rule-top rule-bottom grid grid-cols-1 gap-3 py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
    >
      <label htmlFor="filter-search" className="grid gap-1.5">
        <span className="eyebrow text-[0.5625rem]">Search</span>
        <Input
          id="filter-search"
          name="search"
          defaultValue={values.search}
          placeholder="Title, address or locality"
          autoComplete="off"
          className="figure rounded-none border-ink/25 bg-transparent"
        />
      </label>
      <label htmlFor="filter-city" className="grid gap-1.5">
        <span className="eyebrow text-[0.5625rem]">City</span>
        <Input
          id="filter-city"
          name="city"
          defaultValue={values.city}
          placeholder="Dhaka"
          autoComplete="off"
          className="figure rounded-none border-ink/25 bg-transparent"
        />
      </label>
      <label htmlFor="filter-district" className="grid gap-1.5">
        <span className="eyebrow text-[0.5625rem]">District</span>
        <Input
          id="filter-district"
          name="district"
          defaultValue={values.district}
          placeholder="Dhaka"
          autoComplete="off"
          className="figure rounded-none border-ink/25 bg-transparent"
        />
      </label>
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          className="rounded-none bg-tolet text-primary-foreground hover:bg-tolet/90"
        >
          Filter
        </Button>
        {hasFilters && (
          <Button
            variant="ghost"
            className="figure rounded-none text-xs uppercase tracking-[0.14em] text-ink-soft"
            render={<Link href="/properties" />}
          >
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}
