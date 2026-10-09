import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { SiteHeader } from "@/components/shared/site-header";
import { getCurrentUser } from "@/lib/auth/session";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:gap-12">
        <aside className="lg:w-60 lg:shrink-0">
          <DashboardNav role={user?.role ?? null} />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
