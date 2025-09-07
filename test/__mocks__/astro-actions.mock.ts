export class ActionError extends Error {
  code: string;

  constructor({ message, code }: { message: string; code: string }) {
    super(message);
    this.name = "ActionError";
    this.code = code;
  }
}

export interface ActionAPIContext {
  request: {
    headers: {
      get: (key: string) => string | null;
    };
  };
}
