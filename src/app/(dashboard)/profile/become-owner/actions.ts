"use server";

import { revalidatePath } from "next/cache";
import { applyAsOwner } from "@/lib/api/owner";
import { ownerApplicationSchema } from "@/lib/validations/owner";

export interface OwnerApplyState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export const initialOwnerApplyState: OwnerApplyState = {
  status: "idle",
  message: "",
};

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function applyOwnerAction(
  _prev: OwnerApplyState,
  formData: FormData,
): Promise<OwnerApplyState> {
  const parsed = ownerApplicationSchema.safeParse({
    contactNumber: formData.get("contactNumber"),
    address: formData.get("address"),
    nationalIdNumber: formData.get("nationalIdNumber"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const files = formData
    .getAll("verificationDocuments")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length < 1 || files.length > 4) {
    return {
      status: "error",
      message: "Attach between 1 and 4 verification documents.",
      fieldErrors: { verificationDocuments: ["Attach 1 to 4 documents."] },
    };
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        status: "error",
        message: "Documents must be JPG, PNG, WEBP, or PDF.",
        fieldErrors: {
          verificationDocuments: [`${file.name}: unsupported type.`],
        },
      };
    }
    if (file.size > MAX_FILE_SIZE) {
      return {
        status: "error",
        message: "Each document must be 5 MB or smaller.",
        fieldErrors: {
          verificationDocuments: [`${file.name}: file too large.`],
        },
      };
    }
  }

  const payload = new FormData();
  payload.set("data", JSON.stringify(parsed.data));
  for (const file of files) payload.append("verificationDocuments", file);

  const result = await applyAsOwner(payload);

  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Application could not be submitted.",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/become-owner");

  return {
    status: "success",
    message:
      result.body?.message ??
      "Your owner application has been submitted successfully.",
  };
}
