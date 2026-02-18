import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // 1. Redirect to login if accessing protected routes without token
  if (
    !authToken &&
    (pathname.startsWith("/admin") || pathname.startsWith("/user"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 2. If logged in, prevent access to login/register pages
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

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/sign-in", "/admin/:path*", "/user/:path*"],
};
