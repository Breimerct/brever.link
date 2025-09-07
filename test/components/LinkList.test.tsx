import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../utils";
import LinkList from "../../src/components/link-list/LinkList";
import type { Link } from "../../src/types/link.type";

vi.mock("../../src/components/link-card/LinkCard", () => ({
  default: ({ link, className }: { link: Link; className: string }) => (
    <li data-testid={`link-card-${link.id}`} className={className}>
      <div>
        <h3>{link.slug}</h3>
        <a href={link.shortLink}>{link.shortLink}</a>
        <p>{link.url}</p>
        <span>{link.clickCount} clicks</span>
      </div>
    </li>
  ),
}));

describe("LinkList Component", () => {
  const mockLinks: Link[] = [
    {
      id: "1",
      slug: "test-link-1",
      url: "https://example.com",
      shortLink: "https://brever.link/abc123",
      qrCode: "data:image/png;base64,qrcode1",
      clickCount: 5,
      createdAt: new Date("2023-01-01"),
    },
    {
      id: "2",
      slug: "test-link-2",
      url: "https://google.com",
      shortLink: "https://brever.link/def456",
      qrCode: "data:image/png;base64,qrcode2",
      clickCount: 10,
      createdAt: new Date("2023-01-02"),
    },
    {
      id: "3",
      slug: "test-link-3",
      url: "https://github.com",
      shortLink: "https://brever.link/ghi789",
      qrCode: null,
      clickCount: 0,
      createdAt: new Date("2023-01-03"),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<LinkList links={[]} />);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should render with empty links array", () => {
      render(<LinkList links={[]} />);
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
      expect(list.children).toHaveLength(0);
    });

    it("should render all provided links", () => {
      render(<LinkList links={mockLinks} />);

      expect(screen.getByTestId("link-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("link-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("link-card-3")).toBeInTheDocument();
    });

    it("should render correct number of link cards", () => {
      render(<LinkList links={mockLinks} />);

      const linkCards = screen.getAllByTestId(/link-card-/);
      expect(linkCards).toHaveLength(mockLinks.length);
    });

    it("should pass link data to LinkCard components", () => {
      render(<LinkList links={mockLinks} />);

      expect(screen.getByText("test-link-1")).toBeInTheDocument();
      expect(screen.getByText("test-link-2")).toBeInTheDocument();
      expect(screen.getByText("test-link-3")).toBeInTheDocument();
      expect(screen.getByText("https://example.com")).toBeInTheDocument();
      expect(screen.getByText("https://google.com")).toBeInTheDocument();
      expect(screen.getByText("https://github.com")).toBeInTheDocument();
    });
  });

  describe("Grid Layout", () => {
    it("should have proper grid classes", () => {
      render(<LinkList links={mockLinks} />);

      const list = screen.getByRole("list");
      expect(list).toHaveClass("grid");
      expect(list).toHaveClass("grid-cols-1");
      expect(list).toHaveClass("md:grid-cols-2");
      expect(list).toHaveClass("lg:grid-cols-1");
      expect(list).toHaveClass("xl:grid-cols-2");
      expect(list).toHaveClass("gap-4");
    });

    it("should have responsive container classes", () => {
      render(<LinkList links={mockLinks} />);

      const container = screen.getByRole("list").parentElement;
      expect(container).toHaveClass("w-full");
    });

    it("should pass col-span-1 class to LinkCard components", () => {
      render(<LinkList links={mockLinks} />);

      const linkCards = screen.getAllByTestId(/link-card-/);
      linkCards.forEach((card) => {
        expect(card).toHaveClass("col-span-1");
      });
    });
  });

  describe("Props Handling", () => {
    it("should handle single link", () => {
      const singleLink = [mockLinks[0]];
      render(<LinkList links={singleLink} />);

      expect(screen.getByTestId("link-card-1")).toBeInTheDocument();
      expect(screen.queryByTestId("link-card-2")).not.toBeInTheDocument();
    });

    it("should use link id as key for LinkCard components", () => {
      render(<LinkList links={mockLinks} />);

      mockLinks.forEach((link) => {
        expect(screen.getByTestId(`link-card-${link.id}`)).toBeInTheDocument();
      });
    });

    it("should pass each link object correctly", () => {
      render(<LinkList links={mockLinks} />);

      expect(screen.getByText("5 clicks")).toBeInTheDocument();
      expect(screen.getByText("10 clicks")).toBeInTheDocument();
      expect(screen.getByText("0 clicks")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle links with null/undefined properties gracefully", () => {
      const linksWithNulls: Link[] = [
        {
          id: "null-test",
          slug: "null-link",
          url: "https://example.com",
          shortLink: "https://brever.link/null",
          qrCode: null,
          clickCount: 0,
          createdAt: new Date(),
        },
      ];

      expect(() => {
        render(<LinkList links={linksWithNulls} />);
      }).not.toThrow();

      expect(screen.getByTestId("link-card-null-test")).toBeInTheDocument();
    });

    it("should handle large number of links", () => {
      const manyLinks: Link[] = Array.from({ length: 100 }, (_, index) => ({
        id: `link-${index}`,
        slug: `test-link-${index}`,
        url: `https://example${index}.com`,
        shortLink: `https://brever.link/link${index}`,
        qrCode: null,
        clickCount: index,
        createdAt: new Date(),
      }));

      render(<LinkList links={manyLinks} />);

      const linkCards = screen.getAllByTestId(/link-card-/);
      expect(linkCards).toHaveLength(100);
    });

    it("should handle links with special characters in data", () => {
      const specialLinks: Link[] = [
        {
          id: "special-1",
          slug: "test-&-special",
          url: "https://example.com/path?query=value&other=123",
          shortLink: "https://brever.link/special",
          qrCode: null,
          clickCount: 1,
          createdAt: new Date(),
        },
      ];

      render(<LinkList links={specialLinks} />);

      expect(screen.getByTestId("link-card-special-1")).toBeInTheDocument();
      expect(screen.getByText("test-&-special")).toBeInTheDocument();
    });

    it("should handle empty string values", () => {
      const emptyStringLinks: Link[] = [
        {
          id: "empty-test",
          slug: "",
          url: "https://example.com",
          shortLink: "https://brever.link/empty",
          qrCode: "",
          clickCount: 0,
          createdAt: new Date(),
        },
      ];

      expect(() => {
        render(<LinkList links={emptyStringLinks} />);
      }).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("should render as a proper list", () => {
      render(<LinkList links={mockLinks} />);

      const list = screen.getByRole("list");
      expect(list.tagName).toBe("UL");
    });

    it("should have list items as children", () => {
      render(<LinkList links={mockLinks} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(mockLinks.length);
    });

    it("should maintain semantic HTML structure", () => {
      render(<LinkList links={mockLinks} />);

      const list = screen.getByRole("list");
      const listItems = screen.getAllByRole("listitem");

      listItems.forEach((item) => {
        expect(list).toContainElement(item);
      });
    });
  });

  describe("Performance Considerations", () => {
    it("should not re-render unnecessarily with same props", () => {
      const { rerender } = render(<LinkList links={mockLinks} />);

      rerender(<LinkList links={mockLinks} />);

      expect(screen.getByTestId("link-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("link-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("link-card-3")).toBeInTheDocument();
    });

    it("should update when links prop changes", () => {
      const initialLinks = [mockLinks[0]];
      const { rerender } = render(<LinkList links={initialLinks} />);

      expect(screen.getByTestId("link-card-1")).toBeInTheDocument();
      expect(screen.queryByTestId("link-card-2")).not.toBeInTheDocument();

      rerender(<LinkList links={mockLinks} />);

      expect(screen.getByTestId("link-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("link-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("link-card-3")).toBeInTheDocument();
    });
  });
});
