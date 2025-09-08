import * as z from "zod";

export const shortLinkFormSchema = z.object({
  url: z
    .string({ required_error: "URL is required" })
    .min(1, "URL is required")
    .url("Invalid URL"),
  slug: z
    .string({ required_error: "Slug is required" })
    .min(1, "Slug is required")
    .max(10, "Slug must be at most 10 characters long")
    .refine((val) => /^[a-zA-Z0-9-_]+$/.test(val), {
      message:
        "No spaces allowed - separate words with hyphens (-) or underscores (_).",
    }),
});
