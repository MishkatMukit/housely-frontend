import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PROD_API_URL = "https://housely-backend-seven.vercel.app";

const PUBLIC_API_BASES = [API_URL, PROD_API_URL];

export interface ServerFetchResult<T = any> {
  ok: boolean;
  status: number;
  body: T;
  setCookies: string[];
  base?: string;
}

export async function serverFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<ServerFetchResult<T>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);
  if (!isFormData) headers.set("Content-Type", "application/json");
  if (cookieHeader) headers.set("Cookie", cookieHeader);

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  return {
    ok: res.ok,
    status: res.status,
    body: body as T,
    setCookies: res.headers.getSetCookie(),
  };
}

export async function publicFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<ServerFetchResult<T>> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  let lastError: unknown;
  for (const base of PUBLIC_API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        ...options,
        headers,
        signal: options.signal ?? AbortSignal.timeout(6000),
      });

      const contentType = res.headers.get("content-type") || "";
      const body = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      return {
        ok: res.ok,
        status: res.status,
        body: body as T,
        setCookies: res.headers.getSetCookie(),
        base,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`publicFetch failed for ${path}`);
}
