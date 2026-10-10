"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { type ActionState, resetPasswordAction } from "@/app/(auth)/actions";
import { ResendOtpButton } from "@/components/forms/resend-otp-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = { success: false, message: "" };

export function ResetPasswordForm({ email }: { email?: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  useEffect(() => {
    if (state.message && !state.success) toast.error(state.message);
    if (state.success && state.redirectTo) {
      toast.success(state.message);
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={email}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="otp">OTP</Label>
        <Input
          id="otp"
          name="otp"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input id="newPassword" name="newPassword" type="password" required />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Resetting..." : "Reset password"}
      </Button>
      <ResendOtpButton type="password" defaultEmail={email} />
    </form>
  );
}
