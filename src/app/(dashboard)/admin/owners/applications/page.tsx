import { FileText, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { OwnerReviewActions } from "@/components/admin/owner-review";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusStamp } from "@/components/dashboard/status-stamp";
import { getAdminOwnerApplications } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ page?: string; status?: string }>;

const FILTERS: {
  label: string;
  value?: "PENDING" | "APPROVED" | "REJECTED";
}[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "All" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminOwnerApplicationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const known = FILTERS.some((item) => item.value === params.status);
  const status = known
    ? (params.status as "PENDING" | "APPROVED" | "REJECTED" | undefined)
    : "PENDING";

  const result = await getAdminOwnerApplications({ page, status });
  const applications = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;
  const total = result?.total ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        index="04"
        eyebrow="Control room"
        title="Owner applications"
        description="Vet tenants applying to become owners. Check identity and documents before approving."
        action={
          <span className="figure border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-ink-soft">
            {total.toLocaleString()} in view
          </span>
        }
      />

      <nav className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = filter.value === status;
          const href = filter.value
            ? `/admin/owners/applications?status=${filter.value}`
            : "/admin/owners/applications?status=";
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
          eyebrow="Queue clear"
          title="No applications here"
          description="Owner applications waiting for review will appear on this desk."
        />
      ) : (
        <section className="space-y-4">
          {applications.map((application) => {
            const docs = application.verificationDocuments ?? [];
            return (
              <article
                key={application.id}
                className="rule-top grid gap-4 bg-surface/40 px-5 py-5 lg:grid-cols-[1fr_auto]"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="display text-lg text-ink">
                      {application.user.name}
                    </h2>
                    <StatusStamp status={application.status} />
                    {!application.user.emailVerified ? (
                      <span className="stamp stamp-blue">Email unverified</span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-ink-soft">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {application.user.email}
                    </span>
                    {application.contactNumber ? (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {application.contactNumber}
                      </span>
                    ) : null}
                    {application.user.address ? (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {application.user.address}
                      </span>
                    ) : null}
                  </div>
                  <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
                    <div className="flex gap-1.5">
                      <dt>NID:</dt>
                      <dd className="text-ink">
                        {application.user.nationalIdNumber ?? "—"}
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt>Submitted:</dt>
                      <dd className="text-ink">
                        {formatDate(application.createdAt)}
                      </dd>
                    </div>
                  </dl>
                  {docs.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {docs.map((doc) => (
                        <a
                          key={doc.publicId}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="figure inline-flex items-center gap-1.5 border border-ink/15 px-2.5 py-1 text-xs uppercase tracking-[0.1em] text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Document
                        </a>
                      ))}
                    </div>
                  ) : null}
                  {application.rejectionHistory &&
                  application.rejectionHistory.length > 0 ? (
                    <ul className="space-y-1 border-l-2 border-destructive/30 pl-3 text-sm text-destructive">
                      {application.rejectionHistory.map((entry) => (
                        <li key={entry.rejectedAt}>
                          {entry.reason}
                          <span className="text-ink-soft">
                            {" "}
                            · {formatDate(entry.rejectedAt)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {application.status === "PENDING" ? (
                  <div className="flex items-start lg:justify-end">
                    <OwnerReviewActions id={application.id} />
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
            href={`/admin/owners/applications?page=${Math.max(1, page - 1)}${status ? `&status=${status}` : ""}`}
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
            href={`/admin/owners/applications?page=${page + 1}${status ? `&status=${status}` : ""}`}
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
