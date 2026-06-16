import { NextRequest, NextResponse } from "next/server";
 
const PROTECTED = ["/dashboard"];
const AUTH_ROUTES = ["/auth/login", "/auth/register"];
 
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("ledgrnow_token")?.value;
 
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));
 
  // No token → redirect to login
  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
 
  // Already logged in → redirect away from login/register
  if (isAuthRoute && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
 
  return NextResponse.next();
}
 
export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};
 