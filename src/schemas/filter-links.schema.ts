import { z } from "astro:schema";

export const FilterLinksSchema = z.object({
  search: z.string().optional().default(""),
});
