import { defineDb } from "astro:db";
import { LinkTable } from "./tables/link.table";

// https://astro.build/db/config
export default defineDb({
  tables: {
    LinkTable,
  },
});
