import { cookies } from "next/headers";
import { unstable_rethrow } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PROD_API_URL = "https://housely-backend-seven.vercel.app";

const PUBLIC_API_BASES = Array.from(
  new Set([API_URL, PROD_API_URL].filter(Boolean)),
);

export interface ServerFetchResult<T = unknown> {
  ok: boolean;
  status: number;
  body: T;
  setCookies: string[];
  base?: string;
}

export async function serverFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ServerFetchResult<T>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const accessToken = cookieStore.get("accessToken")?.value;

  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (cookieHeader) headers.set("Cookie", cookieHeader);
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const defaultTimeout = isFormData ? 60000 : 15000;
  const timeoutSignal = options.signal ?? AbortSignal.timeout(defaultTimeout);

  let lastError: unknown;
  for (const base of PUBLIC_API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        ...options,
        headers,
        cache: "no-store",
        signal: timeoutSignal,
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
      unstable_rethrow(error);
      lastError = error;
      if (isFormData) break;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`serverFetch failed for ${path}`);
}

export async function publicFetch<T = unknown>(
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
      unstable_rethrow(error);
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`publicFetch failed for ${path}`);
}
