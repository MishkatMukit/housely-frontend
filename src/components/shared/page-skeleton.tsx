import { Skeleton } from "@/components/ui/skeleton";

export type PageSkeletonVariant =
  | "dashboard"
  | "list"
  | "table"
  | "cards"
  | "form"
  | "detail";

const PILL_KEYS = ["one", "two", "three", "four", "five"];
const CARD_KEYS = ["one", "two", "three", "four", "five", "six"];
const FIELD_KEYS = ["one", "two", "three", "four", "five"];
const TILE_KEYS = ["one", "two", "three"];

function HeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <header className="rule-bottom flex flex-col gap-5 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2.5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-56 sm:h-10" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-2/3 max-w-md" />
      </div>
      {action ? <Skeleton className="h-10 w-36 shrink-0" /> : null}
    </header>
  );
}

function StatRowSkeleton({ count }: { count: number }) {
  return (
    <section className="grid grid-cols-2 gap-x-px gap-y-6 sm:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={String(index)}
          className="space-y-3 border-l border-ink/15 pl-4"
        >
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </section>
  );
}

function PillsSkeleton() {
  return (
    <nav className="flex flex-wrap gap-2">
      {PILL_KEYS.map((key) => (
        <Skeleton key={key} className="h-8 w-20" />
      ))}
    </nav>
  );
}

function RowsSkeleton({ count }: { count: number }) {
  return (
    <div className="rule-top divide-y divide-ink/10">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={String(index)}
          className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="w-full space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-64 max-w-full" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-9 w-24 shrink-0" />
        </div>
      ))}
    </div>
  );
}

function CardsSkeleton() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {CARD_KEYS.map((key) => (
        <div key={key} className="rule-top flex flex-col bg-surface/50">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 px-4 py-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </section>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6 rounded-xl border border-ink/15 bg-surface/40 p-6">
      {FIELD_KEYS.map((key) => (
        <div key={key} className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-full rounded-none" />
        </div>
      ))}
      <Skeleton className="h-10 w-40 rounded-none" />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <>
      <div className="rule-top grid gap-6 bg-surface/40 sm:grid-cols-[220px_1fr]">
        <Skeleton className="aspect-[4/3] w-full rounded-none sm:aspect-auto sm:h-full sm:min-h-32" />
        <div className="grid content-center gap-4 py-4 sm:grid-cols-3">
          {TILE_KEYS.map((key) => (
            <div key={key} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-12" />
            </div>
          ))}
          <div className="space-y-2 sm:col-span-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-none border border-ink/15" />
    </>
  );
}

export function PageSkeleton({
  variant = "list",
  action = true,
}: {
  variant?: PageSkeletonVariant;
  action?: boolean;
}) {
  return (
    <div className="space-y-8">
      {variant === "detail" ? (
        <div className="flex">
          <Skeleton className="h-3 w-40" />
        </div>
      ) : null}

      <HeaderSkeleton action={action} />

      {variant === "dashboard" ? (
        <>
          <StatRowSkeleton count={8} />
          <section className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64 w-full rounded-none border border-ink/15" />
            <Skeleton className="h-64 w-full rounded-none border border-ink/15" />
          </section>
          <section className="grid gap-4 sm:grid-cols-3">
            {TILE_KEYS.map((key) => (
              <Skeleton key={key} className="h-24 w-full rounded-none" />
            ))}
          </section>
        </>
      ) : null}

      {variant === "list" || variant === "table" ? <PillsSkeleton /> : null}
      {variant === "table" ? (
        <Skeleton className="h-10 w-full rounded-none" />
      ) : null}
      {variant === "list" || variant === "table" ? (
        <RowsSkeleton count={5} />
      ) : null}
      {variant === "cards" ? <CardsSkeleton /> : null}
      {variant === "form" ? <FormSkeleton /> : null}
      {variant === "detail" ? <DetailSkeleton /> : null}
    </div>
  );
}
