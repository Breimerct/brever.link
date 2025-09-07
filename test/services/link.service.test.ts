/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("astro:db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
  LinkTable: {
    slug: "slug",
    clickCount: "clickCount",
    createdAt: "createdAt",
    id: "id",
    url: "url",
    shortLink: "shortLink",
    qrCode: "qrCode",
  },
  eq: vi.fn(),
  like: vi.fn(),
  desc: vi.fn(),
  count: vi.fn(),
}));

Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: vi.fn(() => "mocked-uuid-123"),
  },
});

import {
  verifyIsExistingLinkBySlug,
  getLinkBySlug,
  incrementClickCount,
  createNewLink,
  getAllLinks,
  getAllPaginatedLinks,
} from "../../src/services/link.service";
import { db, LinkTable, eq, like, desc } from "astro:db";

describe("Link Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (db.select as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          execute: vi.fn(),
          orderBy: vi.fn().mockReturnValue({
            execute: vi.fn(),
            limit: vi.fn().mockReturnValue({
              offset: vi.fn().mockReturnValue({
                execute: vi.fn(),
              }),
            }),
          }),
        }),
        orderBy: vi.fn().mockReturnValue({
          execute: vi.fn(),
        }),
      }),
    });

    (db.insert as any).mockReturnValue({
      values: vi.fn().mockReturnValue({
        execute: vi.fn(),
      }),
    });

    (db.update as any).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockReturnValue({
            execute: vi.fn(),
          }),
        }),
      }),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("verifyIsExistingLinkBySlug", () => {
    it("should return true when link exists", async () => {
      const mockLinks = [{ id: "1", slug: "test-slug" }];

      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue(mockLinks),
          }),
        }),
      });

      const result = await verifyIsExistingLinkBySlug("test-slug");

      expect(result).toBe(true);
      expect(db.select).toHaveBeenCalled();
      expect(eq).toHaveBeenCalledWith(LinkTable.slug, "test-slug");
    });

    it("should return false when link does not exist", async () => {
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await verifyIsExistingLinkBySlug("non-existent-slug");

      expect(result).toBe(false);
    });

    it("should return false when database error occurs", async () => {
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockRejectedValue(new Error("Database error")),
          }),
        }),
      });

      const result = await verifyIsExistingLinkBySlug("test-slug");

      expect(result).toBe(false);
    });
  });

  describe("getLinkBySlug", () => {
    it("should return success with link data when link exists", async () => {
      const mockLink = {
        id: "1",
        slug: "test-slug",
        url: "https://github.com",
        shortLink: "brever.link/abc",
        qrCode: "qr-code-data",
        clickCount: 5,
        createdAt: new Date(),
      };

      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue([mockLink]),
          }),
        }),
      });

      const result = await getLinkBySlug("test-slug");

      expect(result).toEqual({
        success: true,
        data: mockLink,
        error: null,
      });
    });

    it("should return success with undefined data when link does not exist", async () => {
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await getLinkBySlug("non-existent-slug");

      expect(result).toEqual({
        success: true,
        data: undefined,
        error: null,
      });
    });

    it("should return error when database error occurs", async () => {
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockRejectedValue(new Error("Database error")),
          }),
        }),
      });

      const result = await getLinkBySlug("test-slug");

      expect(result).toEqual({
        success: false,
        error: "Failed to retrieve link",
        data: null,
      });
    });
  });

  describe("incrementClickCount", () => {
    it("should successfully increment click count", async () => {
      const mockLink = {
        id: "1",
        slug: "test-slug",
        clickCount: 5,
      };

      const updatedLink = {
        ...mockLink,
        clickCount: 6,
      };

      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue([mockLink]),
          }),
        }),
      });

      (db.update as any).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockReturnValue({
              execute: vi.fn().mockResolvedValue([updatedLink]),
            }),
          }),
        }),
      });

      const result = await incrementClickCount("test-slug");

      expect(result).toEqual({
        success: true,
        data: updatedLink,
        error: null,
      });
    });

    it("should return error when link not found", async () => {
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await incrementClickCount("non-existent-slug");

      expect(result).toEqual({
        success: false,
        error: "Link not found",
        data: null,
      });
    });

    it("should return error when update fails", async () => {
      const mockLink = {
        id: "1",
        slug: "test-slug",
        clickCount: 5,
      };

      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue([mockLink]),
          }),
        }),
      });

      (db.update as any).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockReturnValue({
              execute: vi.fn().mockResolvedValue([]),
            }),
          }),
        }),
      });

      const result = await incrementClickCount("test-slug");

      expect(result).toEqual({
        success: false,
        error: "Failed to update click count",
        data: null,
      });
    });

    it("should handle database errors gracefully", async () => {
      const mockLink = {
        id: "1",
        slug: "test-slug",
        clickCount: 5,
      };

      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue([mockLink]),
          }),
        }),
      });

      (db.update as any).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockReturnValue({
              execute: vi.fn().mockRejectedValue(new Error("Database error")),
            }),
          }),
        }),
      });

      const result = await incrementClickCount("test-slug");

      expect(result).toEqual({
        success: false,
        error: "Failed to increment click count",
        data: null,
      });
    });
  });

  describe("createNewLink", () => {
    const mockCreateLink = {
      slug: "test-slug",
      url: "https://google.com",
      shortLink: "brever.link/abc",
      qrCode: "qr-code-data",
    };

    it("should successfully create a new link", async () => {
      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          execute: vi.fn().mockResolvedValue({ rowsAffected: 1 }),
        }),
      });

      const result = await createNewLink(mockCreateLink);

      expect(result).toEqual({
        success: true,
        error: null,
        message: "Link created successfully",
      });

      expect(db.insert).toHaveBeenCalledWith(LinkTable);
    });

    it("should return error when insert fails (no rows affected)", async () => {
      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          execute: vi.fn().mockResolvedValue({ rowsAffected: 0 }),
        }),
      });

      const result = await createNewLink(mockCreateLink);

      expect(result).toEqual({
        success: false,
        error: "Insert failed",
      });
    });

    it("should handle database errors gracefully", async () => {
      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          execute: vi.fn().mockRejectedValue(new Error("Database error")),
        }),
      });

      const result = await createNewLink(mockCreateLink);

      expect(result).toEqual({
        success: false,
        error: "Failed to create link",
      });
    });

    it("should generate UUID and set creation date", async () => {
      const mockExecute = vi.fn().mockResolvedValue({ rowsAffected: 1 });
      const mockValues = vi.fn().mockReturnValue({ execute: mockExecute });

      (db.insert as any).mockReturnValue({
        values: mockValues,
      });

      await createNewLink(mockCreateLink);

      expect(mockValues).toHaveBeenCalledWith({
        id: "mocked-uuid-123",
        url: mockCreateLink.url,
        slug: mockCreateLink.slug,
        shortLink: mockCreateLink.shortLink,
        qrCode: mockCreateLink.qrCode,
        createdAt: expect.any(Date),
      });
    });
  });

  describe("getAllLinks", () => {
    it("should return all links ordered by creation date", async () => {
      const mockLinks = [
        { id: "1", slug: "test-1", createdAt: new Date("2023-01-02") },
        { id: "2", slug: "test-2", createdAt: new Date("2023-01-01") },
      ];

      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue(mockLinks),
          }),
        }),
      });

      const result = await getAllLinks();

      expect(result).toEqual(mockLinks);
      expect(desc).toHaveBeenCalledWith(LinkTable.createdAt);
    });

    it("should return empty array when database error occurs", async () => {
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            execute: vi.fn().mockRejectedValue(new Error("Database error")),
          }),
        }),
      });

      const result = await getAllLinks();

      expect(result).toEqual([]);
    });
  });

  describe("getAllPaginatedLinks", () => {
    const mockLinks = [
      { id: "1", slug: "test-1" },
      { id: "2", slug: "test-2" },
    ];

    it("should return paginated links with correct metadata", async () => {
      const mockLimit = vi.fn().mockReturnValue({
        offset: vi.fn().mockReturnValue({
          execute: vi.fn().mockResolvedValue(mockLinks),
        }),
      });

      const mockOrderBy = vi.fn().mockReturnValue({
        limit: mockLimit,
      });

      const mockWhere = vi.fn().mockReturnValue({
        orderBy: mockOrderBy,
      });

      (db.select as any).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: mockWhere,
        }),
      });

      (db.select as any).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue([{ count: 10 }]),
          }),
        }),
      });

      const result = await getAllPaginatedLinks(1, 5, "test");

      expect(result).toEqual({
        links: mockLinks,
        totalLinks: 10,
        totalPages: 2,
        currentPage: 1,
        hasNextPage: true,
        hasPreviousPage: false,
      });

      expect(mockLimit).toHaveBeenCalledWith(5);
      expect(like).toHaveBeenCalledWith(LinkTable.slug, "%test%");
    });

    it("should handle empty slug parameter", async () => {
      const mockLimit = vi.fn().mockReturnValue({
        offset: vi.fn().mockReturnValue({
          execute: vi.fn().mockResolvedValue(mockLinks),
        }),
      });

      const mockOrderBy = vi.fn().mockReturnValue({
        limit: mockLimit,
      });

      const mockWhere = vi.fn().mockReturnValue({
        orderBy: mockOrderBy,
      });

      (db.select as any).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: mockWhere,
        }),
      });

      (db.select as any).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue([{ count: 5 }]),
          }),
        }),
      });

      const result = await getAllPaginatedLinks(2, 3);

      expect(result.currentPage).toBe(2);
      expect(like).toHaveBeenCalledWith(LinkTable.slug, "%%");
    });

    it("should calculate pagination metadata correctly", async () => {
      (db.select as any).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockReturnValue({
                  execute: vi.fn().mockResolvedValue(mockLinks),
                }),
              }),
            }),
          }),
        }),
      });

      (db.select as any).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue([{ count: 7 }]),
          }),
        }),
      });

      const result = await getAllPaginatedLinks(2, 3);

      expect(result).toEqual({
        links: mockLinks,
        totalLinks: 7,
        totalPages: 3,
        currentPage: 2,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });

    it("should return default values when database error occurs", async () => {
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockReturnValue({
                  execute: vi
                    .fn()
                    .mockRejectedValue(new Error("Database error")),
                }),
              }),
            }),
          }),
        }),
      });

      const result = await getAllPaginatedLinks(1, 5);

      expect(result).toEqual({
        links: [],
        totalLinks: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });
});
