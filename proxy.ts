import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/types";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const stripped = pathname.replace(`/${defaultLocale}`, "") || "/";
    return NextResponse.redirect(new URL(stripped, request.url), 301);
  }

  const hasNonDefaultLocale = locales
    .filter((l) => l !== defaultLocale)
    .some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasNonDefaultLocale) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(
    new URL(`/${defaultLocale}${pathname === "/" ? "" : pathname}`, request.url),
  );
}

export const config = {
  matcher: [
    // Skip static assets (public/*) and paths already excluded — locale rewrite was 404ing /images/*, /logo.webp, etc.
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|models|images/)(?!.*\\.).*)",
  ],
};
