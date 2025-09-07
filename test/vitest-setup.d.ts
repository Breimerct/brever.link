/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

declare global {
  namespace Vi {
    interface JestAssertion<T>
      extends jest.Matchers<void, T>,
        TestingLibraryMatchers<T, void> {}
  }
}

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);
