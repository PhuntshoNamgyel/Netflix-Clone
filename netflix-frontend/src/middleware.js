import { NextResponse } from "next/server";

export function middleware(request) {
  // Check for JWT token in cookies
  const token = request.cookies.get("token");

  // Protect /my-list route
  if (request.nextUrl.pathname.startsWith("/my-list")) {
    // If no token is found, redirect to login page
    if (!token) {
      return NextResponse.redirect(new URL("/Login", request.url));
    }
  }

  // Keep existing functionality intact
  return NextResponse.next();
}