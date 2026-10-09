import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { OwnerProfileForm } from "@/components/forms/owner-profile-form";
import { TenantProfileForm } from "@/components/forms/tenant-profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOwnerProfile } from "@/lib/api/owner";
import { getTenantProfile } from "@/lib/api/tenant";
import { getCurrentUser } from "@/lib/auth/session";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  if (user.role === "TENANT") {
    const profile = await getTenantProfile();

    return (
      <div className="space-y-8">
        <PageHeader
          index="05"
          eyebrow="Tenant profile"
          title="Profile"
          description="Keep your contact details and tenant record current — owners see this when reviewing applications."
        />
        {profile ? (
          <TenantProfileForm profile={profile} />
        ) : (
          <p className="rule-top bg-surface/50 px-4 py-6 text-sm text-ink-soft">
            Your profile could not be loaded. Try again in a moment.
          </p>
        )}

        <Link
          href="/profile/become-owner"
          className="rule-top group flex items-center justify-between bg-surface/50 px-4 py-5 transition-colors hover:bg-surface"
        >
          <div>
            <span className="figure text-sm uppercase tracking-[0.08em] text-ink">
              List your own property
            </span>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              Apply to become an owner and put your building on the register.
            </p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-tolet" />
        </Link>
      </div>
    );
  }

  if (user.role === "OWNER") {
    const profile = await getOwnerProfile();

    return (
      <div className="space-y-8">
        <PageHeader
          index="07"
          eyebrow="Owner profile"
          title="Profile"
          description="Keep your owner contact details current — tenants see these against your listings."
        />
        {profile ? (
          <OwnerProfileForm profile={profile} />
        ) : (
          <p className="rule-top bg-surface/50 px-4 py-6 text-sm text-ink-soft">
            Your owner profile could not be loaded. Try again in a moment.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        index="05"
        eyebrow="Account"
        title="Profile"
        description="Your account details on the Housely register."
      />
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role</span>
            <span>{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span>{user.status}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
