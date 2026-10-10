"use server";

import { revalidatePath } from "next/cache";
import {
  approveOwner,
  blockUser,
  deleteUser,
  makeAdmin,
  rejectOwner,
  unblockUser,
} from "@/lib/api/admin";

export interface AdminActionState {
  status: "idle" | "success" | "error";
  message: string;
}

export const initialAdminActionState: AdminActionState = {
  status: "idle",
  message: "",
};

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/owners");
  revalidatePath("/admin/owners/applications");
  revalidatePath("/admin/tenants");
}

export async function approveOwnerAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing owner." };

  const result = await approveOwner(id);
  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Owner could not be approved.",
    };
  }

  revalidateAdmin();
  return {
    status: "success",
    message: result.body?.message ?? "Owner approved.",
  };
}

export async function rejectOwnerAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("rejectionReason") ?? "").trim();

  if (!id) return { status: "error", message: "Missing owner." };
  if (reason.length < 3) {
    return {
      status: "error",
      message: "Give a short reason (at least 3 characters).",
    };
  }

  const result = await rejectOwner(id, reason);
  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Owner could not be rejected.",
    };
  }

  revalidateAdmin();
  return {
    status: "success",
    message: result.body?.message ?? "Owner rejected.",
  };
}

export async function blockUserAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing user." };

  const result = await blockUser(id);
  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "User could not be blocked.",
    };
  }

  revalidateAdmin();
  return {
    status: "success",
    message: result.body?.message ?? "User blocked.",
  };
}

export async function unblockUserAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing user." };

  const result = await unblockUser(id);
  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "User could not be unblocked.",
    };
  }

  revalidateAdmin();
  return {
    status: "success",
    message: result.body?.message ?? "User unblocked.",
  };
}

export async function makeAdminAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing user." };

  const result = await makeAdmin(id);
  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "User could not be promoted.",
    };
  }

  revalidateAdmin();
  return {
    status: "success",
    message: result.body?.message ?? "User promoted to admin.",
  };
}

export async function deleteUserAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing user." };

  const result = await deleteUser(id);
  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "User could not be removed.",
    };
  }

  revalidateAdmin();
  return {
    status: "success",
    message: result.body?.message ?? "User removed.",
  };
}
