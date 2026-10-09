import { z } from "zod";

const optionalText = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value));

export const tenantProfileSchema = z
  .object({
    name: optionalText(2, 100),
    address: optionalText(1, 200),
    gender: z
      .enum(["MALE", "FEMALE"])
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),
    nationalIdNumber: optionalText(1, 50),
    contactNumber: optionalText(6, 20),
    employmentStatus: optionalText(2, 100),
    aboutMe: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),
  })
  .strict();

export type TenantProfileInput = z.infer<typeof tenantProfileSchema>;
