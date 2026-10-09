import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/forms/verify-email-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function VerifyFormSlot({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <VerifyEmailForm email={email} />;
}

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  return (
    <div className="container flex min-h-screen w-screen items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            Enter the 6-digit OTP we sent to your email to activate your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <VerifyFormSlot searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
