import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusStamp } from "@/components/dashboard/status-stamp";
import { ApplicationActions } from "@/components/owner/application-review";
import { getOwnerApplications } from "@/lib/api/owner";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/api";

type SearchParams = Promise<{ page?: string; status?: string }>;

const FILTERS: { label: string; value?: ApplicationStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function OwnerApplicationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page: pageParam, status: statusParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const status = FILTERS.find((item) => item.value === statusParam)?.value;

  const result = await getOwnerApplications({ page, status });
  const applications = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;

  return (
    <div className="space-y-8">
      <PageHeader
        index="03"
        eyebrow="Owner desk"
        title="Applications"
        description="Review tenants who applied to your flats. Approving one opens a lease."
      />

      <nav className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = filter.value === status;
          const href = filter.value
            ? `/owner/applications?status=${filter.value}`
            : "/owner/applications";
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

      {applications.length === 0 ? (
        <EmptyState
          eyebrow="Nothing to review"
          title="No applications here"
          description="When tenants apply to your flats, they land on this desk for review."
        />
      ) : (
        <section className="space-y-4">
          {applications.map((application) => {
            const tenantName =
              application.tenant?.user?.name ??
              application.tenant?.name ??
              "Applicant";
            const email = application.tenant?.user?.email ?? "";
            const propertyTitle =
              application.flat?.property?.title ?? "Your property";
            const flatNumber = application.flat?.flatNumber ?? "—";

            return (
              <article
                key={application.id}
                className="rule-top grid gap-4 bg-surface/40 px-5 py-5 lg:grid-cols-[1fr_auto]"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="display text-lg text-ink">{tenantName}</h2>
                    <StatusStamp status={application.status} />
                  </div>
                  <p className="text-sm text-ink-soft">
                    {email} · applied {formatDate(application.createdAt)}
                  </p>
                  <p className="text-sm text-ink">
                    <span className="text-ink-soft">For</span> {propertyTitle}{" "}
                    <span className="text-ink-soft">· Flat</span> {flatNumber}
                  </p>
                  <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
                    <div className="flex gap-1.5">
                      <dt>Income:</dt>
                      <dd className="text-ink">
                        {application.monthlyIncome
                          ? `৳${Number(application.monthlyIncome).toLocaleString("en-BD")}`
                          : "—"}
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt>Employment:</dt>
                      <dd className="text-ink">
                        {application.employment ?? "—"}
                      </dd>
                    </div>
                  </dl>
                  {application.message ? (
                    <p className="max-w-2xl border-l-2 border-ink/15 pl-3 text-sm italic leading-relaxed text-ink-soft">
                      {application.message}
                    </p>
                  ) : null}
                  {application.status === "REJECTED" &&
                  application.rejectionReason ? (
                    <p className="text-sm text-destructive">
                      Rejected: {application.rejectionReason}
                    </p>
                  ) : null}
                </div>

                {application.status === "PENDING" ? (
                  <div className="flex items-start lg:justify-end">
                    <ApplicationActions id={application.id} />
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>
      )}

      {totalPages > 1 ? (
        <nav className="rule-top flex items-center justify-between pt-5">
          <Link
            href={`/owner/applications?page=${Math.max(1, page - 1)}${status ? `&status=${status}` : ""}`}
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
            href={`/owner/applications?page=${page + 1}${status ? `&status=${status}` : ""}`}
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
