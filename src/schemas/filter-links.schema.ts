import { z } from "astro:content";

export const FilterLinksSchema = z.object({
  search: z.string().optional().default(""),
});
