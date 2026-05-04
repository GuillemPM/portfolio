import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect("https://wa.me/34692331711", {
    status: 308,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
