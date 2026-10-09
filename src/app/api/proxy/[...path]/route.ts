import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function handleRequest(req: NextRequest, method: string) {
  const path = req.nextUrl.pathname
    .replace("/api/proxy/", "")
    .replace(/^\/+/, "");
  const targetUrl = `${BACKEND_URL}/${path}${req.nextUrl.search}`;
  const headers = new Headers(req.headers);
  headers.delete("host");
  const init: RequestInit = {
    method,
    headers,
    redirect: "follow",
    cache: "no-store",
  };
  if (method !== "GET" && method !== "HEAD") {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      init.body = await req.text();
    } else {
      init.body = await req.arrayBuffer();
    }
  }
  const res = await fetch(targetUrl, init);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();
  const response = NextResponse.json(data, { status: res.status });
  const cookies = res.headers.getSetCookie();
  cookies.forEach((cookie) => response.headers.append("set-cookie", cookie));
  return response;
}

export async function GET(req: NextRequest) {
  return handleRequest(req, "GET");
}
export async function POST(req: NextRequest) {
  return handleRequest(req, "POST");
}
export async function PATCH(req: NextRequest) {
  return handleRequest(req, "PATCH");
}
export async function DELETE(req: NextRequest) {
  return handleRequest(req, "DELETE");
}
