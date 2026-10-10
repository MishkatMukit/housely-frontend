import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusStamp } from "@/components/dashboard/status-stamp";
import { getAdminTenants } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{
  page?: string;
  status?: string;
  search?: string;
}>;

const FILTERS: { label: string; value?: "ACTIVE" | "INACTIVE" }[] = [
  { label: "All" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminTenantsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const status = FILTERS.find((item) => item.value === params.status)?.value;
  const search = params.search?.trim() || undefined;

  const result = await getAdminTenants({ page, status, search });
  const tenants = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;
  const total = result?.total ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        index="05"
        eyebrow="Control room"
        title="Tenants"
        description="The renter directory. Search who is on the platform and where they stand."
        action={
          <span className="figure border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-ink-soft">
            {total.toLocaleString()} tenants
          </span>
        }
      />

      <nav className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = filter.value === status;
          const href = filter.value
            ? `/admin/tenants?status=${filter.value}`
            : "/admin/tenants";
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

      {tenants.length === 0 ? (
        <EmptyState
          eyebrow="No matches"
          title="No tenants found"
          description="Adjust the filter above to find tenant records."
        />
      ) : (
        <section className="rule-top divide-y divide-ink/10">
          {tenants.map((tenant) => (
            <article key={tenant.id} className="space-y-2 py-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="display text-base text-ink">
                  {tenant.name || tenant.user?.name || "Tenant"}
                </h2>
                <StatusStamp status={tenant.status} />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {tenant.email || tenant.user?.email}
                </span>
                {tenant.contactNumber ? (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {tenant.contactNumber}
                  </span>
                ) : null}
              </div>
              <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
                <div className="flex gap-1.5">
                  <dt>Employment:</dt>
                  <dd className="text-ink">{tenant.employmentStatus ?? "—"}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt>Joined:</dt>
                  <dd className="text-ink">{formatDate(tenant.createdAt)}</dd>
                </div>
              </dl>
              {tenant.aboutMe ? (
                <p className="max-w-2xl text-sm italic leading-relaxed text-ink-soft">
                  {tenant.aboutMe}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      )}

      {totalPages > 1 ? (
        <nav className="rule-top flex items-center justify-between pt-5">
          <Link
            href={`/admin/tenants?page=${Math.max(1, page - 1)}${status ? `&status=${status}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
            href={`/admin/tenants?page=${page + 1}${status ? `&status=${status}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
