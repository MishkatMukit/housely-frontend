"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { type ActionState, loginAction } from "@/app/(auth)/actions";
import { GoogleLoginButton } from "@/components/forms/google-login-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = { success: false, message: "" };

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  useEffect(() => {
    if (state.message && !state.success) toast.error(state.message);
    if (state.success && state.redirectTo) {
      toast.success(state.message);
      router.push(redirectTo || state.redirectTo);
      router.refresh();
    }
  }, [state, router, redirectTo]);

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
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <GoogleLoginButton />
    </form>
  );
}
