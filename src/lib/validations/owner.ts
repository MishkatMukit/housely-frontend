import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value));

export const ownerProfileSchema = z
  .object({
    name: optionalText(100),
    contactNumber: z
      .string()
      .trim()
      .min(6)
      .max(20)
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),
    address: optionalText(255),
    gender: z
      .enum(["MALE", "FEMALE"])
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),
    nationalIdNumber: optionalText(50),
  })
  .strict();

export const ownerApplicationSchema = z.object({
  contactNumber: z.string().trim().min(6).max(20),
  address: z.string().trim().min(5).max(255),
  nationalIdNumber: z.string().trim().min(4).max(50),
});

export const propertySchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
  address: z.string().trim().min(5).max(255),
  city: z.string().trim().min(2).max(100),
  district: z.string().trim().min(2).max(100),
  postalCode: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
  companyName: z
    .string()
    .trim()
    .max(150)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
});

const positiveAmount = z.coerce.number().positive().max(10_000_000);
const nonNegativeAmount = z.coerce.number().min(0).max(10_000_000);

export const variantSchema = z.object({
  name: z.string().trim().min(2).max(100),
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().int().min(0).max(20),
  sizeSqft: z
    .union([z.literal(""), z.coerce.number().int().min(50).max(20_000)])
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  rentAmount: positiveAmount,
  advanceAmount: nonNegativeAmount,
  totalUnits: z.coerce.number().int().min(1).max(100),
  flatNumberPrefix: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{0,10}$/)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
});

export const variantUpdateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  bedrooms: z.coerce.number().int().min(0).max(20).optional(),
  bathrooms: z.coerce.number().int().min(0).max(20).optional(),
  sizeSqft: z.coerce.number().int().min(50).max(20_000).optional(),
  rentAmount: positiveAmount.optional(),
  advanceAmount: nonNegativeAmount.optional(),
});

export const addFlatsSchema = z.object({
  count: z.coerce.number().int().min(1).max(100),
  flatNumberPrefix: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{0,10}$/)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
});

export const flatUpdateSchema = z.object({
  flatNumber: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]{1,20}$/)
    .optional(),
  status: z.enum(["AVAILABLE", "MAINTENANCE", "UNAVAILABLE"]).optional(),
  rentOverride: z
    .union([
      z.literal(""),
      z.coerce.number().positive().max(10_000_000),
      z.null(),
    ])
    .optional()
    .transform((value) => (value === "" ? null : value)),
  advanceOverride: z
    .union([z.literal(""), z.coerce.number().min(0).max(10_000_000), z.null()])
    .optional()
    .transform((value) => (value === "" ? null : value)),
});

export type OwnerProfileInput = z.infer<typeof ownerProfileSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
export type FlatUpdateInput = z.infer<typeof flatUpdateSchema>;
