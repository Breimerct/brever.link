import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "../utils";

vi.mock("sonner", () => ({
  Toaster: ({
    richColors,
    closeButton,
  }: {
    richColors: boolean;
    closeButton: boolean;
  }) => (
    <div
      data-testid="sonner-toaster"
      data-rich-colors={richColors}
      data-close-button={closeButton}
    >
      Mocked Toaster
    </div>
  ),
}));

vi.mock("react-dom", () => ({
  createPortal: (children: React.ReactNode, _container: Element) => children,
}));

import Toaster from "../../src/components/toaster/Toaster";

describe("Toaster Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<Toaster />);
      expect(container).toBeInTheDocument();
    });

    it("should render Sonner toaster with correct props", () => {
      render(<Toaster />);

      const toaster = document.querySelector('[data-testid="sonner-toaster"]');
      expect(toaster).toBeInTheDocument();
      expect(toaster).toHaveAttribute("data-rich-colors", "true");
      expect(toaster).toHaveAttribute("data-close-button", "true");
    });

    it("should contain mocked toaster content", () => {
      render(<Toaster />);

      expect(
        document.querySelector('[data-testid="sonner-toaster"]'),
      ).toHaveTextContent("Mocked Toaster");
    });
  });

  describe("Integration", () => {
    it("should be a wrapper around Sonner toaster", () => {
      const { container } = render(<Toaster />);

      expect(container.firstChild).toBeTruthy();
    });

    it("should handle multiple renders", () => {
      const { rerender } = render(<Toaster />);

      expect(
        document.querySelector('[data-testid="sonner-toaster"]'),
      ).toBeInTheDocument();

      rerender(<Toaster />);

      expect(
        document.querySelector('[data-testid="sonner-toaster"]'),
      ).toBeInTheDocument();
    });
  });
});
