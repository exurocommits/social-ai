import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { logRequest, logError } from '@/lib/logger';

// Authentication middleware for Next.js App Router
export async function middleware(request: NextRequest) {
  logRequest(request);

  const token = request.cookies.get('sb-access-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('sb-access-token');
      return response;
    }

    // Add user ID to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    logError(error as Error, 'auth-middleware');
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/schedule/:path*',
    '/analytics/:path*',
    '/settings/:path*',
  ],
};
