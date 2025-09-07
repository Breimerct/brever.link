import type { CreateLink, Link, PaginatedLinks } from "@/types/link.type";
import { count, db, desc, eq, like, LinkTable } from "astro:db";

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
  } catch {
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
      data: link,
      error: null,
    };
  } catch {
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
      data: updatedLink,
      error: null,
    };
  } catch {
    return {
      success: false,
      error: "Failed to increment click count",
      data: null,
    };
  }
};

export const createNewLink = async ({
  slug,
  url,
  shortLink,
  qrCode,
}: CreateLink) => {
  try {
    const { rowsAffected } = await db
      .insert(LinkTable)
      .values({
        id: crypto.randomUUID(),
        url,
        slug,
        shortLink,
        qrCode,
        createdAt: new Date(),
      })
      .execute();

    if (rowsAffected === 0) {
      return {
        success: false,
        error: "Insert failed",
      };
    }

    return {
      success: true,
      error: null,
      message: "Link created successfully",
    };
  } catch {
    return {
      success: false,
      error: "Failed to create link",
    };
  }
};

export const getAllLinks = async (): Promise<Link[]> => {
  try {
    const links = await db
      .select()
      .from(LinkTable)
      .orderBy(desc(LinkTable.createdAt))
      .execute();

    return links;
  } catch {
    return [];
  }
};

export const getAllPaginatedLinks = async (
  page: number,
  limit: number,
  slug: string = "",
): Promise<PaginatedLinks> => {
  try {
    const links = await db
      .select()
      .from(LinkTable)
      .where(like(LinkTable.slug, `%${slug}%`))
      .orderBy(desc(LinkTable.createdAt))
      .limit(limit)
      .offset((page - 1) * limit)
      .execute();

    const [totalLinks] = await db
      .select({ count: count() })
      .from(LinkTable)
      .where(like(LinkTable.slug, `%${slug}%`))
      .execute();

    const totalPages = Math.ceil(totalLinks.count / limit);

    return {
      links,
      totalLinks: totalLinks.count,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch {
    return {
      links: [],
      totalLinks: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
};
