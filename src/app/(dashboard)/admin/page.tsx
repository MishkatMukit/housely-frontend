import { getCurrentUser } from "@/lib/auth/session";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Admin dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {user?.name}.</p>
    </div>
  );
}
