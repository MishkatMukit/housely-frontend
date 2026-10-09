import { SiteHeader } from "@/components/shared/site-header";

export const instant = false;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex-1 py-8">{children}</main>
    </div>
  );
}
