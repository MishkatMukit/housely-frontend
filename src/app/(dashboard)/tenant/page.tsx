import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { formatTaka } from "@/lib/api/properties";
import { getTenantAnalytics } from "@/lib/api/tenant";
import { getCurrentUser } from "@/lib/auth/session";

export default async function TenantDashboardPage() {
  const [user, analytics] = await Promise.all([
    getCurrentUser(),
    getTenantAnalytics(),
  ]);

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="space-y-8">
      <PageHeader
        index="01"
        eyebrow="Tenant register"
        title={firstName ? `Welcome back, ${firstName}` : "Tenant register"}
        description="Your tenancy at a glance — applications in motion, signed leases, and what is owed on the register."
        action={
          <Button
            className="rounded-none bg-tolet px-4 text-primary-foreground hover:bg-tolet/90"
            render={<Link href="/properties" />}
          >
            Browse vacancies
          </Button>
        }
      />

      {analytics ? (
        <section className="grid grid-cols-2 gap-x-px gap-y-6 sm:grid-cols-4">
          <StatCard
            label="Applications"
            value={analytics.totalApplications}
            hint="All submitted"
            tone="ledger"
          />
          <StatCard
            label="Approved"
            value={analytics.totalApprovedApplications}
            hint="Owners said yes"
            tone="stamp"
          />
          <StatCard
            label="Rejected"
            value={analytics.totalRejectedApplications}
            hint="Not this one"
            tone="tolet"
          />
          <StatCard
            label="Active leases"
            value={analytics.totalActiveLeases}
            hint="Currently rented"
          />
          <StatCard
            label="Pending dues"
            value={analytics.totalPendingPayments}
            hint="Awaiting checkout"
            tone="tolet"
          />
          <StatCard
            label="Paid"
            value={analytics.totalCompletedPayments}
            hint="Settled payments"
            tone="stamp"
          />
          <StatCard
            label="Total spent"
            value={formatTaka(analytics.totalSpent)}
            hint="Across all leases"
          />
        </section>
      ) : (
        <p className="rule-top bg-surface/50 px-4 py-6 text-sm text-ink-soft">
          Your register could not be read right now. Pull again in a moment.
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            href: "/tenant/applications",
            label: "Applications",
            copy: "Track, filter, and withdraw your flat applications.",
          },
          {
            href: "/tenant/leases",
            label: "Leases",
            copy: "Review lease terms and the payment schedule attached.",
          },
          {
            href: "/tenant/payments",
            label: "Payments",
            copy: "Clear pending dues with bKash and keep receipts.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rule-top group flex flex-col gap-3 bg-surface/50 px-4 py-5 transition-colors hover:bg-surface"
          >
            <div className="flex items-center justify-between">
              <span className="figure text-sm uppercase tracking-[0.08em] text-ink">
                {item.label}
              </span>
              <ArrowUpRight className="h-4 w-4 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-tolet" />
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">{item.copy}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
