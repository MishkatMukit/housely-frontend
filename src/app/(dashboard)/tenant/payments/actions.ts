"use server";

import { revalidatePath } from "next/cache";
import { initiateCheckout } from "@/lib/api/tenant";

export interface CheckoutResult {
  ok: boolean;
  message: string;
  url?: string;
}

export async function checkoutAction(id: string): Promise<CheckoutResult> {
  const result = await initiateCheckout(id);

  if (!result.ok) {
    return {
      ok: false,
      message: result.body?.message ?? "Checkout could not be started.",
    };
  }

  revalidatePath("/tenant/payments");

  return {
    ok: true,
    message: "Opening bKash checkout...",
    url: result.body.data?.bkashURL,
  };
}
