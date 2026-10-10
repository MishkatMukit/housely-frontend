"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminAnalytics } from "@/types/api";

const axisTick = { fontSize: 11, fill: "var(--ink-soft)" };

function LedgerTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: { name?: string; label?: string };
  }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  return (
    <div className="border border-ink/20 bg-paper px-3 py-2 text-xs shadow-sm">
      <p className="figure uppercase tracking-[0.08em] text-ink-soft">
        {row.payload?.name ?? row.payload?.label ?? row.name}
      </p>
      <p className="figure mt-0.5 text-base text-ink">
        {typeof row.value === "number" ? row.value.toLocaleString() : row.value}
      </p>
    </div>
  );
}

export function OwnerVettingDonut({
  analytics,
}: {
  analytics: AdminAnalytics;
}) {
  const data = [
    {
      name: "Approved",
      value: analytics.totalApprovedOwners,
      fill: "var(--stamp)",
    },
    {
      name: "Pending",
      value: analytics.totalPendingOwnerApplications,
      fill: "var(--ledger)",
    },
    {
      name: "Rejected",
      value: analytics.totalRejectedOwners,
      fill: "var(--tolet)",
    },
  ].filter((slice) => slice.value > 0);

  return (
    <div className="rule-top bg-surface/50 px-4 py-5">
      <p className="eyebrow">Owner vetting</p>
      {data.length === 0 ? (
        <p className="mt-3 text-sm text-ink-soft">No owner records yet.</p>
      ) : (
        <div className="mt-2 flex items-center gap-4">
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={44}
                  outerRadius={68}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((slice) => (
                    <Cell key={slice.name} fill={slice.fill} />
                  ))}
                </Pie>
                <Tooltip content={<LedgerTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <dl className="space-y-2.5 text-sm">
            <div>
              <dt className="figure text-3xl text-ink">
                {analytics.totalOwners.toLocaleString()}
              </dt>
              <dd className="text-xs text-ink-soft">Owners on file</dd>
            </div>
            {data.map((slice) => (
              <div
                key={slice.name}
                className="flex items-center gap-2 text-xs text-ink-soft"
              >
                <span
                  className="inline-block h-2.5 w-2.5"
                  style={{ background: slice.fill }}
                />
                {slice.value.toLocaleString()} {slice.name.toLowerCase()}
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

export function PlatformBars({ analytics }: { analytics: AdminAnalytics }) {
  const data = [
    {
      label: "Tenants",
      value: analytics.totalTenants,
      fill: "var(--ledger)",
    },
    {
      label: "Properties",
      value: analytics.totalProperties,
      fill: "var(--ink)",
    },
    { label: "Flats", value: analytics.totalFlats, fill: "var(--stamp)" },
    {
      label: "Leases",
      value: analytics.totalActiveLeases,
      fill: "var(--tolet)",
    },
    {
      label: "Applications",
      value: analytics.totalApplications,
      fill: "var(--ledger)",
    },
  ];

  return (
    <div className="rule-top bg-surface/50 px-4 py-5">
      <p className="eyebrow">Platform footprint</p>
      <div className="mt-3 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
          >
            <XAxis
              dataKey="label"
              tick={axisTick}
              tickLine={false}
              axisLine={{ stroke: "var(--ink-soft)", strokeOpacity: 0.3 }}
            />
            <YAxis
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "var(--ink)", fillOpacity: 0.06 }}
              content={<LedgerTooltip />}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={48}>
              {data.map((row) => (
                <Cell key={row.label} fill={row.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
