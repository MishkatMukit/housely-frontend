import { WithdrawButton } from "@/components/applications/withdraw-button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusStamp } from "@/components/dashboard/status-stamp";
import { Pagination } from "@/components/properties/pagination";
import { formatTaka } from "@/lib/api/properties";
import { getMyApplications } from "@/lib/api/tenant";
import { cn } from "@/lib/utils";
import type { Application } from "@/types/api";

export const metadata = {
  title: "Applications",
};

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ApplicationRow({ application }: { application: Application }) {
  const flat = application.flat;
  const property = flat?.property;
  const variant = flat?.variant;
  const rent = flat?.rentOverride ?? variant?.rentAmount;

  return (
    <li className="rule-top bg-surface/50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <StatusStamp status={application.status} />
            <span className="figure text-xs uppercase tracking-[0.12em] text-ink-soft">
              {property?.title ?? "Property"}
            </span>
          </div>
          <h3 className="display text-xl text-ink">
            {flat?.flatNumber ? `Flat ${flat.flatNumber}` : "Flat"}
            {variant?.name ? (
              <span className="text-ink-soft"> · {variant.name}</span>
            ) : null}
          </h3>
          <p className="text-sm text-ink-soft">
            {[property?.address, property?.city, property?.district]
              .filter(Boolean)
              .join(", ") || "Location unavailable"}
          </p>
          <dl className="flex flex-wrap gap-x-6 gap-y-1">
            {rent ? (
              <div className="figure text-xs text-ink">
                {formatTaka(Number(rent))}
                <span className="text-ink-soft">/mo</span>
              </div>
            ) : null}
            <div className="figure text-xs text-ink-soft">
              Applied {formatDate(application.createdAt)}
            </div>
          </dl>
          {application.message ? (
            <p className="max-w-2xl text-sm italic text-ink-soft">
              “{application.message}”
            </p>
          ) : null}
          {application.rejectionReason ? (
            <p className="text-sm text-tolet">
              Reason: {application.rejectionReason}
            </p>
          ) : null}
        </div>

        {application.status === "PENDING" ? (
          <div className="shrink-0">
            <WithdrawButton id={application.id} />
          </div>
        ) : null}
      </div>
    </li>
  );
}

type SearchParams = Promise<{ page?: string; status?: string }>;

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const statusParam = params.status?.toUpperCase();
  const status = STATUS_FILTERS.some((f) => f.value === statusParam)
    ? (statusParam as Application["status"])
    : undefined;

  const result = await getMyApplications({ page, limit: 10, status });

  const buildHref = (target: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/tenant/applications?${qs}` : "/tenant/applications";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        index="02"
        eyebrow="Tenant register"
        title="Applications"
        description="Every flat you have applied for, with the owner's verdict. Withdraw a pending application if plans change."
      />

      <nav aria-label="Filter applications" className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const active = (status ?? "") === filter.value;
          const params = new URLSearchParams();
          if (filter.value) params.set("status", filter.value);
          const qs = params.toString();
          return (
            <a
              key={filter.label}
              href={qs ? `/tenant/applications?${qs}` : "/tenant/applications"}
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
          eyebrow="No applications"
          title="Nothing filed yet"
          description="Browse the register and apply to a vacant flat. Your applications will appear here with their status."
        />
      ) : (
        <>
          <ul className="space-y-0">
            {result.data.map((application) => (
              <ApplicationRow key={application.id} application={application} />
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
