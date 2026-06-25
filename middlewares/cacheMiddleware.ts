import { NextRequest, NextResponse } from 'next/server';

export function cacheMiddleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|pdf)$/) || url.pathname.startsWith('/_next/static/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }
  return NextResponse.next();
}

