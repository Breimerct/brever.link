import * as z from "zod";

export const FilterLinksSchema = z.object({
  search: z.string().optional().default(""),
});
