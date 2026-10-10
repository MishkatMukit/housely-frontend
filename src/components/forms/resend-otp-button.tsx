"use client";

import { type MouseEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { resendOtpAction } from "@/app/(auth)/actions";

export function ResendOtpButton({
  type,
  defaultEmail = "",
}: {
  type: "register" | "password";
  defaultEmail?: string;
}) {
  const [pending, setPending] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const handleResend = async (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    const email =
      (form ? new FormData(form).get("email")?.toString().trim() : "") ||
      defaultEmail;

    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }

    setPending(true);
    const result = await resendOtpAction(email, type);
    setPending(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setSeconds(30);
  };

  const label = pending
    ? "Sending…"
    : seconds > 0
      ? `Resend in ${seconds}s`
      : "Resend OTP";

  return (
    <p className="text-center text-sm text-muted-foreground">
      Didn't get the code?{" "}
      <button
        type="button"
        onClick={handleResend}
        disabled={pending || seconds > 0}
        className="font-medium text-primary underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {label}
      </button>
    </p>
  );
}
