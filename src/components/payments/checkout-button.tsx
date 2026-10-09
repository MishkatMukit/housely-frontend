"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { checkoutAction } from "@/app/(dashboard)/tenant/payments/actions";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  const handleCheckout = () => {
    startTransition(async () => {
      const result = await checkoutAction(id);
      if (result.ok && result.url) {
        toast.message(result.message);
        window.location.assign(result.url);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={handleCheckout}
      className="rounded-none bg-tolet text-primary-foreground hover:bg-tolet/90"
    >
      {pending ? "Starting..." : "Pay with bKash"}
    </Button>
  );
}
