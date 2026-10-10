import { Search } from "lucide-react";
import Link from "next/link";
import { UserActions } from "@/components/admin/user-management";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusStamp } from "@/components/dashboard/status-stamp";
import { getAdminUsers } from "@/lib/api/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import type { UserRole, UserStatus } from "@/types/api";

type SearchParams = Promise<{
  page?: string;
  role?: string;
  status?: string;
  search?: string;
}>;

const ROLE_FILTERS: { label: string; value?: UserRole }[] = [
  { label: "All" },
  { label: "Tenants", value: "TENANT" },
  { label: "Owners", value: "OWNER" },
  { label: "Admins", value: "ADMIN" },
  { label: "Superadmins", value: "SUPERADMIN" },
];

const STATUS_FILTERS: { label: string; value?: UserStatus }[] = [
  { label: "Any status" },
  { label: "Active", value: "ACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
];

function buildHref(
  base: Record<string, string | undefined>,
  overrides: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  const merged = { ...base, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/admin/users?${query}` : "/admin/users";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const role = ROLE_FILTERS.find((item) => item.value === params.role)?.value;
  const status = STATUS_FILTERS.find(
    (item) => item.value === params.status,
  )?.value;
  const search = params.search?.trim() || undefined;

  const [currentUser, result] = await Promise.all([
    getCurrentUser(),
    getAdminUsers({ page, role, status, search }),
  ]);

  const users = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;
  const total = result?.total ?? 0;
  const base = { role, status, search };

  return (
    <div className="space-y-8">
      <PageHeader
        index="02"
        eyebrow="Control room"
        title="Users"
        description="Every account on the platform. Block bad actors, restore the innocent, and mint new administrators."
        action={
          <span className="figure border border-ink/15 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-ink-soft">
            {total.toLocaleString()} accounts
          </span>
        }
      />

      <form
        method="get"
        action="/admin/users"
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        {role ? <input type="hidden" name="role" value={role} /> : null}
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search by name or email"
            className="w-full border border-ink/15 bg-paper py-2 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-ink/40"
          />
        </div>
        <button
          type="submit"
          className="figure border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.12em] text-paper transition-colors hover:bg-ink/90"
        >
          Search
        </button>
      </form>

      <div className="space-y-3">
        <nav className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((filter) => {
            const active = filter.value === role;
            return (
              <Link
                key={filter.label}
                href={buildHref(base, { role: filter.value, page: undefined })}
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
        <nav className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => {
            const active = filter.value === status;
            return (
              <Link
                key={filter.label}
                href={buildHref(base, {
                  status: filter.value,
                  page: undefined,
                })}
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
      </div>

      {users.length === 0 ? (
        <EmptyState
          eyebrow="No matches"
          title="No users found"
          description="Adjust the filters or search term to find the account you need."
        />
      ) : (
        <section className="rule-top divide-y divide-ink/10">
          {users.map((user) => (
            <article
              key={user.id}
              className="grid gap-4 py-4 lg:grid-cols-[1fr_auto] lg:items-center"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="display truncate text-base text-ink">
                    {user.name}
                  </h2>
                  <span className="figure text-[0.6875rem] uppercase tracking-[0.12em] text-ledger">
                    {user.role}
                  </span>
                  <StatusStamp status={user.status} />
                  {!user.emailVerified ? (
                    <span className="stamp stamp-blue">Unverified</span>
                  ) : null}
                </div>
                <p className="truncate text-sm text-ink-soft">{user.email}</p>
                <p className="text-xs text-ink-soft">
                  Joined {formatDate(user.createdAt)}
                </p>
              </div>
              <div className="flex lg:justify-end">
                <UserActions
                  id={user.id}
                  status={user.status}
                  role={user.role}
                  currentUserRole={currentUser?.role ?? null}
                  isSelf={user.id === currentUser?.id}
                />
              </div>
            </article>
          ))}
        </section>
      )}

      {totalPages > 1 ? (
        <nav className="rule-top flex items-center justify-between pt-5">
          <Link
            href={buildHref(base, { page: String(Math.max(1, page - 1)) })}
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
            href={buildHref(base, { page: String(page + 1) })}
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
