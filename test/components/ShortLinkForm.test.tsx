/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "../utils";
import userEvent from "@testing-library/user-event";

import ShortLinkForm from "../../src/components/short-link-form/ShortLinkForm";

// Mock de las dependencias
vi.mock("astro:actions", () => ({
  actions: {
    shortenAction: {
      shortenLink: vi.fn(),
    },
  },
}));

vi.mock("astro/virtual-modules/transitions-router.js", () => ({
  navigate: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Importar los mocks después de declararlos
import { actions } from "astro:actions";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { toast } from "sonner";

describe("ShortLinkForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<ShortLinkForm />);

      expect(screen.getByTestId("short-link-form")).toBeInTheDocument();
      expect(screen.getByTestId("url-input")).toBeInTheDocument();
      expect(screen.getByTestId("slug-input")).toBeInTheDocument();
      expect(screen.getByTestId("randomize-slug-button")).toBeInTheDocument();
      expect(screen.getByTestId("short-link-form-submit")).toBeInTheDocument();
    });

    it("should render form elements with correct attributes", () => {
      render(<ShortLinkForm />);

      const form = screen.getByTestId("short-link-form");
      const urlInput = screen.getByTestId("url-input");
      const slugInput = screen.getByTestId("slug-input");
      const randomizeButton = screen.getByTestId("randomize-slug-button");
      const submitButton = screen.getByTestId("short-link-form-submit");

      expect(form).toHaveAttribute("aria-label", "URL shortener form");

      expect(urlInput).toHaveAttribute("type", "url");
      expect(urlInput).toHaveAttribute("placeholder", "https://example.com");
      expect(urlInput).toHaveAttribute("aria-required", "true");
      expect(urlInput).toHaveAttribute("autocomplete", "off");

      expect(slugInput).toHaveAttribute("type", "text");
      expect(slugInput).toHaveAttribute("placeholder", "example");
      expect(slugInput).toHaveAttribute("autocomplete", "off");

      expect(randomizeButton).toHaveAttribute("type", "button");
      expect(randomizeButton).toHaveAttribute(
        "aria-label",
        "Generate random slug",
      );
      expect(submitButton).toHaveAttribute("type", "submit");
    });
  });

  describe("User Interactions", () => {
    it("should allow typing in URL input", async () => {
      render(<ShortLinkForm />);

      const urlInput = screen.getByTestId("url-input");

      await user.type(urlInput, "https://example.com");

      expect(urlInput).toHaveValue("https://example.com");
    });

    it("should allow typing in slug input", async () => {
      render(<ShortLinkForm />);

      const slugInput = screen.getByTestId("slug-input");

      await user.type(slugInput, "my-slug");

      expect(slugInput).toHaveValue("my-slug");
    });

    it("should generate random slug when randomize button is clicked", async () => {
      render(<ShortLinkForm />);

      const slugInput = screen.getByTestId("slug-input") as HTMLInputElement;
      const randomizeButton = screen.getByTestId("randomize-slug-button");

      await user.click(randomizeButton);

      expect(slugInput).not.toHaveValue("");
      expect(slugInput.value).toMatch(/^[a-z0-9]{6}$/);
    });

    it("should generate different slugs on multiple randomize clicks", async () => {
      render(<ShortLinkForm />);

      const slugInput = screen.getByTestId("slug-input") as HTMLInputElement;
      const randomizeButton = screen.getByTestId("randomize-slug-button");

      await user.click(randomizeButton);
      const firstSlug = slugInput.value;

      await user.click(randomizeButton);
      const secondSlug = slugInput.value;

      expect(firstSlug).not.toBe(secondSlug);
    });
  });

  describe("Form Submission", () => {
    it("should submit form with valid data successfully", async () => {
      const mockResponse = {
        data: { id: "123", shortLink: "https://brever.link/abc123" },
      };
      (actions.shortenAction.shortenLink as any).mockResolvedValue(
        mockResponse,
      );

      render(<ShortLinkForm />);

      const urlInput = screen.getByTestId("url-input");
      const slugInput = screen.getByTestId("slug-input");
      const submitButton = screen.getByTestId("short-link-form-submit");

      await user.type(urlInput, "https://example.com");
      await user.type(slugInput, "test-slug");
      await user.click(submitButton);

      await waitFor(() => {
        expect(actions.shortenAction.shortenLink).toHaveBeenCalledWith({
          url: "https://example.com",
          slug: "test-slug",
        });
      });

      expect(navigate).toHaveBeenCalledWith("/", { history: "push" });
    });

    it("should handle form submission error", async () => {
      const mockErrorResponse = {
        error: {
          message: "Slug already exists",
        },
      };
      (actions.shortenAction.shortenLink as any).mockResolvedValue(
        mockErrorResponse,
      );

      render(<ShortLinkForm />);

      const urlInput = screen.getByTestId("url-input");
      const slugInput = screen.getByTestId("slug-input");
      const submitButton = screen.getByTestId("short-link-form-submit");

      await user.type(urlInput, "https://example.com");
      await user.type(slugInput, "existing-slug");
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Slug already exists", {
          description: "Please check the data and try again.",
        });
      });

      expect(navigate).not.toHaveBeenCalled();
    });

    it("should reset form after successful submission", async () => {
      const mockResponse = {
        data: { id: "123", shortLink: "https://brever.link/abc123" },
      };
      (actions.shortenAction.shortenLink as any).mockResolvedValue(
        mockResponse,
      );

      render(<ShortLinkForm />);

      const urlInput = screen.getByTestId("url-input");
      const slugInput = screen.getByTestId("slug-input");
      const submitButton = screen.getByTestId("short-link-form-submit");

      await user.type(urlInput, "https://example.com");
      await user.type(slugInput, "test-slug");
      await user.click(submitButton);

      await waitFor(() => {
        expect(urlInput).toHaveValue("");
        expect(slugInput).toHaveValue("");
      });
    });
  });

  describe("Form Validation", () => {
    it("should show validation error for empty URL", async () => {
      render(<ShortLinkForm />);

      const slugInput = screen.getByTestId("slug-input");
      const submitButton = screen.getByTestId("short-link-form-submit");

      await user.type(slugInput, "test-slug");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("URL is required")).toBeInTheDocument();
      });
    });

    it("should show validation error for invalid URL", async () => {
      render(<ShortLinkForm />);

      const urlInput = screen.getByTestId("url-input");
      const slugInput = screen.getByTestId("slug-input");

      await user.type(urlInput, "invalid-url");
      await user.type(slugInput, "test-slug");
      await user.tab(); // Trigger validation

      await waitFor(() => {
        expect(screen.getByText("Invalid URL")).toBeInTheDocument();
      });
    });

    it("should show validation error for empty slug", async () => {
      render(<ShortLinkForm />);

      const urlInput = screen.getByTestId("url-input");
      const submitButton = screen.getByTestId("short-link-form-submit");

      await user.type(urlInput, "https://example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Slug is required")).toBeInTheDocument();
      });
    });

    it("should clear validation errors when valid data is entered", async () => {
      render(<ShortLinkForm />);

      const urlInput = screen.getByTestId("url-input");
      const slugInput = screen.getByTestId("slug-input");

      // Enter invalid data first
      await user.type(urlInput, "invalid-url");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid URL")).toBeInTheDocument();
      });

      // Clear and enter valid data
      await user.clear(urlInput);
      await user.type(urlInput, "https://example.com");
      await user.type(slugInput, "test-slug");

      await waitFor(() => {
        expect(screen.queryByText("Invalid URL")).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper form structure", () => {
      render(<ShortLinkForm />);

      const form = screen.getByTestId("short-link-form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("aria-label", "URL shortener form");
    });

    it("should have proper labels and ARIA attributes for inputs", () => {
      render(<ShortLinkForm />);

      const urlInput = screen.getByTestId("url-input");
      const slugInput = screen.getByTestId("slug-input");
      const randomizeButton = screen.getByTestId("randomize-slug-button");

      expect(urlInput).toHaveAccessibleName("URL");
      expect(urlInput).toHaveAttribute("aria-required", "true");

      expect(slugInput).toHaveAccessibleName("Slug");

      expect(randomizeButton).toHaveAttribute(
        "aria-label",
        "Generate random slug",
      );
    });

    it("should have proper fieldset structure", () => {
      render(<ShortLinkForm />);

      const fieldsets = screen.getAllByRole("group");
      expect(fieldsets).toHaveLength(2);

      // Check for screen reader only legends
      expect(document.querySelector("legend")).toBeInTheDocument();
    });

    it("should be keyboard accessible", async () => {
      render(<ShortLinkForm />);

      const urlInput = screen.getByTestId("url-input");
      const slugInput = screen.getByTestId("slug-input");
      const randomizeButton = screen.getByTestId("randomize-slug-button");
      const submitButton = screen.getByTestId("short-link-form-submit");

      // Test tab navigation
      await user.tab();
      expect(urlInput).toHaveFocus();

      await user.tab();
      expect(slugInput).toHaveFocus();

      await user.tab();
      expect(randomizeButton).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });

    it("should handle Enter key on randomize button", async () => {
      render(<ShortLinkForm />);

      const slugInput = screen.getByTestId("slug-input") as HTMLInputElement;
      const randomizeButton = screen.getByTestId("randomize-slug-button");

      randomizeButton.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(slugInput.value).toMatch(/^[a-z0-9]{6}$/);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle network errors during submission", async () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const mockError = { error: { message: "Network error occurred" } };
      (actions.shortenAction.shortenLink as any).mockResolvedValue(mockError);

      render(<ShortLinkForm />);

      const urlInput = screen.getByTestId("url-input");
      const slugInput = screen.getByTestId("slug-input");
      const submitButton = screen.getByTestId("short-link-form-submit");

      await user.type(urlInput, "https://example.com");
      await user.type(slugInput, "test-slug");
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Network error occurred", {
          description: "Please check the data and try again.",
        });
      });

      // Should not crash the app and should not navigate
      expect(screen.getByTestId("short-link-form-submit")).toBeInTheDocument();
      expect(navigate).not.toHaveBeenCalled();

      consoleError.mockRestore();
    });

    it("should handle multiple rapid randomize clicks", async () => {
      render(<ShortLinkForm />);

      const slugInput = screen.getByTestId("slug-input") as HTMLInputElement;
      const randomizeButton = screen.getByTestId("randomize-slug-button");

      // Click multiple times rapidly
      await user.click(randomizeButton);
      await user.click(randomizeButton);
      await user.click(randomizeButton);

      expect(slugInput.value).toMatch(/^[a-z0-9]{6}$/);
    });

    it("should maintain slug value after validation error", async () => {
      render(<ShortLinkForm />);

      const slugInput = screen.getByTestId("slug-input");
      const submitButton = screen.getByTestId("short-link-form-submit");

      await user.type(slugInput, "my-slug");
      await user.click(submitButton); // This should trigger URL validation error

      await waitFor(() => {
        expect(screen.getByText("URL is required")).toBeInTheDocument();
      });

      expect(slugInput).toHaveValue("my-slug");
    });
  });
});
