import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  PipelineBars,
  PortfolioDonut,
} from "@/components/dashboard/owner-charts";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { getOwnerAnalytics } from "@/lib/api/owner";
import { formatTaka } from "@/lib/api/properties";
import { getCurrentUser } from "@/lib/auth/session";

export default async function OwnerDashboardPage() {
  const [user, analytics] = await Promise.all([
    getCurrentUser(),
    getOwnerAnalytics(),
  ]);

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="space-y-8">
      <PageHeader
        index="01"
        eyebrow="Owner register"
        title={firstName ? `Good to see you, ${firstName}` : "Owner register"}
        description="Your portfolio at a glance — occupancy across the register, the tenancy pipeline, and what the ledger still owes you."
        action={
          <Button
            className="rounded-none bg-tolet px-4 text-primary-foreground hover:bg-tolet/90"
            render={<Link href="/owner/properties" />}
          >
            Manage properties
          </Button>
        }
      />

      {analytics ? (
        <>
          <section className="grid grid-cols-2 gap-x-px gap-y-6 sm:grid-cols-4">
            <StatCard
              label="Properties"
              value={analytics.totalProperties}
              hint="Buildings listed"
              tone="ledger"
            />
            <StatCard
              label="Flats"
              value={analytics.totalFlats}
              hint="Units on the register"
            />
            <StatCard
              label="Available"
              value={analytics.availableFlats}
              hint="Ready to let"
              tone="stamp"
            />
            <StatCard
              label="Active leases"
              value={analytics.totalActiveLeases}
              hint="Currently tenanted"
            />
            <StatCard
              label="Applications"
              value={analytics.totalApplications}
              hint="All submitted"
              tone="ledger"
            />
            <StatCard
              label="Pending dues"
              value={analytics.pendingPayments}
              hint="Awaiting settlement"
              tone="tolet"
            />
            <StatCard
              label="Earnings"
              value={formatTaka(analytics.totalEarnings)}
              hint="Collected to date"
              tone="stamp"
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <PortfolioDonut analytics={analytics} />
            <PipelineBars analytics={analytics} />
          </section>
        </>
      ) : (
        <p className="rule-top bg-surface/50 px-4 py-6 text-sm text-ink-soft">
          Your register could not be read right now. Pull again in a moment.
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            href: "/owner/properties",
            label: "Properties",
            copy: "Add buildings, define variants, and issue flats.",
          },
          {
            href: "/owner/applications",
            label: "Applications",
            copy: "Review tenant applications and approve or decline.",
          },
          {
            href: "/owner/leases",
            label: "Leases",
            copy: "Track signed leases, payment schedules, and terminations.",
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
