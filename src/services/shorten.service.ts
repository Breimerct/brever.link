import { ActionError, type ActionAPIContext } from "astro:actions";
import { createNewLink, verifyIsExistingLinkBySlug } from "./link.service";
import type { CreateLinkAction } from "@/types/link.type";
import QRCode from "qrcode";

export const shorLink = async (
  { url, slug }: CreateLinkAction,
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

    const shortLink = new URL(`${origin}/${slug}`).toString();

    const qrCode = await QRCode.toDataURL(shortLink, {
      errorCorrectionLevel: "H",
      margin: 1,
      scale: 4,
      width: 512,
    });

    const {
      data: insertResult,
      success,
      error,
    } = await createNewLink({ slug, url, shortLink, qrCode });

    if (!success || !insertResult) {
      throw new ActionError({
        message: error || "Failed to create link",
        code: "BAD_REQUEST",
      });
    }

    return {
      success: true,
      data: insertResult,
    };
  } catch (error: any) {
    console.error("Error in shortenUrl:", error);
    throw new ActionError(error);
  }
};
