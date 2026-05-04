import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect("https://cal.com/guillempm", {
    status: 308,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
