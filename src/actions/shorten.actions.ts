import { shortLinkActionSchema } from "@/schemas";
import { shorLink } from "@/services/shorten.service";
import { defineAction } from "astro:actions";

export const shortenAction = {
  shortenLink: defineAction({
    accept: "json",
    input: shortLinkActionSchema,
    handler: shorLink,
  }),
};
