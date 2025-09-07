import { format } from "@formkit/tempo";
import { validateUrl } from "./";

type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
type ClassDictionary = Record<string, boolean | undefined>;
type ClassArray = ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flatMap((input) => {
      if (typeof input === "string") return input;
      if (typeof input === "object" && input !== null) {
        if (Array.isArray(input)) return input;
        return Object.entries(input)
          .filter(([_key, value]) => value)
          .map(([key]) => key);
      }
      return [];
    })
    .filter(Boolean)
    .join(" ");
}

export function getDomain(url: string): string {
  try {
    const { isValid, normalizedUrl, error } = validateUrl(url);

    if (!isValid) throw new Error(error);

    const { hostname } = new URL(normalizedUrl!);
    return hostname.replace("www.", "");
  } catch (error) {
    console.error("Invalid URL:", error);
    return "invalid url";
  }
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "DD MMM - YYYY, hh:mm A", "en");
}
