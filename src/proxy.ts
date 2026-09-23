import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getExpectedToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass public static assets and auth endpoints
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/login" ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  // 2. Check session token
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const expectedToken = await getExpectedToken();

  const isAuthenticated = token && token === expectedToken;

  if (isAuthenticated) {
    return NextResponse.next();
  }

  // 3. If API route, return 401 JSON
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 4. Otherwise redirect to login page with return url
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
