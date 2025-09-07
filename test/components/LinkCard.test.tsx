import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "../utils";
import LinkCard from "../../src/components/link-card/LinkCard";
import type { Link } from "@/types/link.type";

// Mocks simples
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

// Mock data simplificado
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
    // Ensure all global mocks are cleaned up after each test
    vi.unstubAllGlobals();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<LinkCard link={mockLink} />);
      expect(screen.getByTestId("domain-name")).toBeInTheDocument();
    });

    it("should render all link information correctly", () => {
      render(<LinkCard link={mockLink} />);

      // Domain
      expect(screen.getByTestId("domain-name")).toHaveTextContent("google.com");

      // Click stats
      expect(screen.getByTestId("click-stats")).toHaveTextContent("42");
      expect(screen.getByTestId("click-stats")).toHaveTextContent("clicks");

      // Creation date
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

      // Wait for promise to resolve
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
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
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

      // Wait for promise to reject
      await vi.waitFor(() => {
        expect(sonner.toast.error).toHaveBeenCalledWith(
          "Failed to copy link!",
          {
            description: "Please try again.",
          },
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to copy link:",
          copyError,
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  // TODO: Fix these tests, they are failing due to issues with mocking DOM methods
  // describe("QR Code Download Functionality", () => {
  //   it("should download QR code when download button is clicked", () => {
  //     // Mock DOM methods safely with spies
  //     const mockLinkElement = {
  //       href: "",
  //       download: "",
  //       click: vi.fn(),
  //       style: {},
  //       remove: vi.fn(),
  //     };

  //     const createElementSpy = vi
  //       .spyOn(document, "createElement")
  //       .mockReturnValue(mockLinkElement as any);
  //     const appendChildSpy = vi
  //       .spyOn(document.body, "appendChild")
  //       .mockImplementation(() => mockLinkElement as any);
  //     const removeChildSpy = vi
  //       .spyOn(document.body, "removeChild")
  //       .mockImplementation(() => mockLinkElement as any);

  //     render(<LinkCard link={mockLink} />);

  //     const downloadButton = screen.getByTestId(`download-qr-${mockLink.slug}`);
  //     fireEvent.click(downloadButton);

  //     expect(createElementSpy).toHaveBeenCalledWith("a");
  //     expect(appendChildSpy).toHaveBeenCalledWith(mockLinkElement);
  //     expect(mockLinkElement.click).toHaveBeenCalled();
  //     expect(removeChildSpy).toHaveBeenCalledWith(mockLinkElement);

  //     // Clean up spies
  //     createElementSpy.mockRestore();
  //     appendChildSpy.mockRestore();
  //     removeChildSpy.mockRestore();
  //   });

  //   it("should set correct href and download attributes for QR download", () => {
  //     const mockLinkElement = {
  //       href: "",
  //       download: "",
  //       click: vi.fn(),
  //       style: {},
  //       remove: vi.fn(),
  //     };

  //     const createElementSpy = vi
  //       .spyOn(document, "createElement")
  //       .mockReturnValue(mockLinkElement as any);
  //     const appendChildSpy = vi
  //       .spyOn(document.body, "appendChild")
  //       .mockImplementation(() => mockLinkElement as any);
  //     const removeChildSpy = vi
  //       .spyOn(document.body, "removeChild")
  //       .mockImplementation(() => mockLinkElement as any);

  //     render(<LinkCard link={mockLink} />);

  //     const downloadButton = screen.getByTestId(`download-qr-${mockLink.slug}`);
  //     fireEvent.click(downloadButton);

  //     expect(mockLinkElement.href).toBe(mockLink.qrCode);
  //     expect(mockLinkElement.download).toBe(`${mockLink.slug}.png`);

  //     // Clean up spies
  //     createElementSpy.mockRestore();
  //     appendChildSpy.mockRestore();
  //     removeChildSpy.mockRestore();
  //   });
  // });

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
