"use client";

import { RouteError } from "@/components/shared/route-error";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      title="The dashboard hit a snag"
      description="This part of your account could not be loaded. Try again — nothing has been lost."
    />
  );
}
