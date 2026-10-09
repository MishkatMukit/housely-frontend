import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusStamp } from "@/components/dashboard/status-stamp";
import { Pagination } from "@/components/properties/pagination";
import { formatTaka } from "@/lib/api/properties";
import { getMyLeases } from "@/lib/api/tenant";
import { cn } from "@/lib/utils";
import type { Lease } from "@/types/api";

export const metadata = {
  title: "Leases",
};

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "TERMINATED", label: "Terminated" },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function LeaseRow({ lease }: { lease: Lease }) {
  const flat = lease.flat;
  const property = flat?.property;
  const variant = flat?.variant;
  const paid = (lease.payments ?? []).filter((p) => p.status === "COMPLETED");
  const due = (lease.payments ?? []).filter((p) => p.status === "PENDING");

  return (
    <li className="rule-top bg-surface/50 p-5">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2.5">
            <StatusStamp status={lease.status} />
            <h3 className="display text-xl text-ink">
              {property?.title ?? "Property"}
            </h3>
            <p className="text-sm text-ink-soft">
              {[
                flat?.flatNumber ? `Flat ${flat.flatNumber}` : null,
                variant?.name,
                [property?.city, property?.district].filter(Boolean).join(", "),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="figure text-right text-sm text-ink">
            {formatTaka(Number(lease.amount))}
            <span className="text-ink-soft">/mo</span>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-t border-ink/10 pt-4 sm:grid-cols-3">
          <div>
            <dt className="eyebrow">Start</dt>
            <dd className="figure mt-1 text-sm text-ink">
              {formatDate(lease.startDate)}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">End</dt>
            <dd className="figure mt-1 text-sm text-ink">
              {formatDate(lease.endDate)}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Payments</dt>
            <dd className="figure mt-1 text-sm text-ink">
              {paid.length} paid
              {due.length ? (
                <span className="text-tolet"> · {due.length} due</span>
              ) : null}
            </dd>
          </div>
        </dl>

        {lease.rejectionReason ? (
          <p className="text-sm text-tolet">Reason: {lease.rejectionReason}</p>
        ) : null}

        {lease.payments?.length ? (
          <ul className="divide-y divide-ink/10 border-t border-ink/10">
            {lease.payments.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between py-2.5"
              >
                <div className="flex items-center gap-3">
                  <StatusStamp status={payment.type} />
                  <span className="figure text-xs text-ink-soft">
                    {payment.periodStart
                      ? formatDate(payment.periodStart)
                      : "Advance"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="figure text-sm text-ink">
                    {formatTaka(Number(payment.amount))}
                  </span>
                  <StatusStamp status={payment.status} />
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

type SearchParams = Promise<{ page?: string; status?: string }>;

export default async function LeasesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const statusParam = params.status?.toUpperCase();
  const status = STATUS_FILTERS.some((f) => f.value === statusParam)
    ? (statusParam as Lease["status"])
    : undefined;

  const result = await getMyLeases({ page, limit: 10, status });

  const buildHref = (target: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/tenant/leases?${qs}` : "/tenant/leases";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        index="03"
        eyebrow="Tenant register"
        title="Leases"
        description="Signed tenancies with their terms and payment schedule. Clear dues from the payments page."
      />

      <nav aria-label="Filter leases" className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const active = (status ?? "") === filter.value;
          const params = new URLSearchParams();
          if (filter.value) params.set("status", filter.value);
          const qs = params.toString();
          return (
            <a
              key={filter.label}
              href={qs ? `/tenant/leases?${qs}` : "/tenant/leases"}
              className={cn(
                "figure border px-3 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors",
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/20 text-ink-soft hover:border-ink/50 hover:text-ink",
              )}
            >
              {filter.label}
            </a>
          );
        })}
      </nav>

      {!result || result.data.length === 0 ? (
        <EmptyState
          eyebrow="No leases"
          title="No tenancy on the books"
          description="Once an owner approves your application, the lease and its payment schedule show up here."
        />
      ) : (
        <>
          <ul className="space-y-0">
            {result.data.map((lease) => (
              <LeaseRow key={lease.id} lease={lease} />
            ))}
          </ul>
          {result.totalPages > 1 ? (
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              limit={result.limit}
              buildHref={buildHref}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
