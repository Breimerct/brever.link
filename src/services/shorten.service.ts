import { ActionError, type ActionAPIContext } from "astro:actions";
import {
  createLink,
  formatLink,
  verifyIsExistingLinkBySlug,
} from "./link.service";
import type { CreateLinkForm } from "@/types/link.type";
const { BASE_SHORT_URL } = import.meta.env;

export const shorLink = async (
  { url, slug }: CreateLinkForm,
  context: ActionAPIContext,
) => {
  try {
    const originUrl = context.request.headers.get("referer");
    const { origin } = new URL(originUrl || "");

    const existingLinks = await verifyIsExistingLinkBySlug(slug);

    if (existingLinks) {
      throw new ActionError({
        message: "Link already exists",
        code: "CONFLICT",
      });
    }

    const shortLink = `${origin}/${slug}`;
    const {
      data: insertResult,
      success,
      error,
    } = await createLink({ slug, url, shortLink });

    if (!success || !insertResult) {
      throw new ActionError({
        message: error || "Failed to create link",
        code: "BAD_REQUEST",
      });
    }

    return {
      success: true,
      data: formatLink(insertResult),
    };
  } catch (error: any) {
    console.error("Error in shortenUrl:", error);
    throw new ActionError(error);
  }
};
