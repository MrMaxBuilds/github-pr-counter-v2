import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Create a response object
  const res = NextResponse.next();

  // Initialize Supabase client for Edge Runtime
  const supabase = createMiddlewareClient(
    {
      req: request,
      res,
    },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  );

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("user", user);

  // Redirect to login if no user is found and the path isn’t /login or /auth
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Return the response
  return res;
}