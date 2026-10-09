import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function ResetFormSlot({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <ResetPasswordForm email={email} />;
}

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  return (
    <div className="container flex min-h-screen w-screen items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            Enter the OTP and your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <ResetFormSlot searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
