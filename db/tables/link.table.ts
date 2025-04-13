import { defineTable, column } from "astro:db";

export const LinkTable = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
      autoIncrement: true,
      default: crypto.randomUUID(),
    }),
    url: column.text({
      optional: false,
    }),
    slug: column.text({
      unique: true,
      optional: false,
    }),
    shortLink: column.text({
      optional: false,
    }),
    createdAt: column.date({
      default: new Date(),
    }),
    clickCount: column.number({
      default: 0,
    }),
    qrCode: column.text({
      optional: true,
    }),
  },
});
