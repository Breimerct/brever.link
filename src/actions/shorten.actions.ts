import { shortLinkActionSchema } from "@/schemas/short-link-action.schema";
import { shorLink } from "@/services/shorten.service";
import { defineAction } from "astro:actions";

export const shortenAction = {
  shortenLink: defineAction({
    accept: "json",
    input: shortLinkActionSchema,
    handler: shorLink,
  }),
};
