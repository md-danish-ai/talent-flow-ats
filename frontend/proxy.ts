import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isClearingAuth = searchParams.get("clear_auth") === "1";

  // Handle explicit auth clearing via URL flag.
  // Always delete cookies when clear_auth=1 is present.
  // KEY FIX: If already on the correct auth page, use NextResponse.next() (NOT redirect)
  // so the page renders and we break any redirect loop.
  // Admin/Project-Lead land on /sign-in, Users land on / (sign-up).
  if (isClearingAuth) {
    const response =
      pathname === "/sign-in" || pathname === "/"
        ? NextResponse.next() // Already on correct auth page → clear cookies & render
        : NextResponse.redirect(new URL("/?clear_auth=1", request.url)); // fallback
    response.cookies.delete("auth_token");
    response.cookies.delete("role");
    response.cookies.delete("user_info");
    return response;
  }

  const authToken = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("role")?.value;

  // 1. Redirect to correct auth page if accessing protected routes without token
  //    Admin/Project-Lead routes → /sign-in
  //    User routes → / (sign-up)
  if (!authToken) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/project-lead")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    if (pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 2. If logged in, prevent accessing sign-in/sign-up (root) page
  if (authToken && (pathname === "/sign-in" || pathname === "/")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (role === "project_lead") {
      return NextResponse.redirect(
        new URL("/project-lead/dashboard", request.url),
      );
    } else {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  }

  // 3. Ensure admins can't access user routes and vice versa
  if (authToken) {
    if (
      role === "admin" &&
      (pathname.startsWith("/user") || pathname.startsWith("/project-lead"))
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (
      role === "project_lead" &&
      (pathname.startsWith("/user") || pathname.startsWith("/admin"))
    ) {
      return NextResponse.redirect(
        new URL("/project-lead/dashboard", request.url),
      );
    }
    if (
      role === "user" &&
      (pathname.startsWith("/admin") || pathname.startsWith("/project-lead"))
    ) {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Fallback alias for backward compatibility
export const middleware = proxy;

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/admin/:path*",
    "/user/:path*",
    "/project-lead/:path*",
  ],
};
