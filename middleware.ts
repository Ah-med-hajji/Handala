import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const intlMiddleware = createMiddleware({
  locales: ['ar', 'en', 'fr', 'es'],
  defaultLocale: 'ar',
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (useMock) {
      const mockSession = request.cookies.get('mock-admin-session')?.value;
      if (!mockSession && pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.next();
    }

    const response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value; },
          set(name: string, value: string, options: CookieOptions) { response.cookies.set({ name, value, ...options }); },
          remove(name: string, options: CookieOptions) { response.cookies.set({ name, value: '', ...options }); },
        },
      }
    );
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  // Exclude: API routes, Next.js internals, and any path with a file extension
  // (static assets like .jpeg/.png/.svg etc. must not go through intlMiddleware
  // or next-intl will redirect /carrousel/1.jpeg → /ar/carrousel/1.jpeg → 404)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',],
};
