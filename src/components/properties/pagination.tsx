import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageItem = number | "ellipsis-rail" | "ellipsis-leaf";

function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("ellipsis-rail");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < total - 1) items.push("ellipsis-leaf");
  items.push(total);

  return items;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  buildHref,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  buildHref: (page: number) => string;
}) {
  const items = getPageItems(page, totalPages);
  const first = (page - 1) * limit + 1;
  const last = Math.min(page * limit, total);

  return (
    <nav
      aria-label="Register pagination"
      className="rule-top mt-12 flex flex-col items-center gap-5 pt-6"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous page"
          disabled={page <= 1}
          className="rounded-none border-ink/30 text-ink hover:bg-ink hover:text-paper"
          render={page > 1 ? <Link href={buildHref(page - 1)} /> : undefined}
        >
          ←
        </Button>

        <ul className="flex flex-wrap items-center gap-1.5">
          {items.map((item) =>
            typeof item === "number" ? (
              <li key={item}>
                {item === page ? (
                  <span
                    aria-current="page"
                    className="figure flex h-8 min-w-8 items-center justify-center border border-ink bg-ink px-2 text-sm text-paper"
                  >
                    {String(item).padStart(2, "0")}
                  </span>
                ) : (
                  <Link
                    href={buildHref(item)}
                    className="figure flex h-8 min-w-8 items-center justify-center border border-ink/20 px-2 text-sm text-ink-soft transition-colors hover:border-ink/50 hover:text-ink"
                  >
                    {String(item).padStart(2, "0")}
                  </Link>
                )}
              </li>
            ) : (
              <li
                key={item}
                aria-hidden="true"
                className={cn(
                  "figure flex h-8 items-center justify-center px-1 text-sm",
                  item === "ellipsis-rail"
                    ? "tracking-[0.3em] text-ink-soft/60"
                    : "text-ink-soft/60",
                )}
              >
                ···
              </li>
            ),
          )}
        </ul>

        <Button
          variant="outline"
          size="icon"
          aria-label="Next page"
          disabled={page >= totalPages}
          className="rounded-none border-ink/30 text-ink hover:bg-ink hover:text-paper"
          render={
            page < totalPages ? <Link href={buildHref(page + 1)} /> : undefined
          }
        >
          →
        </Button>
      </div>

      <span className="figure text-xs uppercase tracking-[0.16em] text-ink-soft">
        Entries {first}–{last} of {total} · page {page} of {totalPages}
      </span>
    </nav>
  );
}
