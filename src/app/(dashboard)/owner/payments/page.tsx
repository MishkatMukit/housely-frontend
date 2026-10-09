import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusStamp } from "@/components/dashboard/status-stamp";
import { Pagination } from "@/components/properties/pagination";
import { getOwnerAnalytics, getOwnerPayments } from "@/lib/api/owner";
import { cn } from "@/lib/utils";
import type { Payment, PaymentStatus, PaymentType } from "@/types/api";

export const metadata = {
  title: "Payments",
};

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
] as const;

const TYPE_FILTERS = [
  { value: "", label: "Every type" },
  { value: "ADVANCE", label: "Advance" },
  { value: "MONTHLY_RENT", label: "Monthly rent" },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function taka(value: string | number) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `৳${amount.toLocaleString("en-BD")}` : "—";
}

function PaymentRow({ payment }: { payment: Payment }) {
  return (
    <li className="rule-top flex flex-col gap-3 bg-surface/50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <StatusStamp status={payment.type} />
          <StatusStamp status={payment.status} />
        </div>
        <p className="text-sm text-ink-soft">
          {payment.type === "ADVANCE"
            ? "Security advance"
            : payment.periodStart
              ? `Rent · ${formatDate(payment.periodStart)} – ${formatDate(
                  payment.periodEnd ?? payment.periodStart,
                )}`
              : "Monthly rent"}
        </p>
        {payment.paidAt ? (
          <p className="figure text-xs text-stamp">
            Paid {formatDate(payment.paidAt)}
            {payment.bkashTransactionId
              ? ` · ${payment.bkashTransactionId}`
              : ""}
          </p>
        ) : null}
      </div>
      <span className="figure text-lg text-ink">{taka(payment.amount)}</span>
    </li>
  );
}

type SearchParams = Promise<{
  page?: string;
  status?: string;
  type?: string;
}>;

export default async function OwnerPaymentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const statusParam = params.status?.toUpperCase();
  const typeParam = params.type?.toUpperCase();
  const status = STATUS_FILTERS.some((f) => f.value === statusParam)
    ? (statusParam as PaymentStatus)
    : undefined;
  const type = TYPE_FILTERS.some((f) => f.value === typeParam)
    ? (typeParam as PaymentType)
    : undefined;

  const [result, analytics] = await Promise.all([
    getOwnerPayments({ page, limit: 10, status, type }),
    getOwnerAnalytics(),
  ]);

  const buildHref = (target: number) => {
    const query = new URLSearchParams();
    if (status) query.set("status", status);
    if (type) query.set("type", type);
    if (target > 1) query.set("page", String(target));
    const qs = query.toString();
    return qs ? `/owner/payments?${qs}` : "/owner/payments";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        index="06"
        eyebrow="Owner desk"
        title="Payments"
        description="Advances and monthly rent collected across your leases."
      />

      {analytics ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Total earnings"
            value={taka(analytics.totalEarnings)}
            hint="completed payments"
            tone="stamp"
          />
          <StatCard
            label="Pending payments"
            value={String(analytics.pendingPayments)}
            hint="awaiting settlement"
            tone="tolet"
          />
        </div>
      ) : null}

      <div className="space-y-3">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => {
            const active = (status ?? "") === filter.value;
            const query = new URLSearchParams();
            if (filter.value) query.set("status", filter.value);
            if (type) query.set("type", type);
            const qs = query.toString();
            return (
              <a
                key={filter.label}
                href={qs ? `/owner/payments?${qs}` : "/owner/payments"}
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

        <nav aria-label="Filter by type" className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((filter) => {
            const active = (type ?? "") === filter.value;
            const query = new URLSearchParams();
            if (filter.value) query.set("type", filter.value);
            if (status) query.set("status", status);
            const qs = query.toString();
            return (
              <a
                key={filter.label}
                href={qs ? `/owner/payments?${qs}` : "/owner/payments"}
                className={cn(
                  "figure text-xs uppercase tracking-[0.1em] underline-offset-4 transition-colors hover:text-ink",
                  active ? "text-tolet underline" : "text-ink-soft",
                )}
              >
                {filter.label}
              </a>
            );
          })}
        </nav>
      </div>

      {!result || result.data.length === 0 ? (
        <EmptyState
          eyebrow="No payments"
          title="Nothing collected yet"
          description="Rent and advance payments appear here once your tenants settle them."
        />
      ) : (
        <>
          <ul className="space-y-0">
            {result.data.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))}
          </ul>
          <Pagination
            page={result.meta.page}
            totalPages={Math.max(
              1,
              Math.ceil(result.meta.total / result.meta.limit),
            )}
            total={result.meta.total}
            limit={result.meta.limit}
            buildHref={buildHref}
          />
        </>
      )}
    </div>
  );
}
