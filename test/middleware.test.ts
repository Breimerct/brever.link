/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("astro:middleware", () => ({
  defineMiddleware: (fn: typeof Function) => fn,
}));

vi.mock("../src/services/link.service", () => ({
  getLinkBySlug: vi.fn(),
  incrementClickCount: vi.fn(),
}));

import { onRequest } from "../src/middleware";
import {
  getLinkBySlug,
  incrementClickCount,
} from "../src/services/link.service";

const mockGetLinkBySlug = getLinkBySlug as ReturnType<typeof vi.fn>;
const mockIncrementClickCount = incrementClickCount as ReturnType<typeof vi.fn>;

describe("Middleware", () => {
  let mockContext: any;
  let mockNext: any;
  let mockRedirect: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockNext = vi.fn().mockResolvedValue(new Response("next response"));
    mockRedirect = vi
      .fn()
      .mockImplementation(
        (url: string) =>
          new Response(null, { status: 302, headers: { location: url } }),
      );

    mockContext = {
      request: new Request("https://example.com/test-slug"),
      redirect: mockRedirect,
    };

    mockGetLinkBySlug.mockReset();
    mockIncrementClickCount.mockReset();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("URL parsing and slug extraction", () => {
    it("should call next() when URL has a trailing slash (empty slug)", async () => {
      mockContext.request = new Request("https://example.com/");

      const result = await onRequest(mockContext, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetLinkBySlug).not.toHaveBeenCalled();
      expect(result).toBe(await mockNext());
    });

    it("should call next() when URL is the root domain (no path)", async () => {
      mockContext.request = new Request("https://example.com");

      const result = await onRequest(mockContext, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetLinkBySlug).not.toHaveBeenCalled();
      expect(result).toBe(await mockNext());
    });

    it("should call next() when path is root", async () => {
      mockContext.request = new Request("https://example.com");

      await onRequest(mockContext, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetLinkBySlug).not.toHaveBeenCalled();
    });

    it("should extract slug from URL path", async () => {
      mockContext.request = new Request("https://example.com/my-slug");

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: {
          id: "1",
          slug: "my-slug",
          url: "https://target.com",
          shortLink: "brever.link/abc",
          clickCount: 5,
          createdAt: new Date(),
        },
      });

      mockIncrementClickCount.mockResolvedValue({ success: true });

      await onRequest(mockContext, mockNext);

      expect(mockGetLinkBySlug).toHaveBeenCalledWith("my-slug");
    });

    it("should handle nested paths and extract the last segment as slug", async () => {
      mockContext.request = new Request(
        "https://example.com/some/nested/path/final-slug",
      );

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: {
          id: "1",
          slug: "final-slug",
          url: "https://target.com",
          shortLink: "brever.link/abc",
          clickCount: 5,
          createdAt: new Date(),
        },
      });

      mockIncrementClickCount.mockResolvedValue({ success: true });

      await onRequest(mockContext, mockNext);

      expect(mockGetLinkBySlug).toHaveBeenCalledWith("final-slug");
    });
  });

  describe("Link retrieval and validation", () => {
    it("should redirect to homepage when link is not found", async () => {
      mockContext.request = new Request("https://example.com/non-existent");

      mockGetLinkBySlug.mockResolvedValue({
        success: false,
        data: null,
        error: "Link not found",
      });

      await onRequest(mockContext, mockNext);

      expect(mockGetLinkBySlug).toHaveBeenCalledWith("non-existent");
      expect(mockRedirect).toHaveBeenCalledWith("/");
      expect(mockIncrementClickCount).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should redirect to homepage when link data is null", async () => {
      mockContext.request = new Request("https://example.com/null-link");

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: null,
        error: null,
      });

      await onRequest(mockContext, mockNext);

      expect(mockRedirect).toHaveBeenCalledWith("/");
      expect(mockIncrementClickCount).not.toHaveBeenCalled();
    });

    it("should redirect to homepage when success is false", async () => {
      mockContext.request = new Request("https://example.com/failed-link");

      mockGetLinkBySlug.mockResolvedValue({
        success: false,
        data: {
          id: "1",
          slug: "failed-link",
          url: "https://target.com",
          shortLink: "brever.link/abc",
          clickCount: 5,
          createdAt: new Date(),
        },
        error: "Database error",
      });

      await onRequest(mockContext, mockNext);

      expect(mockRedirect).toHaveBeenCalledWith("/");
      expect(mockIncrementClickCount).not.toHaveBeenCalled();
    });
  });

  describe("Successful link redirection", () => {
    const mockLink = {
      id: "1",
      slug: "test-slug",
      url: "https://target-website.com",
      shortLink: "brever.link/abc",
      clickCount: 10,
      createdAt: new Date(),
    };

    it("should increment click count and redirect to target URL", async () => {
      mockContext.request = new Request("https://example.com/test-slug");

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: mockLink,
        error: null,
      });

      mockIncrementClickCount.mockResolvedValue({
        success: true,
        data: { ...mockLink, clickCount: 11 },
        error: null,
      });

      const result = await onRequest(mockContext, mockNext);

      expect(mockGetLinkBySlug).toHaveBeenCalledWith("test-slug");
      expect(mockIncrementClickCount).toHaveBeenCalledWith("test-slug");
      expect(mockNext).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(302);
      expect((result as Response).headers.get("location")).toBe(
        "https://target-website.com/",
      );
    });

    it("should still redirect even if incrementClickCount fails", async () => {
      mockContext.request = new Request("https://example.com/test-slug");

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: mockLink,
        error: null,
      });

      mockIncrementClickCount.mockResolvedValue({
        success: false,
        data: null,
        error: "Failed to increment",
      });

      const result = await onRequest(mockContext, mockNext);

      expect(mockGetLinkBySlug).toHaveBeenCalledWith("test-slug");
      expect(mockIncrementClickCount).toHaveBeenCalledWith("test-slug");
      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(302);
      expect((result as Response).headers.get("location")).toBe(
        "https://target-website.com/",
      );
    });

    it("should handle URLs with query parameters", async () => {
      const linkWithQuery = {
        ...mockLink,
        url: "https://target-website.com/?utm_source=shortlink&utm_medium=redirect",
      };

      mockContext.request = new Request(
        "https://example.com/test-slug?ref=social",
      );

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: linkWithQuery,
        error: null,
      });

      mockIncrementClickCount.mockResolvedValue({ success: true });

      const result = await onRequest(mockContext, mockNext);

      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(302);
      expect((result as Response).headers.get("location")).toBe(
        linkWithQuery.url,
      );
    });

    it("should handle URLs with fragments", async () => {
      const linkWithFragment = {
        ...mockLink,
        url: "https://target-website.com/page#section",
      };

      mockContext.request = new Request("https://example.com/test-slug");

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: linkWithFragment,
        error: null,
      });

      mockIncrementClickCount.mockResolvedValue({ success: true });

      const result = await onRequest(mockContext, mockNext);

      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(302);
      expect((result as Response).headers.get("location")).toBe(
        linkWithFragment.url,
      );
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle getLinkBySlug throwing an exception", async () => {
      mockContext.request = new Request("https://example.com/error-slug");

      mockGetLinkBySlug.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(onRequest(mockContext, mockNext)).rejects.toThrow(
        "Database connection failed",
      );

      expect(mockIncrementClickCount).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should handle incrementClickCount throwing an exception", async () => {
      const mockLink = {
        id: "1",
        slug: "test-slug",
        url: "https://target-website.com",
        shortLink: "brever.link/abc",
        clickCount: 10,
        createdAt: new Date(),
      };

      mockContext.request = new Request("https://example.com/test-slug");

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: mockLink,
        error: null,
      });

      mockIncrementClickCount.mockRejectedValue(new Error("Update failed"));

      await expect(onRequest(mockContext, mockNext)).rejects.toThrow(
        "Update failed",
      );
    });

    it("should handle empty string slug", async () => {
      mockContext.request = new Request("https://example.com/");

      const result = await onRequest(mockContext, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetLinkBySlug).not.toHaveBeenCalled();
      expect(result).toBe(await mockNext());
    });

    it("should handle URL with only slash", async () => {
      mockContext.request = new Request("https://example.com/");

      await onRequest(mockContext, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetLinkBySlug).not.toHaveBeenCalled();
    });

    it("should handle malformed URLs gracefully", async () => {
      mockContext.request = new Request("https://example.com/valid-slug");

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: {
          id: "1",
          slug: "valid-slug",
          url: "https://valid-target.com",
          shortLink: "brever.link/abc",
          clickCount: 5,
          createdAt: new Date(),
        },
        error: null,
      });

      mockIncrementClickCount.mockResolvedValue({ success: true });

      const result = await onRequest(mockContext, mockNext);

      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(302);
      expect((result as Response).headers.get("location")).toBe(
        "https://valid-target.com/",
      );
    });

    it("should handle truly malformed URLs by throwing an error", async () => {
      mockContext.request = new Request("https://example.com/bad-slug");

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: {
          id: "1",
          slug: "bad-slug",
          url: "not-a-valid-url",
          shortLink: "brever.link/abc",
          clickCount: 5,
          createdAt: new Date(),
        },
        error: null,
      });

      mockIncrementClickCount.mockResolvedValue({ success: true });

      await expect(onRequest(mockContext, mockNext)).rejects.toThrow();
    });
  });

  describe("Different HTTP methods", () => {
    const mockLink = {
      id: "1",
      slug: "test-slug",
      url: "https://target-website.com",
      shortLink: "brever.link/abc",
      clickCount: 10,
      createdAt: new Date(),
    };

    it("should handle GET requests", async () => {
      mockContext.request = new Request("https://example.com/test-slug", {
        method: "GET",
      });

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: mockLink,
        error: null,
      });

      mockIncrementClickCount.mockResolvedValue({ success: true });

      const result = await onRequest(mockContext, mockNext);

      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(302);
    });

    it("should handle POST requests", async () => {
      mockContext.request = new Request("https://example.com/test-slug", {
        method: "POST",
      });

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: mockLink,
        error: null,
      });

      mockIncrementClickCount.mockResolvedValue({ success: true });

      const result = await onRequest(mockContext, mockNext);

      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(302);
    });

    it("should handle HEAD requests", async () => {
      mockContext.request = new Request("https://example.com/test-slug", {
        method: "HEAD",
      });

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: mockLink,
        error: null,
      });

      mockIncrementClickCount.mockResolvedValue({ success: true });

      const result = await onRequest(mockContext, mockNext);

      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(302);
    });
  });

  describe("URL encoding and special characters", () => {
    it("should handle URL encoded slugs", async () => {
      mockContext.request = new Request("https://example.com/my%20slug");

      mockGetLinkBySlug.mockResolvedValue({
        success: false,
        data: null,
        error: "Not found",
      });

      await onRequest(mockContext, mockNext);

      expect(mockGetLinkBySlug).toHaveBeenCalledWith("my slug");
    });

    it("should handle slugs with special characters", async () => {
      const specialSlug = "test-slug_123";
      mockContext.request = new Request(`https://example.com/${specialSlug}`);

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: {
          id: "1",
          slug: specialSlug,
          url: "https://target.com",
          shortLink: "brever.link/abc",
          clickCount: 5,
          createdAt: new Date(),
        },
        error: null,
      });

      mockIncrementClickCount.mockResolvedValue({ success: true });

      await onRequest(mockContext, mockNext);

      expect(mockGetLinkBySlug).toHaveBeenCalledWith(specialSlug);
    });

    it("should handle slugs with hyphens and numbers", async () => {
      const slugWithHyphens = "my-test-slug-123";
      mockContext.request = new Request(
        `https://example.com/${slugWithHyphens}`,
      );

      mockGetLinkBySlug.mockResolvedValue({
        success: true,
        data: {
          id: "1",
          slug: slugWithHyphens,
          url: "https://example-target.com",
          shortLink: "brever.link/abc",
          clickCount: 5,
          createdAt: new Date(),
        },
        error: null,
      });

      mockIncrementClickCount.mockResolvedValue({ success: true });

      const result = await onRequest(mockContext, mockNext);

      expect(mockGetLinkBySlug).toHaveBeenCalledWith(slugWithHyphens);
      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(302);
    });

    it("should call next() for whitespace-only slugs after decoding", async () => {
      mockContext.request = new Request("https://example.com/%20%20%20");

      const result = await onRequest(mockContext, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetLinkBySlug).not.toHaveBeenCalled();
      expect(result).toBe(await mockNext());
    });

    it("should handle empty string after URL decoding", async () => {
      const originalDecodeURIComponent = global.decodeURIComponent;
      global.decodeURIComponent = vi.fn().mockReturnValue("");

      mockContext.request = new Request("https://example.com/%00");

      const result = await onRequest(mockContext, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockGetLinkBySlug).not.toHaveBeenCalled();
      expect(result).toBe(await mockNext());

    
      global.decodeURIComponent = originalDecodeURIComponent;
    });
  });
});
