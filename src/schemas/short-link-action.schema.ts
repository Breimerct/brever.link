import { z } from "astro:schema";

export const shortLinkActionSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Invalid URL")
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);

          return urlObj.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message: "Only HTTP and HTTPS protocols are allowed",
      },
    ),
  slug: z.string().min(1, "Slug is required"),
});
