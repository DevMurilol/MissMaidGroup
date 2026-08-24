import { z } from "zod";

export const quoteFormSchema = z.object({
  serviceId: z.enum(["regular", "deep", "move", "airbnb"]),
  bedrooms: z.coerce.number().int().min(1).max(6),
  bathrooms: z.coerce.number().int().min(1).max(4),
  frequency: z.enum(["once", "weekly", "fortnightly", "monthly"]),
  addonIds: z.array(z.string()).default([]),
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number")
    .max(20),
  suburb: z.string().trim().min(2, "Please select or enter your suburb").max(60),
  notes: z.string().trim().max(500).optional().default(""),
  company: z.string().max(0, "").optional().default(""),
});

export type QuoteFormInput = z.infer<typeof quoteFormSchema>;
