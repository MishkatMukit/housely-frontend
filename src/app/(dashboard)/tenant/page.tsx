import { getCurrentUser } from "@/lib/auth/session";

export default async function TenantDashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Tenant dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {user?.name}.</p>
    </div>
  );
}
