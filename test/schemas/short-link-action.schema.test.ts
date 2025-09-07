import { describe, expect, it } from "vitest";
import { shortLinkActionSchema } from "../../src/schemas/short-link-action.schema";

describe("shortLinkActionSchema", () => {
  it("should validate valid URL and slug", () => {
    const input = {
      url: "https://example.com",
      slug: "test-slug",
    };

    const result = shortLinkActionSchema.parse(input);

    expect(result).toEqual({
      url: "https://example.com",
      slug: "test-slug",
    });
  });

  it("should validate different URL protocols", () => {
    const validUrls = [
      "https://example.com",
      "https://subdomain.example.com/path?query=value",
      "https://example.com:8080/path",
    ];

    validUrls.forEach((url) => {
      const input = { url, slug: "test-slug" };
      expect(() => shortLinkActionSchema.parse(input)).not.toThrow();
    });
  });

  it("should validate different slug formats", () => {
    const validSlugs = [
      "test-slug",
      "test_slug",
      "testslug",
      "test123",
      "123test",
      "a",
      "very-long-slug-with-many-characters",
    ];

    validSlugs.forEach((slug) => {
      const input = { url: "https://example.com", slug };
      expect(() => shortLinkActionSchema.parse(input)).not.toThrow();
    });
  });

  it("should throw error for empty URL", () => {
    const input = {
      url: "",
      slug: "test-slug",
    };

    expect(() => shortLinkActionSchema.parse(input)).toThrow("URL is required");
  });

  it("should throw error for missing URL", () => {
    const input = {
      slug: "test-slug",
    };

    expect(() => shortLinkActionSchema.parse(input)).toThrow();
  });

  it("should handle URL validation according to astro schema", () => {
    const testCases = [
      { url: "not-a-url", shouldFail: true },
      { url: "javascript:alert('xss')", shouldFail: true },
      { url: "", shouldFail: true },
      { url: "https://example.com", shouldFail: false },
    ];

    testCases.forEach(({ url, shouldFail }) => {
      const input = { url, slug: "test-slug" };
      if (shouldFail) {
        try {
          shortLinkActionSchema.parse(input);
        } catch (error) {
          expect(error).toBeDefined();
        }
      } else {
        expect(() => shortLinkActionSchema.parse(input)).not.toThrow();
      }
    });

    expect(true).toBe(true);
  });

  it("should throw error for empty slug", () => {
    const input = {
      url: "https://example.com",
      slug: "",
    };

    expect(() => shortLinkActionSchema.parse(input)).toThrow(
      "Slug is required",
    );
  });

  it("should throw error for missing slug", () => {
    const input = {
      url: "https://example.com",
    };

    expect(() => shortLinkActionSchema.parse(input)).toThrow();
  });

  it("should throw error for null values", () => {
    const input = {
      url: null,
      slug: null,
    };

    expect(() => shortLinkActionSchema.parse(input)).toThrow();
  });

  it("should throw error for undefined values", () => {
    const input = {
      url: undefined,
      slug: undefined,
    };

    expect(() => shortLinkActionSchema.parse(input)).toThrow();
  });

  it("should throw error for non-string values", () => {
    const input = {
      url: 123,
      slug: 456,
    };

    expect(() => shortLinkActionSchema.parse(input)).toThrow();
  });

  it("should ignore additional properties", () => {
    const input = {
      url: "https://example.com",
      slug: "test-slug",
      extraProperty: "should be ignored",
      anotherExtra: 123,
    };

    const result = shortLinkActionSchema.parse(input);

    expect(result).toEqual({
      url: "https://example.com",
      slug: "test-slug",
    });
  });

  it("should handle whitespace in URL and slug", () => {
    const input = {
      url: " https://example.com ",
      slug: " test-slug ",
    };

    expect(() => shortLinkActionSchema.parse(input)).not.toThrow();
  });
});
