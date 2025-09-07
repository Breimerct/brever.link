// Mock simplificado de ActionError de astro:actions
export class ActionError extends Error {
  code: string;

  constructor({ message, code }: { message: string; code: string }) {
    super(message);
    this.name = "ActionError";
    this.code = code;
  }
}

// Mock de ActionAPIContext
export interface ActionAPIContext {
  request: {
    headers: {
      get: (key: string) => string | null;
    };
  };
}
