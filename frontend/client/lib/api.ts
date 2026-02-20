const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5555"
).replace(/\/$/, "");

export type ApiError = Error & {
  status?: number;
  data?: any; // parsed JSON or text
  url?: string;
};

function isFormData(body: any) {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

async function parseBody(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json().catch(() => null);
  }
  return await res.text().catch(() => "");
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE_URL}${normalizedPath}`;

  const headers = new Headers(options.headers || undefined);

  const hasBody = options.body !== undefined && options.body !== null;
  const jsonBody = hasBody && typeof options.body === "string"; // JSON.stringify(...)
  const formDataBody = hasBody && isFormData(options.body);

  // Only set JSON content-type if we are actually sending JSON
  if (jsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // If FormData, browser must set boundary—don’t override it
  if (formDataBody && headers.has("Content-Type")) {
    headers.delete("Content-Type");
  }

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers, // <-- Headers object is valid here
  });

  if (!res.ok) {
    const data = await parseBody(res);
    const fallback = `Request failed: ${res.status} ${res.statusText}`;

    const message =
      (typeof data === "object" && (data?.error || data?.message)) ||
      (typeof data === "string" && data.trim()) ||
      (res.status === 401 ? "Invalid credentials. Please try again." : null) ||
      (res.status === 403 ? "Access denied for this action." : null) ||
      (res.status >= 500 ? "Server error. Please try again shortly." : null) ||
      fallback;

    const err = new Error(message) as ApiError;
    err.status = res.status;
    err.data = data;
    err.url = url;
    throw err;
  }

  return res;
}
