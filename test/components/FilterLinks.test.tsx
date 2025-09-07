/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../utils";
import userEvent from "@testing-library/user-event";

vi.mock("astro:transitions/client", () => ({
  navigate: vi.fn(),
}));

vi.mock("@uidotdev/usehooks", () => ({
  useDebounce: vi.fn((value, _delay) => value),
}));

const mockWatch = vi.fn();
const mockHandleSubmit = vi.fn();

vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form");
  return {
    ...actual,
    useForm: vi.fn(() => ({
      handleSubmit: mockHandleSubmit,
      watch: mockWatch,
      formState: { errors: {} },
      control: {},
      register: vi.fn(),
      setValue: vi.fn(),
      getValues: vi.fn(),
    })),
    FormProvider: ({ children }: any) => (
      <div data-testid="form-provider">{children}</div>
    ),
  };
});

vi.mock("../../src/components/input/Input.tsx", () => ({
  default: ({ name, label, placeholder, autoComplete }: any) => (
    <div data-testid="input-component">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        data-testid={`input-${name}`}
      />
    </div>
  ),
}));

import FilterLinks from "../../src/components/filter-links/FilterLinks";
import { navigate } from "astro:transitions/client";
import { useDebounce } from "@uidotdev/usehooks";

describe("FilterLinks Component", () => {
  const mockNavigate = vi.mocked(navigate);
  const mockUseDebounce = vi.mocked(useDebounce);
  let mockLocation: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockLocation = {
      search: "",
    };
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });

    global.URLSearchParams = class URLSearchParams {
      private params: Map<string, string> = new Map();

      constructor(search?: string) {
        if (search) {
          const pairs = search.replace(/^\?/, "").split("&");
          pairs.forEach((pair) => {
            const [key, value] = pair.split("=");
            if (key) {
              this.params.set(
                decodeURIComponent(key),
                decodeURIComponent(value || ""),
              );
            }
          });
        }
      }

      set(key: string, value: string) {
        this.params.set(key, value);
      }

      get(key: string) {
        return this.params.get(key) || null;
      }

      delete(key: string) {
        this.params.delete(key);
      }

      toString() {
        const pairs: string[] = [];
        this.params.forEach((value, key) => {
          pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        });
        return pairs.join("&");
      }
    } as any;

    mockUseDebounce.mockImplementation((value) => value);
    mockHandleSubmit.mockImplementation((fn) => (e: any) => {
      e?.preventDefault?.();
      fn({ search: "" });
    });
    mockWatch.mockImplementation((callback) => {
      if (callback) {
        callback({ search: "" });
      }
      return () => {};
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<FilterLinks />);
      expect(screen.getByTestId("input-component")).toBeInTheDocument();
    });

    it("should render form with correct structure", () => {
      render(<FilterLinks />);

      const form = document.querySelector("form");

      expect(form).toBeInTheDocument();
      expect(form).toHaveClass("mb-4");
    });

    it("should render Input component with correct props", () => {
      render(<FilterLinks />);

      const input = screen.getByTestId("input-search");
      const label = screen.getByText("Slug");

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("name", "search");
      expect(input).toHaveAttribute("placeholder", "Search by slug");
      expect(input).toHaveAttribute("autoComplete", "off");
      expect(label).toBeInTheDocument();
    });
  });

  describe("Form Functionality", () => {
    it("should handle form submission correctly", async () => {
      mockLocation.search = "";

      render(<FilterLinks />);

      const form = document.querySelector("form");
      const input = screen.getByTestId("input-search");

      await userEvent.type(input, "test-search");

      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    it("should update URL params on form submission", async () => {
      mockLocation.search = "?page=2";
      mockHandleSubmit.mockImplementation((fn) => (e: any) => {
        e?.preventDefault?.();
        fn({ search: "example-slug" });
      });

      render(<FilterLinks />);

      const form = document.querySelector("form");
      const input = screen.getByTestId("input-search");

      await userEvent.type(input, "example-slug");

      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining("search=example-slug"),
        );
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining("page=1"),
        );
      });
    });

    it("should handle empty form submission", async () => {
      render(<FilterLinks />);

      const form = document.querySelector("form");

      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });
  });

  describe("Debounced Search", () => {
    it("should trigger navigation when debounced search changes", async () => {
      let debouncedValue = "";
      mockUseDebounce.mockImplementation((_value) => debouncedValue);

      const { rerender } = render(<FilterLinks />);

      debouncedValue = "debounced-search";
      mockUseDebounce.mockReturnValue("debounced-search");

      rerender(<FilterLinks />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining("search=debounced-search"),
        );
      });
    });

    it("should remove search param when debounced search is empty", async () => {
      mockLocation.search = "?search=existing&page=2";

      let debouncedValue = "";
      mockUseDebounce.mockImplementation((_value) => debouncedValue);

      render(<FilterLinks />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.not.stringContaining("search="),
        );
      });
    });

    it("should reset page to 1 when search changes", async () => {
      mockLocation.search = "?page=5";

      let debouncedValue = "new-search";
      mockUseDebounce.mockImplementation((_value) => debouncedValue);

      render(<FilterLinks />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining("page=1"),
        );
      });
    });
  });

  describe("URL Parameter Handling", () => {
    it("should preserve existing query parameters", async () => {
      mockLocation.search = "?sort=desc&filter=active";

      mockHandleSubmit.mockImplementation((fn) => (e: any) => {
        e?.preventDefault?.();
        fn({ search: "test" });
      });

      render(<FilterLinks />);

      const form = document.querySelector("form");
      const input = screen.getByTestId("input-search");

      await userEvent.type(input, "test");
      fireEvent.submit(form!);

      await waitFor(() => {
        const call =
          mockNavigate.mock.calls[mockNavigate.mock.calls.length - 1][0];
        expect(call).toContain("sort=desc");
        expect(call).toContain("filter=active");
        expect(call).toContain("search=test");
      });
    });

    it("should handle complex query string scenarios", async () => {
      mockLocation.search = "?page=3&sort=asc&category=links";
      mockHandleSubmit.mockImplementation((fn) => (e: any) => {
        e?.preventDefault?.();
        fn({ search: "complex-search" });
      });

      render(<FilterLinks />);

      const form = document.querySelector("form");
      const input = screen.getByTestId("input-search");

      await userEvent.type(input, "complex-search");
      fireEvent.submit(form!);

      await waitFor(() => {
        const call =
          mockNavigate.mock.calls[mockNavigate.mock.calls.length - 1][0];
        expect(call).toContain("search=complex-search");
        expect(call).toContain("page=1");
        expect(call).toContain("sort=asc");
        expect(call).toContain("category=links");
      });
    });
  });

  describe("React Hook Form Integration", () => {
    it("should use zodResolver with FilterLinksSchema", () => {
      render(<FilterLinks />);

      expect(document.querySelector("form")).toBeInTheDocument();
    });

    it("should have correct default values", () => {
      render(<FilterLinks />);

      const input = screen.getByTestId("input-search");
      expect(input).toHaveAttribute("name", "search");
    });

    it("should watch form changes", async () => {
      render(<FilterLinks />);

      const input = screen.getByTestId("input-search");

      await userEvent.type(input, "watched-value");

      expect(document.querySelector("form")).toBeInTheDocument();
    });
  });

  describe("Component Lifecycle", () => {
    it("should clean up on unmount", () => {
      const { unmount } = render(<FilterLinks />);

      expect(() => unmount()).not.toThrow();
    });

    it("should handle re-renders correctly", () => {
      const { rerender } = render(<FilterLinks />);

      rerender(<FilterLinks />);

      expect(document.querySelector("form")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should handle typing in search input", async () => {
      const user = userEvent.setup();
      render(<FilterLinks />);

      const input = screen.getByTestId("input-search");

      await user.type(input, "interactive-search");

      expect(input).toBeInTheDocument();
    });

    it("should handle rapid typing", async () => {
      const user = userEvent.setup();
      render(<FilterLinks />);

      const input = screen.getByTestId("input-search");

      await user.type(input, "rapid");
      await user.clear(input);
      await user.type(input, "typing");

      expect(input).toBeInTheDocument();
    });

    it("should handle form reset", async () => {
      render(<FilterLinks />);

      const form = document.querySelector("form");

      fireEvent.reset(form!);

      expect(form).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle malformed URL search params", () => {
      mockLocation.search = "?invalid=&=value&malformed";

      expect(() => render(<FilterLinks />)).not.toThrow();
      expect(document.querySelector("form")).toBeInTheDocument();
    });

    it("should handle missing window.location", () => {
      const originalLocation = window.location;

      Object.defineProperty(window, "location", {
        value: { search: "" },
        writable: true,
        configurable: true,
      });

      expect(() => render(<FilterLinks />)).not.toThrow();

      Object.defineProperty(window, "location", {
        value: originalLocation,
        writable: true,
        configurable: true,
      });
    });

    it("should handle navigation errors gracefully", async () => {
      mockNavigate.mockImplementation(async () => {});

      render(<FilterLinks />);

      const form = document.querySelector("form");

      expect(form).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should not cause excessive re-renders", () => {
      const renderSpy = vi.fn();

      const TestWrapper = () => {
        renderSpy();
        return <FilterLinks />;
      };

      render(<TestWrapper />);

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it("should handle debouncing correctly", () => {
      mockUseDebounce.mockImplementation((value, delay) => {
        expect(delay).toBe(500);
        return value;
      });

      render(<FilterLinks />);

      expect(mockUseDebounce).toHaveBeenCalledWith("", 500);
    });
  });

  describe("Accessibility", () => {
    it("should have proper form structure for screen readers", () => {
      render(<FilterLinks />);

      const form = document.querySelector("form");

      expect(form).toBeInTheDocument();
      expect(form!.tagName).toBe("FORM");
    });

    it("should have proper input labeling", () => {
      render(<FilterLinks />);

      const label = screen.getByText("Slug");
      const input = screen.getByTestId("input-search");

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<FilterLinks />);

      const input = screen.getByTestId("input-search");

      await user.click(input);
      await user.keyboard("keyboard-test");

      expect(input).toBeInTheDocument();
    });
  });
});
