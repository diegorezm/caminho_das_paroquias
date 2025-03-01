import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_KEY } from "./server/modules/auth/constants";

const privateRoutes: Record<string, boolean> = {
  "/test": true,
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasToken = request.cookies.has(AUTH_COOKIE_KEY);
  if (privateRoutes[pathname] && !hasToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
