import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isClearingAuth = searchParams.get("clear_auth") === "1";

  // Handle explicit auth clearing via URL flag.
  // Always delete cookies when clear_auth=1 is present.
  // KEY FIX: If already on /sign-in, use NextResponse.next() (NOT redirect)
  // so the page renders and we break the loop.
  // If on any other page, redirect to /sign-in?clear_auth=1.
  if (isClearingAuth) {
    const response =
      pathname === "/sign-in"
        ? NextResponse.next() // Already on sign-in → just clear cookies & let page render
        : NextResponse.redirect(new URL("/sign-in?clear_auth=1", request.url));
    response.cookies.delete("auth_token");
    response.cookies.delete("role");
    response.cookies.delete("user_info");
    return response;
  }

  const authToken = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("role")?.value;

  // 1. Redirect to login if accessing protected routes without token
  if (
    !authToken &&
    (pathname.startsWith("/admin") || pathname.startsWith("/user"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 2. If logged in, prevent accessing login/root page
  if (authToken && (pathname === "/sign-in" || pathname === "/")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  }

  // 3. Ensure admins can't access user routes and vice versa
  if (authToken) {
    if (role === "admin" && pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (role === "user" && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/admin/:path*", "/user/:path*"],
};
