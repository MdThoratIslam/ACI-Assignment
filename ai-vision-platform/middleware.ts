import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This middleware runs on the server, but we handle auth on client side
  // for this demo. In production, verify JWT tokens here.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
