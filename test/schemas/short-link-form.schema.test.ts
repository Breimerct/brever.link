import { describe, it, expect } from "vitest";
import { shortLinkFormSchema } from "../../src/schemas/short-link-form.schema";

describe("shortLinkFormSchema", () => {
  it("validates correct data successfully", () => {
    const validData = {
      url: "https://example.com",
      slug: "my-slug",
    };

    const result = shortLinkFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it("rejects empty url", () => {
    const invalidData = {
      url: "",
      slug: "my-slug",
    };

    const result = shortLinkFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toHaveLength(2);
      expect(result.error.issues[0].path).toEqual(["url"]);
      expect(result.error.issues[0].message).toBe("URL is required");
    }
  });

  it("rejects invalid url format", () => {
    const invalidData = {
      url: "not-a-valid-url",
      slug: "my-slug",
    };

    const result = shortLinkFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
      expect(result.error.issues[0].path).toEqual(["url"]);
      expect(result.error.issues[0].message).toBe("Invalid URL");
    }
  });

  it("rejects empty slug", () => {
    const invalidData = {
      url: "https://example.com",
      slug: "",
    };

    const result = shortLinkFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
      expect(result.error.issues[0].path).toEqual(["slug"]);
      expect(result.error.issues[0].message).toBe("Slug is required");
    }
  });

  it("rejects missing fields", () => {
    const invalidData = {};

    const result = shortLinkFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toHaveLength(2);
      const urlIssue = result.error.issues.find(
        (issue) => issue.path[0] === "url",
      );
      const slugIssue = result.error.issues.find(
        (issue) => issue.path[0] === "slug",
      );

      expect(urlIssue?.message).toBe("URL is required");
      expect(slugIssue?.message).toBe("Slug is required");
    }
  });

  it("accepts various valid URL formats", () => {
    const validUrls = [
      "https://example.com",
      "http://example.com",
      "https://www.example.com/path?query=1",
      "https://sub.domain.example.com:8080/path#fragment",
    ];

    validUrls.forEach((url) => {
      const data = { url, slug: "test-slug" };
      const result = shortLinkFormSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.url).toBe(url);
      }
    });
  });

  it("accepts various valid slug formats", () => {
    const validSlugs = [
      "simple-slug",
      "slug_with_underscores",
      "UPPERCASE-SLUG",
      "slug123",
      "a",
      "very-long-slug-with-many-characters",
    ];

    validSlugs.forEach((slug) => {
      const data = { url: "https://example.com", slug };
      const result = shortLinkFormSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe(slug);
      }
    });
  });
});
