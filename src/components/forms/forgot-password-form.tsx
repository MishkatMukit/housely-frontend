"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { type ActionState, forgotPasswordAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = { success: false, message: "" };

export function ForgotPasswordForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
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
          placeholder="m@example.com"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending OTP..." : "Send reset OTP"}
      </Button>
    </form>
  );
}
