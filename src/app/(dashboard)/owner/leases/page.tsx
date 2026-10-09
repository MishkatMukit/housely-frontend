import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusStamp } from "@/components/dashboard/status-stamp";
import { TerminateLeaseDialog } from "@/components/owner/terminate-lease-dialog";
import { getOwnerLeases } from "@/lib/api/owner";
import { cn } from "@/lib/utils";
import type { LeaseStatus } from "@/types/api";

type SearchParams = Promise<{ page?: string; status?: string }>;

const FILTERS: { label: string; value?: LeaseStatus }[] = [
  { label: "All" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Terminated", value: "TERMINATED" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function taka(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `৳${amount.toLocaleString("en-BD")}` : "—";
}

export default async function OwnerLeasesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page: pageParam, status: statusParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const status = FILTERS.find((item) => item.value === statusParam)?.value;

  const result = await getOwnerLeases({ page, status });
  const leases = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;

  return (
    <div className="space-y-8">
      <PageHeader
        index="04"
        eyebrow="Owner desk"
        title="Leases"
        description="Every tenancy on your register. Terminate to end a lease and free the flat."
      />

      <nav className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = filter.value === status;
          const href = filter.value
            ? `/owner/leases?status=${filter.value}`
            : "/owner/leases";
          return (
            <Link
              key={filter.label}
              href={href}
              className={cn(
                "figure border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors",
                active
                  ? "bg-ink text-paper"
                  : "text-ink-soft hover:border-ink/40 hover:text-ink",
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>

      {leases.length === 0 ? (
        <EmptyState
          eyebrow="No leases"
          title="No tenancies yet"
          description="Approved applications become leases and appear here."
        />
      ) : (
        <div className="overflow-x-auto rule-top">
          <table className="w-full text-sm">
            <thead>
              <tr className="figure text-left text-xs uppercase tracking-[0.12em] text-ink-soft">
                <th className="px-4 py-3 font-normal">Tenant</th>
                <th className="px-4 py-3 font-normal">Flat</th>
                <th className="px-4 py-3 font-normal">Rent</th>
                <th className="px-4 py-3 font-normal">Term</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leases.map((lease) => {
                const tenantName =
                  lease.tenant?.user?.name ?? lease.tenant?.name ?? "Tenant";
                const propertyTitle = lease.flat?.property?.title ?? "Property";
                const flatNumber = lease.flat?.flatNumber ?? "—";
                const terminable =
                  lease.status === "ACTIVE" || lease.status === "PENDING";

                return (
                  <tr key={lease.id} className="border-t border-ink/10">
                    <td className="px-4 py-3 text-ink">{tenantName}</td>
                    <td className="px-4 py-3 text-ink-soft">
                      {propertyTitle} · {flatNumber}
                    </td>
                    <td className="px-4 py-3 text-ink">{taka(lease.amount)}</td>
                    <td className="px-4 py-3 text-ink-soft">
                      {formatDate(lease.startDate)} →{" "}
                      {formatDate(lease.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusStamp status={lease.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {terminable ? (
                        <div className="flex justify-end">
                          <TerminateLeaseDialog id={lease.id} />
                        </div>
                      ) : (
                        <span className="text-xs text-ink-soft">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="rule-top flex items-center justify-between pt-5">
          <Link
            href={`/owner/leases?page=${Math.max(1, page - 1)}${status ? `&status=${status}` : ""}`}
            aria-disabled={page <= 1}
            className={cn(
              "figure border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-[0.12em]",
              page <= 1
                ? "pointer-events-none opacity-40"
                : "text-ink-soft hover:text-ink",
            )}
          >
            Previous
          </Link>
          <span className="figure text-xs uppercase tracking-[0.16em] text-ink-soft">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/owner/leases?page=${page + 1}${status ? `&status=${status}` : ""}`}
            aria-disabled={page >= totalPages}
            className={cn(
              "figure border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-[0.12em]",
              page >= totalPages
                ? "pointer-events-none opacity-40"
                : "text-ink-soft hover:text-ink",
            )}
          >
            Next
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
