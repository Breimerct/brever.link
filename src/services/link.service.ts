import type {
  CreateLink,
  Link,
  PaginatedLinkResponse,
  ServiceResponse,
} from "@/types";
import type { PaginatedLinkParams } from "@/types/params.type";
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

export const getLinkBySlug = async (
  slug: string,
): Promise<ServiceResponse<Link | null>> => {
  try {
    const [link] = await db
      .select()
      .from(LinkTable)
      .where(eq(LinkTable.slug, slug))
      .execute();

    return {
      data: link || null,
      error: null,
    };
  } catch {
    return {
      error: "Failed to retrieve link",
      data: null,
    };
  }
};

export const incrementClickCount = async (
  slug: string,
): Promise<ServiceResponse<Link | null>> => {
  try {
    const { data: link } = await getLinkBySlug(slug);

    if (!link) {
      return {
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
        error: "Failed to update click count",
        data: null,
      };
    }

    return {
      data: updatedLink,
      error: null,
    };
  } catch {
    return {
      error: "Failed to increment click count",
      data: null,
    };
  }
};

export const createNewLink = async (
  data: CreateLink,
): Promise<ServiceResponse<string | null>> => {
  const { url, slug, shortLink, qrCode } = data;
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
        error: "Insert failed",
        data: null,
      };
    }

    return {
      error: null,
      data: "Link created successfully",
    };
  } catch {
    return {
      error: "Failed to create link",
      data: null,
    };
  }
};

export const getAllLinks = async (): Promise<ServiceResponse<Link[]>> => {
  try {
    const links = await db
      .select()
      .from(LinkTable)
      .orderBy(desc(LinkTable.createdAt))
      .execute();

    return {
      data: links,
      error: null,
    };
  } catch {
    return {
      error: "Failed to retrieve links",
      data: [],
    };
  }
};

export const getAllPaginatedLinks = async (
  data: PaginatedLinkParams,
): Promise<ServiceResponse<PaginatedLinkResponse>> => {
  const { page, limit, slug = "" } = data;
  const baseResponse: PaginatedLinkResponse = {
    links: [],
    totalLinks: 0,
    totalPages: 0,
    currentPage: page,
    hasNextPage: false,
    hasPreviousPage: false,
  };

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

    baseResponse.links = links;
    baseResponse.totalLinks = totalLinks.count;
    baseResponse.totalPages = totalPages;
    baseResponse.hasNextPage = page < totalPages;
    baseResponse.hasPreviousPage = page > 1;

    return {
      data: baseResponse,
      error: null,
    };
  } catch {
    return {
      error: "Failed to retrieve links",
      data: baseResponse,
    };
  }
};
