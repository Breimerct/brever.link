/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { shorLink } from "../../src/services/shorten.service";
import { ActionError } from "astro:actions";

// Mock de las dependencias
vi.mock("../../src/services/link.service", () => ({
  verifyIsExistingLinkBySlug: vi.fn(),
  createNewLink: vi.fn(),
}));

vi.mock("qrcode", () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,mock-qr-code"),
  },
}));

// Importar después del mock
import {
  verifyIsExistingLinkBySlug,
  createNewLink,
} from "../../src/services/link.service";

// Crear referencias mockeadas
const mockVerifyIsExistingLinkBySlug = vi.mocked(verifyIsExistingLinkBySlug);
const mockCreateNewLink = vi.mocked(createNewLink);

describe("shorLink Service", () => {
  const mockContext = {
    request: {
      headers: {
        get: vi.fn(),
      },
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    mockContext.request.headers.get.mockReturnValue(
      "https://github.com/some-page",
    );
  });

  it("creates a new short link successfully", async () => {
    const inputData = {
      url: "https://github.com",
      slug: "test-slug",
    };

    mockVerifyIsExistingLinkBySlug.mockResolvedValue(false);
    mockCreateNewLink.mockResolvedValue({
      success: true,
      error: null,
      message: "Link created successfully",
    });

    const result = await shorLink(inputData, mockContext);

    expect(mockVerifyIsExistingLinkBySlug).toHaveBeenCalledWith("test-slug");
    expect(mockCreateNewLink).toHaveBeenCalledWith({
      slug: "test-slug",
      url: "https://github.com",
      shortLink: "https://github.com/test-slug",
      qrCode: "data:image/png;base64,mock-qr-code",
    });

    expect(result).toEqual({
      success: true,
      message: "Link created successfully",
    });
  });

  it("throws error when slug already exists", async () => {
    const inputData = {
      url: "https://stackoverflow.com",
      slug: "existing-slug",
    };

    mockVerifyIsExistingLinkBySlug.mockResolvedValue(true);

    await expect(shorLink(inputData, mockContext)).rejects.toThrow(ActionError);
    await expect(shorLink(inputData, mockContext)).rejects.toThrow(
      'Link with slug "existing-slug" already exists',
    );

    expect(mockVerifyIsExistingLinkBySlug).toHaveBeenCalledWith(
      "existing-slug",
    );
    expect(mockCreateNewLink).not.toHaveBeenCalled();
  });

  it("throws error when createNewLink fails", async () => {
    const inputData = {
      url: "https://reddit.com",
      slug: "test-slug",
    };

    mockVerifyIsExistingLinkBySlug.mockResolvedValue(false);
    mockCreateNewLink.mockResolvedValue({
      success: false,
      error: "Database error",
    });

    await expect(shorLink(inputData, mockContext)).rejects.toThrow(ActionError);
    await expect(shorLink(inputData, mockContext)).rejects.toThrow(
      "Database error",
    );
  });

  it("handles missing referer header gracefully", async () => {
    const inputData = {
      url: "https://twitter.com",
      slug: "test-slug",
    };

    mockContext.request.headers.get.mockReturnValue(null);
    mockVerifyIsExistingLinkBySlug.mockResolvedValue(false);

    // Without referer header, the service should throw an error when trying to create the URL
    await expect(shorLink(inputData, mockContext)).rejects.toThrow();
  });
});
