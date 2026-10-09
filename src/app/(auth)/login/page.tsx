import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function LoginFormSlot({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return <LoginForm redirectTo={redirect} />;
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  return (
    <div className="container flex min-h-screen w-screen items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-40 w-full" />}>
              <LoginFormSlot searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
