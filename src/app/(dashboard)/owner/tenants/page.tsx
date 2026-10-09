import { Mail, Phone } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { getOwnerLeases } from "@/lib/api/owner";
import type { Lease } from "@/types/api";

function taka(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `৳${amount.toLocaleString("en-BD")}` : "—";
}

export default async function OwnerTenantsPage() {
  const result = await getOwnerLeases({ status: "ACTIVE", limit: 100 });
  const leases = result?.data ?? [];

  const grouped = new Map<
    string,
    { name: string; email: string; contact: string; leases: Lease[] }
  >();

  for (const lease of leases) {
    const key = lease.tenantId;
    const existing = grouped.get(key);
    if (existing) {
      existing.leases.push(lease);
      continue;
    }
    grouped.set(key, {
      name: lease.tenant?.user?.name ?? lease.tenant?.name ?? "Tenant",
      email: lease.tenant?.user?.email ?? lease.tenant?.email ?? "",
      contact: lease.tenant?.contactNumber ?? "",
      leases: [lease],
    });
  }

  const tenants = [...grouped.values()];
  const monthlyTotal = leases.reduce(
    (sum, lease) => sum + (Number(lease.amount) || 0),
    0,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        index="05"
        eyebrow="Owner desk"
        title="Tenants"
        description="Everyone renting from you right now, drawn from your active leases."
      />

      {tenants.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Active tenants"
            value={String(tenants.length)}
            hint="with a live lease"
          />
          <StatCard
            label="Occupied flats"
            value={String(leases.length)}
            hint="across your register"
          />
          <StatCard
            label="Monthly rent"
            value={taka(String(monthlyTotal))}
            hint="from active leases"
          />
        </div>
      ) : null}

      {tenants.length === 0 ? (
        <EmptyState
          eyebrow="No tenants"
          title="No active tenancies"
          description="Once you approve applications, your tenants appear here."
        />
      ) : (
        <section className="grid gap-6 lg:grid-cols-2">
          {tenants.map((tenant) => (
            <article
              key={tenant.email || tenant.name}
              className="rule-top bg-surface/40 px-5 py-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="display text-lg text-ink">{tenant.name}</h2>
                <span className="stamp stamp-blue">
                  {tenant.leases.length}{" "}
                  {tenant.leases.length === 1 ? "flat" : "flats"}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-soft">
                {tenant.email ? (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {tenant.email}
                  </span>
                ) : null}
                {tenant.contact ? (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {tenant.contact}
                  </span>
                ) : null}
              </div>
              <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                {tenant.leases.map((lease) => (
                  <li
                    key={lease.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-ink">
                      {lease.flat?.property?.title ?? "Property"} ·{" "}
                      {lease.flat?.flatNumber ?? "—"}
                    </span>
                    <span className="figure text-ink-soft">
                      {taka(lease.amount)}/mo
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
