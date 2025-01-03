import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Simple console logging for Edge runtime
  console.log(`[Request] ${request.method} ${request.url}`, {
    headers: Object.fromEntries(request.headers),
  });

  return NextResponse.next();
}
