import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_KEY = "caminho_das_paroquias_auth"

const privateRoutes: Record<string, boolean> = {
  "/dashboard": false,
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasToken = request.cookies.has(AUTH_COOKIE_KEY);

  if (privateRoutes[pathname] && !hasToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // CSRF protection
  if (request.method === "GET") {
    return NextResponse.next();
  }
  const originHeader = request.headers.get("Origin");
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = request.headers.get("Host");
  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, {
      status: 403
    });
  }
  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return new NextResponse(null, {
      status: 403
    });
  }
  if (origin.host !== hostHeader) {
    return new NextResponse(null, {
      status: 403
    });
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
