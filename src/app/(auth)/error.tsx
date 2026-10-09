"use client";

import Link from "next/link";
import { RouteError } from "@/components/shared/route-error";
import { Button } from "@/components/ui/button";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <RouteError
        error={error}
        reset={reset}
        title="We could not open your account page"
        description="Something interrupted the sign-in flow. Try again, or return home and start over."
      />
      <div className="-mt-6 flex justify-center">
        <Button
          variant="ghost"
          className="figure rounded-none text-xs uppercase tracking-[0.14em] text-ink-soft"
          render={<Link href="/" />}
        >
          Go to the home page →
        </Button>
      </div>
    </div>
  );
}
