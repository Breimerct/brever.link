// Re-exportar todo desde React Testing Library
export * from "@testing-library/react";
export { render } from "@testing-library/react";

import { vi, beforeEach, afterEach, type MockedFunction } from "vitest";

// Utilidades adicionales para testing
export const mockConsole = () => {
  const originalConsole = { ...console };

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  return originalConsole;
};

// Helper para simular delay en tests asíncronos
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper para crear mocks de funciones con tipos
export const createMockFn = <T extends (...args: any[]) => any>(
  implementation?: T,
): MockedFunction<T> => {
  return vi.fn(implementation) as MockedFunction<T>;
};
