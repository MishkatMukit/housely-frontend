import { FileText, Mail, Phone, Star } from "lucide-react";
import Link from "next/link";
import { OwnerReviewActions } from "@/components/admin/owner-review";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusStamp } from "@/components/dashboard/status-stamp";
import { getAdminOwners } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{
  page?: string;
  status?: string;
  search?: string;
}>;

const FILTERS: {
  label: string;
  value?: "PENDING" | "APPROVED" | "REJECTED";
}[] = [
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

export default async function AdminOwnersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const status = FILTERS.find((item) => item.value === params.status)?.value;
  const search = params.search?.trim() || undefined;

  const result = await getAdminOwners({ page, status, search });
  const owners = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;
  const total = result?.total ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        index="03"
        eyebrow="Control room"
        title="Owners"
        description="The landlord directory. Audit verification records and revisit past decisions."
        action={
          <span className="figure border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-ink-soft">
            {total.toLocaleString()} owners
          </span>
        }
      />

      <nav className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = filter.value === status;
          const href = filter.value
            ? `/admin/owners?status=${filter.value}`
            : "/admin/owners";
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

      {owners.length === 0 ? (
        <EmptyState
          eyebrow="No matches"
          title="No owners found"
          description="Adjust the filter above to find owner records."
        />
      ) : (
        <section className="rule-top divide-y divide-ink/10">
          {owners.map((owner) => {
            const docs = owner.verificationDocuments ?? [];
            return (
              <article
                key={owner.id}
                className="grid gap-4 py-5 lg:grid-cols-[1fr_auto] lg:items-start"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="display text-base text-ink">
                      {owner.user.name}
                    </h2>
                    <StatusStamp status={owner.status} />
                    {owner.totalReviews && owner.totalReviews > 0 ? (
                      <span className="figure flex items-center gap-1 text-[0.6875rem] uppercase tracking-[0.1em] text-ink-soft">
                        <Star className="h-3 w-3" />
                        {owner.averageRating?.toFixed(1) ?? "—"} ·{" "}
                        {owner.totalReviews} reviews
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-ink-soft">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {owner.user.email}
                    </span>
                    {owner.contactNumber ? (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {owner.contactNumber}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-ink-soft">
                    Applied {formatDate(owner.createdAt)}
                    {owner.reviewedAt
                      ? ` · reviewed ${formatDate(owner.reviewedAt)}`
                      : ""}
                  </p>
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
                  {owner.rejectionReason ? (
                    <p className="text-sm text-destructive">
                      Rejected: {owner.rejectionReason}
                    </p>
                  ) : null}
                </div>

                {owner.status === "PENDING" ? (
                  <div className="flex lg:justify-end">
                    <OwnerReviewActions id={owner.id} />
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
            href={`/admin/owners?page=${Math.max(1, page - 1)}${status ? `&status=${status}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
            href={`/admin/owners?page=${page + 1}${status ? `&status=${status}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
