"use client";

import {
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  type LucideIcon,
  ScrollText,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/api";

type NavItem = {
  href: string;
  label: string;
  index: string;
  icon: LucideIcon;
  exact?: boolean;
};

function profileItem(index: string): NavItem {
  return { href: "/profile", label: "Profile", index, icon: UserRound };
}

const ADMIN_ITEMS: NavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    index: "01",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/admin/users", label: "Users", index: "02", icon: Users },
  {
    href: "/admin/owners",
    label: "Owners",
    index: "03",
    icon: Building2,
    exact: true,
  },
  {
    href: "/admin/owners/applications",
    label: "Applications",
    index: "04",
    icon: FileText,
  },
  { href: "/admin/tenants", label: "Tenants", index: "05", icon: UserRound },
  profileItem("06"),
];

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  TENANT: [
    {
      href: "/tenant",
      label: "Overview",
      index: "01",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/tenant/applications",
      label: "Applications",
      index: "02",
      icon: FileText,
    },
    { href: "/tenant/leases", label: "Leases", index: "03", icon: ScrollText },
    {
      href: "/tenant/payments",
      label: "Payments",
      index: "04",
      icon: CreditCard,
    },
    profileItem("05"),
  ],
  OWNER: [
    {
      href: "/owner",
      label: "Overview",
      index: "01",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/owner/properties",
      label: "Properties",
      index: "02",
      icon: Building2,
    },
    {
      href: "/owner/applications",
      label: "Applications",
      index: "03",
      icon: FileText,
    },
    { href: "/owner/leases", label: "Leases", index: "04", icon: ScrollText },
    { href: "/owner/tenants", label: "Tenants", index: "05", icon: Users },
    {
      href: "/owner/payments",
      label: "Payments",
      index: "06",
      icon: CreditCard,
    },
    profileItem("07"),
  ],
  ADMIN: ADMIN_ITEMS,
  SUPERADMIN: ADMIN_ITEMS,
};

export function DashboardNav({ role }: { role: UserRole | null }) {
  const pathname = usePathname();
  const items = role ? NAV_BY_ROLE[role] : [];

  if (items.length === 0) return null;

  return (
    <nav aria-label="Dashboard sections" className="lg:sticky lg:top-24">
      <p className="eyebrow mb-3 hidden lg:block">Sections</p>
      <ul className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <li
              key={item.href}
              className="shrink-0 lg:border-b lg:border-ink/10"
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 transition-colors lg:border-l-2 lg:px-3.5",
                  active
                    ? "bg-ink text-paper lg:border-tolet"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink lg:border-transparent",
                )}
              >
                <span
                  className={cn(
                    "figure hidden text-[0.6875rem] lg:inline",
                    active ? "text-paper/60" : "text-ink-soft/60",
                  )}
                >
                  {item.index}
                </span>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="figure text-[0.8125rem] uppercase tracking-[0.08em]">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
