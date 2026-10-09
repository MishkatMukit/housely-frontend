import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["ADMIN", "SUPERADMIN"],
  "/owner": ["OWNER"],
  "/tenant": ["TENANT"],
  "/profile": ["TENANT", "OWNER", "ADMIN", "SUPERADMIN"],
};
const PROTECTED_PREFIXES = ["/admin", "/owner", "/tenant", "/profile"];

function decodeRole(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
    return json.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;
  const role = token ? decodeRole(token) : null;

  if (token && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const dest =
      role === "ADMIN" || role === "SUPERADMIN"
        ? "/admin"
        : role === "OWNER"
          ? "/owner"
          : "/tenant";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  for (const [prefix, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix) && token && role && !roles.includes(role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
