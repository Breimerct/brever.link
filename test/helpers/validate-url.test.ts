/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { validateUrl } from "../../src/helpers/validate-url";

describe("validateUrl function", () => {
  describe("Valid URLs", () => {
    it("should validate HTTPS URLs successfully", () => {
      const result = validateUrl("https://google.com");

      expect(result.isValid).toBe(true);
      expect(result.normalizedUrl).toBe("https://google.com/");
      expect(result.error).toBeUndefined();
    });

    it("should validate HTTPS URLs with www", () => {
      const result = validateUrl("https://www.github.com");

      expect(result.isValid).toBe(true);
      expect(result.normalizedUrl).toBe("https://www.github.com/");
    });

    it("should validate HTTPS URLs with paths", () => {
      const result = validateUrl("https://stackoverflow.com/questions/123");

      expect(result.isValid).toBe(true);
      expect(result.normalizedUrl).toBe(
        "https://stackoverflow.com/questions/123",
      );
    });

    it("should validate HTTPS URLs with query parameters", () => {
      const result = validateUrl("https://reddit.com/search?q=test");

      expect(result.isValid).toBe(true);
      expect(result.normalizedUrl).toBe("https://reddit.com/search?q=test");
    });

    it("should normalize URLs by trimming whitespace", () => {
      const result = validateUrl("  https://twitter.com  ");

      expect(result.isValid).toBe(true);
      expect(result.normalizedUrl).toBe("https://twitter.com/");
    });
  });

  describe("Invalid Protocol", () => {
    it("should reject HTTP URLs", () => {
      const result = validateUrl("http://google.com");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Protocol must be HTTPS");
      expect(result.normalizedUrl).toBe("");
    });

    it("should reject FTP URLs", () => {
      const result = validateUrl("ftp://files.example.com");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Protocol must be HTTPS");
    });

    it("should reject other protocols", () => {
      const result = validateUrl("file://local/path");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Protocol must be HTTPS");
    });
  });

  describe("Invalid Hostnames", () => {
    it("should reject URLs with invalid hostname", () => {
      const result = validateUrl("https://invalid_domain.com");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("The domain name is not valid");
    });

    it("should reject localhost", () => {
      const result = validateUrl("https://localhost");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Local or example URLs are not allowed");
    });

    it("should reject 127.0.0.1", () => {
      const result = validateUrl("https://127.0.0.1");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Local or example URLs are not allowed");
    });

    it("should reject example.com", () => {
      const result = validateUrl("https://example.com");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Local or example URLs are not allowed");
    });

    it("should reject test.com", () => {
      const result = validateUrl("https://test.com");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Local or example URLs are not allowed");
    });

    it("should reject .local domains", () => {
      const result = validateUrl("https://mysite.local");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Local or example URLs are not allowed");
    });
  });

  describe("Invalid Ports", () => {
    it("should reject non-HTTPS ports", () => {
      const result = validateUrl("https://github.com:8080");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Non-secure ports are not allowed");
    });

    it("should reject custom ports", () => {
      const result = validateUrl("https://stackoverflow.com:3000");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Non-secure ports are not allowed");
    });

    it("should accept default HTTPS port (443)", () => {
      const result = validateUrl("https://google.com:443");

      expect(result.isValid).toBe(true);
      expect(result.normalizedUrl).toBe("https://google.com/");
    });
  });

  describe("Private IP Addresses", () => {
    it("should reject private IPv4 addresses", () => {
      const privateIPs = [
        "https://10.0.0.1",
        "https://172.16.0.1",
        "https://192.168.1.1",
        "https://169.254.1.1",
      ];

      privateIPs.forEach((url) => {
        const result = validateUrl(url);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Private IP addresses are not allowed");
      });
    });
  });

  describe("Invalid Input", () => {
    it("should reject empty string", () => {
      const result = validateUrl("");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("URL cannot be empty");
      expect(result.normalizedUrl).toBe("");
    });

    it("should reject null values", () => {
      const result = validateUrl(null as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("URL cannot be empty");
    });

    it("should reject undefined values", () => {
      const result = validateUrl(undefined as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("URL cannot be empty");
    });

    it("should reject non-string values", () => {
      const result = validateUrl(123 as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("URL cannot be empty");
    });

    it("should reject whitespace-only strings", () => {
      const result = validateUrl("   ");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("URL cannot be empty");
    });
  });

  describe("Malformed URLs", () => {
    it("should reject invalid URL structure", () => {
      const result = validateUrl("not-a-url");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("The URL structure is not valid");
    });

    it("should reject URLs without hostname", () => {
      const result = validateUrl("https://");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("The URL structure is not valid");
    });

    it("should reject malformed protocols", () => {
      const result = validateUrl("ht://malformed.com");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Protocol must be HTTPS");
    });
  });

  describe("Edge Cases", () => {
    it("should handle international domain names", () => {
      const result = validateUrl("https://münchen.de");

      expect(result.isValid).toBe(true);
      expect(result.normalizedUrl).toContain("xn--");
    });

    it("should handle very long URLs", () => {
      const longPath = "/very".repeat(100);
      const result = validateUrl(`https://github.com${longPath}`);

      expect(result.isValid).toBe(true);
    });

    it("should handle URLs with fragments", () => {
      const result = validateUrl("https://developer.mozilla.org/docs#section");

      expect(result.isValid).toBe(true);
      expect(result.normalizedUrl).toBe(
        "https://developer.mozilla.org/docs#section",
      );
    });
  });
});
