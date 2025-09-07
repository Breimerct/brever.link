import { describe, expect, it } from "vitest";
import { FilterLinksSchema } from "../../src/schemas/filter-links.schema";

describe("FilterLinksSchema", () => {
  it("should validate empty object with default search value", () => {
    const result = FilterLinksSchema.parse({});

    expect(result).toEqual({
      search: "",
    });
  });

  it("should validate object with search string", () => {
    const input = {
      search: "test search",
    };

    const result = FilterLinksSchema.parse(input);

    expect(result).toEqual({
      search: "test search",
    });
  });

  it("should validate object with empty search string", () => {
    const input = {
      search: "",
    };

    const result = FilterLinksSchema.parse(input);

    expect(result).toEqual({
      search: "",
    });
  });

  it("should validate object with undefined search", () => {
    const input = {
      search: undefined,
    };

    const result = FilterLinksSchema.parse(input);

    expect(result).toEqual({
      search: "",
    });
  });

  it("should validate object with additional properties (should be ignored)", () => {
    const input = {
      search: "test",
      extraProperty: "should be ignored",
    };

    const result = FilterLinksSchema.parse(input);

    expect(result).toEqual({
      search: "test",
    });
  });

  it("should throw error for null search", () => {
    const input = {
      search: null,
    };

    expect(() => FilterLinksSchema.parse(input)).toThrow();
  });

  it("should handle non-string search values", () => {
    const input = {
      search: 123,
    };

    // Should throw validation error for non-string values
    expect(() => FilterLinksSchema.parse(input)).toThrow();
  });
});
