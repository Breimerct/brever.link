import "@testing-library/jest-dom";
import { vi, beforeEach, afterEach } from "vitest";

// Configuración global para React Testing Library
import { configure } from "@testing-library/react";

configure({
  testIdAttribute: "data-testid",
});

// Mock para variables de entorno si es necesario
const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = originalEnv;
});

// Mock global para window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock global para DOMParser
global.DOMParser = window.DOMParser;

// Mock para ResizeObserver si es necesario
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock para IntersectionObserver si es necesario
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
