"use client";

import { RouteError } from "@/components/shared/route-error";

export default function PropertyDetailError({
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
      title="This entry could not be opened"
      description="Something went wrong while reading this property file. Try again, or head back to the register."
    />
  );
}
