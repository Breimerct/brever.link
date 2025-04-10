import type { CreateLink, Link } from "@/types/link.type";
import { db, eq, LinkTable } from "astro:db";

export const verifyIsExistingLinkBySlug = async (
  slug: string,
): Promise<boolean> => {
  try {
    const existingLinks = await db
      .select()
      .from(LinkTable)
      .where(eq(LinkTable.slug, slug))
      .execute();
    return existingLinks.length > 0;
  } catch (error) {
    console.error("Error in verifyIsExistingLink:", error);
    return false;
  }
};

export const getLinkBySlug = async (slug: string) => {
  try {
    const [link] = await db
      .select()
      .from(LinkTable)
      .where(eq(LinkTable.slug, slug))
      .execute();

    return {
      success: true,
      data: formatLink(link),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to retrieve link",
      data: null,
    };
  }
};

export const incrementClickCount = async (slug: string) => {
  try {
    const { data: link } = await getLinkBySlug(slug);

    if (!link) {
      return {
        success: false,
        error: "Link not found",
        data: null,
      };
    }

    // Increment the click count
    const [updatedLink] = await db
      .update(LinkTable)
      .set({ clickCount: link.clickCount + 1 })
      .where(eq(LinkTable.slug, slug))
      .returning()
      .execute();

    if (!updatedLink) {
      return {
        success: false,
        error: "Failed to update click count",
        data: null,
      };
    }

    return {
      success: true,
      data: formatLink(updatedLink),
      error: null,
    };
  } catch (error) {
    console.error("Error in incrementClickCount:", error);
    return {
      success: false,
      error: "Failed to increment click count",
      data: null,
    };
  }
};

export const createLink = async ({ slug, url, shortLink }: CreateLink) => {
  try {
    // Insert new link
    const [insertResult] = await db
      .insert(LinkTable)
      .values({
        id: crypto.randomUUID(),
        url,
        slug,
        shortLink,
      })
      .returning(); // Usar returning() para obtener los datos insertados

    if (!insertResult) {
      return {
        success: false,
        error: "Insert failed",
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data: formatLink(insertResult),
    };
  } catch (error) {
    console.error("Error in createLink:", error);
    return {
      success: false,
      error: "Failed to create link",
      data: null,
    };
  }
};

export const formatLink = (link: Link) => {
  if (!link) return null;

  return {
    id: link.id,
    url: link.url,
    slug: link.slug,
    shortLink: link.shortLink,
    clickCount: link.clickCount,
    createdAt: link.createdAt,
  };
};

export const getAllLinks = async (): Promise<Link[]> => {
  try {
    const links = await db.select().from(LinkTable).execute();
    return links;
  } catch (error) {
    console.error("Error in getAllLinks:", error);
    return []; // Return an empty array in case of error
  }
};
