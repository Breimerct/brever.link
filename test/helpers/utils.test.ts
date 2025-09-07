import { describe, it, expect } from "vitest";
import { cn, getDomain, formatDate } from "../../src/helpers/utils";

describe("Utils - cn function", () => {
  it("combines string classes", () => {
    expect(cn("class1", "class2", "class3")).toBe("class1 class2 class3");
  });

  it("filters out falsy values", () => {
    expect(cn("class1", null, undefined, false, "", "class2")).toBe(
      "class1 class2",
    );
  });

  it("handles object with conditional classes", () => {
    expect(
      cn({
        active: true,
        disabled: false,
        visible: true,
      }),
    ).toBe("active visible");
  });

  it("handles mixed inputs", () => {
    expect(
      cn("base-class", { conditional: true, hidden: false }, "another-class"),
    ).toBe("base-class conditional another-class");
  });

  it("handles arrays", () => {
    expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
  });

  it("handles nested arrays", () => {
    expect(cn(["class1", ["class2", "class3"]], "class4")).toBe(
      "class1 class2,class3 class4",
    );
  });

  it("returns empty string for no valid inputs", () => {
    expect(cn(null, undefined, false, "")).toBe("");
  });

  it("handles numbers", () => {
    expect(cn("class1", 0, 1, "class2")).toBe("class1 class2");
  });
});

describe("Utils - getDomain function", () => {
  it("extracts domain from valid URL", () => {
    expect(getDomain("https://brever.link")).toBe("brever.link");
  });

  it("removes www prefix", () => {
    expect(getDomain("https://www.breimer.dev")).toBe("breimer.dev");
  });

  it("handles URLs with paths and query parameters", () => {
    expect(getDomain("https://www.breimer.dev/path?query=1#fragment")).toBe(
      "breimer.dev",
    );
  });

  it("handles subdomains", () => {
    expect(getDomain("https://api.breimer.dev")).toBe("api.breimer.dev");
    expect(getDomain("https://www.api.breimer.dev")).toBe("api.breimer.dev");
  });

  it("handles different protocols", () => {
    expect(getDomain("http://breimer.dev")).toBe("invalid url");
    expect(getDomain("ftp://breimer.dev")).toBe("invalid url");
  });

  it("handles ports", () => {
    expect(getDomain("https://breimer.dev:8080")).toBe("invalid url");
    expect(getDomain("https://www.breimer.dev:3000")).toBe("invalid url");
  });

  it("handles invalid URLs", () => {
    expect(getDomain("not-a-url")).toBe("invalid url");
    expect(getDomain("invalid://url")).toBe("invalid url");
    expect(getDomain("")).toBe("invalid url");
  });
});

describe("Utils - formatDate function", () => {
  it("formats Date object correctly", () => {
    const date = new Date("2024-01-15T14:30:00Z");
    const formatted = formatDate(date);

    expect(formatted).toMatch(/15 Jan - 2024, \d{2}:\d{2} [AP]M/);
  });

  it("formats date string correctly", () => {
    const dateString = "2024-12-25T09:15:00Z";
    const formatted = formatDate(dateString);

    expect(formatted).toMatch(/25 Dec - 2024, \d{2}:\d{2} [AP]M/);
  });

  it("handles different date formats", () => {
    const isoString = "2024-06-30T18:45:30.123Z";
    const formatted = formatDate(isoString);

    expect(formatted).toMatch(/30 Jun - 2024, \d{2}:\d{2} [AP]M/);
  });

  //   TODO: Fix this test
  //   it("handles edge case dates", () => {
  //     const newYear = formatDate("2024-01-01T00:00:00Z");
  //     const newYearEve = formatDate("2023-12-31T23:59:59Z");

  //     expect(newYear).toContain(/01 Jan - 2024/);
  //     expect(newYearEve).toContain(/31 Dec - 2023/);
  //   });
});
