import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { OwnerApplicationForm } from "@/components/forms/owner-application-form";
import { getCurrentUser } from "@/lib/auth/session";

export default async function BecomeOwnerPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login?redirect=%2Fprofile%2Fbecome-owner");
  if (user.role !== "TENANT") redirect("/profile");

  return (
    <div className="space-y-8">
      <PageHeader
        index="06"
        eyebrow="Owner application"
        title="Put your property on the register"
        description="Tell us who you are and attach your verification documents. An administrator reviews every application by hand."
      />
      <OwnerApplicationForm />
    </div>
  );
}
