import { NextResponse } from "next/server";

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth-session_token",
  "__Secure-better-auth-session_token",
];

export function proxy(request) {
  const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));

  if (hasSessionCookie) return NextResponse.next();

  const returnParams = new URLSearchParams(request.nextUrl.searchParams);
  returnParams.delete("_rsc");
  const returnPath = `${request.nextUrl.pathname}${returnParams.size ? `?${returnParams}` : ""}`;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", returnPath);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/create-event/:path*", "/manage-events/:path*", "/joined-events/:path*"],
};
