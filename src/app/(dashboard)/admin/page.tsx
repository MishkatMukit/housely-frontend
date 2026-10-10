import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  OwnerVettingDonut,
  PlatformBars,
} from "@/components/dashboard/admin-charts";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { getAdminAnalytics } from "@/lib/api/admin";
import { formatTaka } from "@/lib/api/properties";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AdminDashboardPage() {
  const [user, analytics] = await Promise.all([
    getCurrentUser(),
    getAdminAnalytics(),
  ]);

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="space-y-8">
      <PageHeader
        index="01"
        eyebrow="Control room"
        title={firstName ? `Platform ledger, ${firstName}` : "Platform ledger"}
        description="The whole marketplace on one page — people, property, and the money moving across the register."
        action={
          <span className="figure border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-ink-soft">
            {user?.role === "SUPERADMIN" ? "Super admin" : "Administrator"}
          </span>
        }
      />

      {analytics ? (
        <>
          <section className="grid grid-cols-2 gap-x-px gap-y-6 sm:grid-cols-4">
            <StatCard
              label="Owners"
              value={analytics.totalOwners}
              hint="Registered owners"
              tone="ledger"
            />
            <StatCard
              label="Pending owners"
              value={analytics.totalPendingOwnerApplications}
              hint="Awaiting vetting"
              tone="tolet"
            />
            <StatCard
              label="Tenants"
              value={analytics.totalTenants}
              hint="Active tenants"
            />
            <StatCard
              label="Properties"
              value={analytics.totalProperties}
              hint="Buildings listed"
            />
            <StatCard
              label="Flats"
              value={analytics.totalFlats}
              hint="Units on the register"
              tone="ledger"
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
              label="Revenue"
              value={formatTaka(analytics.totalRevenue)}
              hint="Collected to date"
              tone="stamp"
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <OwnerVettingDonut analytics={analytics} />
            <PlatformBars analytics={analytics} />
          </section>
        </>
      ) : (
        <p className="rule-top bg-surface/50 px-4 py-6 text-sm text-ink-soft">
          Platform analytics could not be read right now. Pull again in a
          moment.
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            href: "/admin/users",
            label: "Users",
            copy: "Search every account, block or restore, and promote admins.",
          },
          {
            href: "/admin/owners/applications",
            label: "Owner applications",
            copy: "Vet pending owner applications and approve or reject them.",
          },
          {
            href: "/admin/owners",
            label: "Owners",
            copy: "Audit approved owners and their verification records.",
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
