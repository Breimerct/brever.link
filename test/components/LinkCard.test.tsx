import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "../utils";
import LinkCard from "../../src/components/link-card/LinkCard";
import type { Link } from "@/types/link.type";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("navigator.clipboard", () => ({
  writeText: vi.fn(),
}));

import * as sonner from "sonner";

const mockLink: Link = {
  id: "1",
  slug: "test-slug",
  url: "https://google.com",
  shortLink: "https://brever.link/test-slug",
  qrCode: "data:image/png;base64,test",
  clickCount: 42,
  createdAt: new Date("2024-01-01T00:00:00Z"),
};

const mockLinkWithoutQr: Link = {
  ...mockLink,
  qrCode: null,
};

describe("LinkCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<LinkCard link={mockLink} />);
      expect(screen.getByTestId("domain-name")).toBeInTheDocument();
    });

    it("should render all link information correctly", () => {
      render(<LinkCard link={mockLink} />);

      expect(screen.getByTestId("domain-name")).toHaveTextContent("google.com");
      expect(screen.getByTestId("click-stats")).toHaveTextContent("42");
      expect(screen.getByTestId("click-stats")).toHaveTextContent("clicks");
      expect(screen.getByTestId("creation-date")).toBeInTheDocument();
    });

    it("should render QR code when available", () => {
      render(<LinkCard link={mockLink} />);

      const qrImage = screen.getByTestId("qr-code-image");
      expect(qrImage).toBeInTheDocument();
      expect(qrImage).toHaveAttribute("src", "data:image/png;base64,test");
    });

    it("should not render QR code section when qrCode is null", () => {
      render(<LinkCard link={mockLinkWithoutQr} />);

      expect(screen.queryByTestId("qr-code-image")).not.toBeInTheDocument();
    });

    it("should render copy button", () => {
      render(<LinkCard link={mockLink} />);

      const copyButton = screen.getByTestId(`copy-button-${mockLink.slug}`);
      expect(copyButton).toBeInTheDocument();
      expect(copyButton).toHaveAttribute("aria-label", "Copy short link");
    });

    it("should render short link with proper attributes", () => {
      render(<LinkCard link={mockLink} />);

      const shortLink = screen.getByTestId("short-link");
      expect(shortLink).toHaveAttribute("href", mockLink.shortLink);
      expect(shortLink).toHaveAttribute("target", "_blank");
      expect(shortLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render with custom className", () => {
      const customClass = "custom-test-class";
      const { container } = render(
        <LinkCard link={mockLink} className={customClass} />,
      );

      const linkCard = container.querySelector("li");
      expect(linkCard).toHaveClass(customClass);
    });

    it("should render with custom props", () => {
      render(<LinkCard link={mockLink} data-testid="custom-link-card" />);

      expect(screen.getByTestId("custom-link-card")).toBeInTheDocument();
    });

    it("should render download QR button when QR code is available", () => {
      render(<LinkCard link={mockLink} />);

      const downloadButton = screen.getByTestId(`download-qr-${mockLink.slug}`);
      expect(downloadButton).toBeInTheDocument();
      expect(downloadButton).toHaveAttribute(
        "aria-label",
        `Download QR code for ${mockLink.slug}`,
      );
    });

    it("should render proper time element with ISO date", () => {
      render(<LinkCard link={mockLink} />);

      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveAttribute(
        "dateTime",
        "2024-01-01T00:00:00.000Z",
      );
    });
  });

  describe("Copy Functionality", () => {
    it("should call copy to clipboard when copy button is clicked", () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(<LinkCard link={mockLink} />);

      const copyButton = screen.getByTestId(`copy-button-${mockLink.slug}`);
      fireEvent.click(copyButton);

      expect(writeTextMock).toHaveBeenCalledWith(mockLink.shortLink);
    });

    it("should show success toast when copy succeeds", async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(<LinkCard link={mockLink} />);

      const copyButton = screen.getByTestId(`copy-button-${mockLink.slug}`);
      fireEvent.click(copyButton);

      await vi.waitFor(() => {
        expect(sonner.toast.success).toHaveBeenCalledWith(
          "Link copied to clipboard!",
          {
            description: "You can now paste it anywhere.",
          },
        );
      });
    });

    it("should show error toast and log error when copy fails", async () => {
      const copyError = new Error("Copy failed");
      const writeTextMock = vi.fn().mockRejectedValue(copyError);

      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(<LinkCard link={mockLink} />);

      const copyButton = screen.getByTestId(`copy-button-${mockLink.slug}`);
      fireEvent.click(copyButton);

      await vi.waitFor(() => {
        expect(sonner.toast.error).toHaveBeenCalledWith(
          "Failed to copy link!",
          {
            description: "Please try again.",
          },
        );
      });
    });
  });

  describe("QR Code Download Functionality", () => {
    it("should call download functionality when download button is clicked", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<LinkCard link={mockLink} />);

      const downloadButton = screen.getByTestId(`download-qr-${mockLink.slug}`);

      expect(() => {
        fireEvent.click(downloadButton);
      }).not.toThrow();
      consoleSpy.mockRestore();
    });

    it("should handle missing qrCode gracefully", () => {
      const linkWithoutQr = { ...mockLink, qrCode: null };
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<LinkCard link={linkWithoutQr} />);

      expect(
        screen.queryByTestId(`download-qr-${mockLink.slug}`),
      ).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should show error toast when QR download fails", () => {
      render(<LinkCard link={mockLink} />);

      const mockElement = {
        href: "",
        download: "",
        click: vi.fn(),
      };

      vi.spyOn(document, "createElement").mockReturnValue(
        mockElement as unknown as HTMLElement,
      );

      vi.spyOn(document.body, "appendChild").mockImplementation(() => {
        throw new Error("DOM manipulation failed");
      });

      const downloadButton = screen.getByTestId(`download-qr-${mockLink.slug}`);
      fireEvent.click(downloadButton);

      expect(sonner.toast.error).toHaveBeenCalledWith(
        "Failed to download QR code!",
        {
          description: "Please try again.",
        },
      );

      vi.mocked(document.createElement).mockRestore();
      vi.mocked(document.body.appendChild).mockRestore();
    });

    it("should handle dynamic qrCode changes during download", () => {
      const linkWithQr = { ...mockLink, qrCode: "data:image/png;base64,test" };
      const { rerender } = render(<LinkCard link={linkWithQr} />);

      expect(
        screen.getByTestId(`download-qr-${linkWithQr.slug}`),
      ).toBeInTheDocument();

      rerender(<LinkCard link={{ ...linkWithQr, qrCode: null }} />);

      expect(
        screen.queryByTestId(`download-qr-${linkWithQr.slug}`),
      ).not.toBeInTheDocument();
    });

    it("should handle qrCode becoming null during function execution", () => {
      const linkWithQr = { ...mockLink, qrCode: "data:image/png;base64,test" };
      render(<LinkCard link={linkWithQr} />);

      const downloadButton = screen.getByTestId(
        `download-qr-${linkWithQr.slug}`,
      );

      const createElementSpy = vi.spyOn(document, "createElement");

      Object.defineProperty(linkWithQr, "qrCode", {
        value: null,
        writable: true,
        configurable: true,
      });

      fireEvent.click(downloadButton);
      expect(createElementSpy).not.toHaveBeenCalled();

      createElementSpy.mockRestore();
    });
  });

  describe("Interactions", () => {
    it("should have proper QR alt text", () => {
      render(<LinkCard link={mockLink} />);

      const qrImage = screen.getByTestId("qr-code-image");
      expect(qrImage).toHaveAttribute(
        "alt",
        "QR code for https://brever.link/test-slug",
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero click count", () => {
      const linkWithZeroClicks = { ...mockLink, clickCount: 0 };
      render(<LinkCard link={linkWithZeroClicks} />);

      expect(screen.getByTestId("click-stats")).toHaveTextContent("0 clicks");
    });

    it("should handle very high click count", () => {
      const linkWithHighClicks = { ...mockLink, clickCount: 1000000 };
      render(<LinkCard link={linkWithHighClicks} />);
      expect(screen.getByTestId("click-stats")).toHaveTextContent(
        "1000000 clicks",
      );
    });

    it("should handle long URLs gracefully", () => {
      const linkWithLongUrl = {
        ...mockLink,
        url: "https://github.com/very/long/path/that/continues/for/a/while",
      };
      render(<LinkCard link={linkWithLongUrl} />);

      expect(screen.getByTestId("domain-name")).toBeInTheDocument();
    });

    it("should handle undefined qrCode gracefully", () => {
      const linkWithUndefinedQr = { ...mockLink, qrCode: undefined };
      render(<LinkCard link={linkWithUndefinedQr} />);

      expect(screen.queryByTestId("qr-code-container")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<LinkCard link={mockLink} />);

      const copyButton = screen.getByTestId(`copy-button-${mockLink.slug}`);
      expect(copyButton).toHaveAttribute("aria-label", "Copy short link");

      const shortLink = screen.getByTestId("short-link");
      expect(shortLink).toHaveAttribute(
        "aria-label",
        `Short link: ${mockLink.shortLink}`,
      );

      const clickStats = screen.getByTestId("click-stats");
      expect(clickStats).toHaveAttribute("aria-label", "Click statistics");
    });

    it("should have proper button types", () => {
      render(<LinkCard link={mockLink} />);

      const copyButton = screen.getByTestId(`copy-button-${mockLink.slug}`);
      expect(copyButton).toHaveAttribute("type", "button");

      const downloadButton = screen.getByTestId(`download-qr-${mockLink.slug}`);
      expect(downloadButton).toHaveAttribute("type", "button");
    });
  });
});
