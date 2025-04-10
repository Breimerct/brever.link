import { ActionError, type ActionAPIContext } from "astro:actions";
import {
  createLink,
  formatLink,
  verifyIsExistingLinkBySlug,
} from "./link.service";
import type { CreateLinkForm } from "@/types/link.type";

export const shorLink = async (
  { url, slug }: CreateLinkForm,
  context: ActionAPIContext,
) => {
  try {
    const originUrl = context.request.headers.get("referer");
    const refererUrl = new URL(originUrl || "");
    const origin = import.meta.env.PROD
      ? refererUrl.origin
      : import.meta.env.BASE_SHORT_URL;

    // Check if the URL already exists
    const existingLinks = await verifyIsExistingLinkBySlug(slug);

    if (existingLinks) {
      throw new ActionError({
        message: "Link already exists",
        code: "CONFLICT",
      });
    }

    // Insert new link
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
