"use server";

import { revalidatePath } from "next/cache";
import {
  addFlats,
  createProperty,
  createVariant,
  deleteFlat,
  deleteVariant,
  updateFlat,
  updateVariant,
} from "@/lib/api/owner";
import {
  addFlatsSchema,
  flatUpdateSchema,
  propertySchema,
  variantSchema,
  variantUpdateSchema,
} from "@/lib/validations/owner";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface FormActionState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  propertyId?: string;
}

function collectImages(formData: FormData, field = "images"): File[] {
  return formData
    .getAll(field)
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

function validateImages(images: File[]): string | null {
  if (images.length > 4) return "Attach at most 4 images.";
  for (const file of images) {
    if (!ALLOWED_TYPES.includes(file.type))
      return `${file.name}: must be JPG, PNG, or WEBP.`;
    if (file.size > MAX_FILE_SIZE) return `${file.name}: must be 5 MB or less.`;
  }
  return null;
}

export async function createPropertyAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const parsed = propertySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    address: formData.get("address"),
    city: formData.get("city"),
    district: formData.get("district"),
    postalCode: formData.get("postalCode"),
    companyName: formData.get("companyName"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const images = collectImages(formData);
  const imageError = validateImages(images);
  if (imageError) {
    return {
      status: "error",
      message: imageError,
      fieldErrors: { images: [imageError] },
    };
  }

  const payload = new FormData();
  payload.set("data", JSON.stringify(parsed.data));
  for (const file of images) payload.append("images", file);

  const result = await createProperty(payload);

  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Property could not be created.",
    };
  }

  revalidatePath("/owner/properties");
  revalidatePath("/properties");

  return {
    status: "success",
    message: result.body?.message ?? "Property created successfully.",
    propertyId: result.body.data?.id,
  };
}

export async function createVariantAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const propertyId = String(formData.get("propertyId") ?? "");
  if (!propertyId) return { status: "error", message: "Missing property." };

  const parsed = variantSchema.safeParse({
    name: formData.get("name"),
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    sizeSqft: formData.get("sizeSqft"),
    rentAmount: formData.get("rentAmount"),
    advanceAmount: formData.get("advanceAmount"),
    totalUnits: formData.get("totalUnits"),
    flatNumberPrefix: formData.get("flatNumberPrefix"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const images = collectImages(formData);
  const imageError = validateImages(images);
  if (imageError) {
    return {
      status: "error",
      message: imageError,
      fieldErrors: { images: [imageError] },
    };
  }

  const payload = new FormData();
  payload.set("data", JSON.stringify(parsed.data));
  for (const file of images) payload.append("images", file);

  const result = await createVariant(propertyId, payload);

  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Variant could not be created.",
    };
  }

  revalidatePath(`/owner/properties/${propertyId}`);
  return {
    status: "success",
    message: result.body?.message ?? "Variant created successfully.",
  };
}

export async function updateVariantAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const id = String(formData.get("id") ?? "");
  const propertyId = String(formData.get("propertyId") ?? "");
  if (!id) return { status: "error", message: "Missing variant." };

  const parsed = variantUpdateSchema.safeParse({
    name: formData.get("name"),
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    sizeSqft: formData.get("sizeSqft"),
    rentAmount: formData.get("rentAmount"),
    advanceAmount: formData.get("advanceAmount"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = Object.fromEntries(
    Object.entries(parsed.data).filter(([, value]) => value !== undefined),
  );

  if (Object.keys(payload).length === 0) {
    return { status: "error", message: "Change at least one field." };
  }

  const result = await updateVariant(id, payload);

  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Variant could not be updated.",
    };
  }

  if (propertyId) revalidatePath(`/owner/properties/${propertyId}`);
  return {
    status: "success",
    message: result.body?.message ?? "Variant updated successfully.",
  };
}

export async function addFlatsAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const variantId = String(formData.get("variantId") ?? "");
  const propertyId = String(formData.get("propertyId") ?? "");
  if (!variantId) return { status: "error", message: "Missing variant." };

  const parsed = addFlatsSchema.safeParse({
    count: formData.get("count"),
    flatNumberPrefix: formData.get("flatNumberPrefix"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await addFlats(variantId, {
    count: parsed.data.count,
    ...(parsed.data.flatNumberPrefix
      ? { flatNumberPrefix: parsed.data.flatNumberPrefix }
      : {}),
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Flats could not be added.",
    };
  }

  if (propertyId) revalidatePath(`/owner/properties/${propertyId}`);
  return {
    status: "success",
    message: result.body?.message ?? "Flats added successfully.",
  };
}

export async function updateFlatAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const id = String(formData.get("id") ?? "");
  const propertyId = String(formData.get("propertyId") ?? "");
  if (!id) return { status: "error", message: "Missing flat." };

  const parsed = flatUpdateSchema.safeParse({
    flatNumber: formData.get("flatNumber"),
    status: formData.get("status"),
    rentOverride: formData.get("rentOverride"),
    advanceOverride: formData.get("advanceOverride"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = Object.fromEntries(
    Object.entries(parsed.data).filter(([, value]) => value !== undefined),
  );

  if (Object.keys(payload).length === 0) {
    return { status: "error", message: "Change at least one field." };
  }

  const result = await updateFlat(id, payload);

  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Flat could not be updated.",
    };
  }

  if (propertyId) revalidatePath(`/owner/properties/${propertyId}`);
  return {
    status: "success",
    message: result.body?.message ?? "Flat updated successfully.",
  };
}

export async function deleteVariantAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const propertyId = String(formData.get("propertyId") ?? "");
  if (!id) return;
  await deleteVariant(id);
  if (propertyId) revalidatePath(`/owner/properties/${propertyId}`);
}

export async function deleteFlatAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const propertyId = String(formData.get("propertyId") ?? "");
  if (!id) return;
  await deleteFlat(id);
  if (propertyId) revalidatePath(`/owner/properties/${propertyId}`);
}
