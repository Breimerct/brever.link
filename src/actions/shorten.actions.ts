import { shorLinkSchema } from "@/schemas/short-link.schema";
import { shorLink } from "@/services/shorten.service";
import { defineAction } from "astro:actions";

export const shortenAction = {
  shortenLink: defineAction({
    accept: "json",
    input: shorLinkSchema,
    handler: shorLink,
  }),
};
