import Link from "next/link";
import { ApplyDialog } from "@/components/properties/apply-dialog";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import type { Flat } from "@/types/api";

export async function ApplyCta({
  propertyId,
  propertyTitle,
  flats,
  available,
}: {
  propertyId: string;
  propertyTitle: string;
  flats: Flat[];
  available: number;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="grid gap-3">
        <Button
          size="lg"
          className="w-full rounded-none bg-ink text-paper hover:bg-ink/90"
          render={<Link href={`/login?redirect=/properties/${propertyId}`} />}
        >
          Log in to apply
        </Button>
        <p className="figure text-center text-[0.6875rem] uppercase tracking-[0.12em] text-ink-soft">
          No account?{" "}
          <Link
            href="/register"
            className="text-ledger underline decoration-ledger/40 underline-offset-4 hover:decoration-ledger"
          >
            Get on the register
          </Link>
        </p>
      </div>
    );
  }

  if (user.role !== "TENANT") {
    return (
      <p className="figure border border-dashed border-ink/30 p-4 text-center text-xs uppercase tracking-[0.1em] text-ink-soft">
        Only tenant accounts can apply for a flat. You are signed in as{" "}
        {user.role.toLowerCase()}.
      </p>
    );
  }

  if (flats.length === 0 || available === 0) {
    return (
      <p className="figure border border-dashed border-ink/30 p-4 text-center text-xs uppercase tracking-[0.1em] text-ink-soft">
        No flats are open for application right now. Check back after the owner
        registers another vacancy.
      </p>
    );
  }

  return <ApplyDialog propertyTitle={propertyTitle} flats={flats} />;
}
