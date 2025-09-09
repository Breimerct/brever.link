export * from "@testing-library/react";
export { render } from "@testing-library/react";

import { vi, beforeEach, afterEach, type MockedFunction } from "vitest";

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

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const createMockFn = <T extends (...args: unknown[]) => unknown>(
  implementation?: T,
): MockedFunction<T> => {
  return vi.fn(implementation) as MockedFunction<T>;
};
