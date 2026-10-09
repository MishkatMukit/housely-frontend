import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <div className="container flex min-h-screen w-screen items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Forgot password</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you an OTP to reset it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
        <div className="mt-4 text-center text-sm">
          Remembered it?{" "}
          <Link href="/login" className="underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
