import { ActionError, type ActionAPIContext } from "astro:actions";
import { createNewLink, verifyIsExistingLinkBySlug } from "./link.service";
import type { CreateLinkAction } from "@/types/link.type";
import { validateUrl } from "@/helpers";
import QRCode from "qrcode";

export const shorLink = async (
  { url, slug }: CreateLinkAction,
  { request }: ActionAPIContext,
) => {
  const validationResult = validateUrl(url);

  if (!validationResult.isValid) {
    throw new ActionError({
      message: validationResult.error || "Invalid URL",
      code: "BAD_REQUEST",
    });
  }

  const originUrl = request.headers.get("referer");
  const { origin } = new URL(originUrl || "");

  const existingLinks = await verifyIsExistingLinkBySlug(slug);

  if (existingLinks) {
    throw new ActionError({
      message: `Link with slug "${slug}" already exists`,
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

  const { message, success, error } = await createNewLink({
    slug,
    url,
    shortLink,
    qrCode,
  });

  if (!success || !message) {
    throw new ActionError({
      message: error || "Failed to create link",
      code: "BAD_REQUEST",
    });
  }

  return {
    success: true,
    message,
  };
};
