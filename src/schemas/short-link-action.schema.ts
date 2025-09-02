import { z } from "astro:content";

export const shortLinkActionSchema = z.object({
  url: z.string().min(1, "URL is required").url("Invalid URL"),
  slug: z.string().min(1, "Slug is required"),
  qrCode: z.string().optional(),
});
