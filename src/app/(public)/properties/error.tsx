"use client";

import { RouteError } from "@/components/shared/route-error";

export default function PropertiesError({
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
      title="The register could not be read"
      description="We could not pull the vacancy list just now. Try again — the backend may be catching its breath."
    />
  );
}
