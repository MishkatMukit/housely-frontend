"use server";

import { revalidatePath } from "next/cache";
import { withdrawApplication } from "@/lib/api/tenant";

export interface WithdrawResult {
  ok: boolean;
  message: string;
}

export async function withdrawApplicationAction(
  id: string,
): Promise<WithdrawResult> {
  const result = await withdrawApplication(id);

  if (!result.ok) {
    return {
      ok: false,
      message: result.body?.message ?? "Application could not be withdrawn.",
    };
  }

  revalidatePath("/tenant/applications");
  revalidatePath("/tenant");

  return {
    ok: true,
    message: result.body?.message ?? "Application withdrawn.",
  };
}
