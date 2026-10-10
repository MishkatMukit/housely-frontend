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

function decodeToken(token: string): {
  role: string | null;
  isExpired: boolean;
} {
  try {
    const payload = token.split(".")[1];
    if (!payload) return { role: null, isExpired: true };
    const json = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
    const isExpired = Boolean(json.exp && Date.now() >= json.exp * 1000);
    return { role: json.role ?? null, isExpired };
  } catch {
    return { role: null, isExpired: true };
  }
}

function applyCoop(res: NextResponse): NextResponse {
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  return res;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const tokenCookie = req.cookies.get("accessToken")?.value;
  const { role, isExpired } = tokenCookie
    ? decodeToken(tokenCookie)
    : { role: null, isExpired: false };
  const token = tokenCookie && !isExpired ? tokenCookie : null;

  if (tokenCookie && isExpired) {
    const isProtected = PROTECTED_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix),
    );
    if (isProtected) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("accessToken");
      return applyCoop(res);
    }
    const res = NextResponse.next();
    res.cookies.delete("accessToken");
    return applyCoop(res);
  }

  if (token && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const dest =
      role === "ADMIN" || role === "SUPERADMIN"
        ? "/admin"
        : role === "OWNER"
          ? "/owner"
          : "/tenant";
    return applyCoop(NextResponse.redirect(new URL(dest, req.url)));
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return applyCoop(NextResponse.redirect(loginUrl));
  }

  for (const [prefix, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix) && token && role && !roles.includes(role)) {
      return applyCoop(NextResponse.redirect(new URL("/", req.url)));
    }
  }

  return applyCoop(NextResponse.next());
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
