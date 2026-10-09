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
import type { OwnerAnalytics } from "@/types/api";

const axisTick = { fontSize: 11, fill: "var(--ink-soft)" };

function LedgerTooltip({
  active,
  payload,
  suffix,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: { name?: string; label?: string };
  }>;
  suffix?: string;
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
        {suffix}
      </p>
    </div>
  );
}

export function PortfolioDonut({ analytics }: { analytics: OwnerAnalytics }) {
  const occupied = Math.max(analytics.totalFlats - analytics.availableFlats, 0);
  const data = [
    { name: "Occupied", value: occupied, fill: "var(--tolet)" },
    {
      name: "Available",
      value: analytics.availableFlats,
      fill: "var(--stamp)",
    },
  ];

  return (
    <div className="rule-top bg-surface/50 px-4 py-5">
      <p className="eyebrow">Flats on the register</p>
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
              {analytics.totalFlats.toLocaleString()}
            </dt>
            <dd className="text-xs text-ink-soft">Total flats</dd>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <span
              className="inline-block h-2.5 w-2.5"
              style={{ background: "var(--stamp)" }}
            />
            {analytics.availableFlats.toLocaleString()} available
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <span
              className="inline-block h-2.5 w-2.5"
              style={{ background: "var(--tolet)" }}
            />
            {occupied.toLocaleString()} occupied
          </div>
        </dl>
      </div>
    </div>
  );
}

export function PipelineBars({ analytics }: { analytics: OwnerAnalytics }) {
  const data = [
    {
      label: "Applications",
      value: analytics.totalApplications,
      fill: "var(--ledger)",
    },
    {
      label: "Active leases",
      value: analytics.totalActiveLeases,
      fill: "var(--ink)",
    },
    {
      label: "Pending dues",
      value: analytics.pendingPayments,
      fill: "var(--tolet)",
    },
  ];

  return (
    <div className="rule-top bg-surface/50 px-4 py-5">
      <p className="eyebrow">Tenancy pipeline</p>
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
            <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={56}>
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
