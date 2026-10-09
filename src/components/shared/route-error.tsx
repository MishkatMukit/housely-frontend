"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function RouteError({
  error,
  reset,
  title = "Something fell out of the ledger",
  description = "An unexpected error interrupted this page. Try again — if it keeps happening, the register may be briefly out of reach.",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[1400px] flex-col items-center justify-center gap-6 px-5 text-center sm:px-8">
      <span className="stamp stamp-red">Error</span>
      <div className="max-w-md">
        <h1 className="display text-4xl text-ink">{title}</h1>
        <p className="mt-3 leading-relaxed text-ink-soft">{description}</p>
        {error.digest && (
          <p className="figure mt-3 text-xs uppercase tracking-[0.14em] text-ink-soft/70">
            Reference {error.digest}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          className="rounded-none bg-ink text-paper hover:bg-ink/90"
          onClick={reset}
        >
          Try again
        </Button>
        <Button
          variant="outline"
          className="rounded-none border-ink/40 text-ink hover:bg-ink hover:text-paper"
          render={<Link href="/" />}
        >
          Back to the register
        </Button>
      </div>
    </div>
  );
}
