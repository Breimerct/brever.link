export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  normalizedUrl: string;
}

export function validateUrl(urlString: string): UrlValidationResult {
  if (
    !urlString ||
    typeof urlString !== "string" ||
    urlString.trim().length === 0
  ) {
    return {
      isValid: false,
      error: "URL cannot be empty",
      normalizedUrl: "",
    };
  }

  const trimmedUrl = urlString.trim();

  try {
    const url = new URL(trimmedUrl);

    if (url.protocol !== "https:") {
      return {
        isValid: false,
        error: "Protocol must be HTTPS",
        normalizedUrl: "",
      };
    }

    const hostname = url.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname === "example.com" ||
      hostname.endsWith(".example.com") ||
      hostname === "test.com" ||
      hostname.endsWith(".test.com")
    ) {
      return {
        isValid: false,
        error: "Local or example URLs are not allowed",
        normalizedUrl: "",
      };
    }

    if (isPrivateIP(hostname)) {
      return {
        isValid: false,
        error: "Private IP addresses are not allowed",
        normalizedUrl: "",
      };
    }

    if (!isValidHostname(hostname)) {
      return {
        isValid: false,
        error: "The domain name is not valid",
        normalizedUrl: "",
      };
    }

    if (url.port && url.port !== "443" && url.port !== "") {
      return {
        isValid: false,
        error: "Non-secure ports are not allowed",
        normalizedUrl: "",
      };
    }

    return {
      isValid: true,
      normalizedUrl: url.toString(),
    };
  } catch {
    return {
      isValid: false,
      error: "The URL structure is not valid",
      normalizedUrl: "",
    };
  }
}

function isPrivateIP(hostname: string): boolean {
  const privateIPRegexes = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./,
    /^::1$/,
    /^fc00::/,
    /^fd00::/,
  ];

  return privateIPRegexes.some((regex) => regex.test(hostname));
}

function isValidHostname(hostname: string): boolean {
  const hostnameRegex =
    /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))*$/;

  const punycodeRegex = /^xn--[a-zA-Z0-9-]+$/;

  return hostnameRegex.test(hostname) || punycodeRegex.test(hostname);
}
