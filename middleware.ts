// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

// Use default export for Next.js middleware
export function middleware(request: NextRequest) {
  // Create a response object
  const res = NextResponse.next();
  return NextResponse.redirect(new URL('/home', request.url))

  // Initialize Supabase client for Edge Runtime
  // const supabase = createMiddlewareClient(
  //   {
  //     req: request,
  //     res,
  //   },
  //   {
  //     supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //     supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   }
  // );

  // // Refresh the session and get session data
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  // console.log("session", session);

  // // Redirect to login if no session and the path isn’t /login or /auth
  // if (
  //   !session &&
  //   !request.nextUrl.pathname.startsWith("/login") &&
  //   !request.nextUrl.pathname.startsWith("/auth")
  // ) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  // Return the response with updated cookies from getSession
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Apply to all routes except static files
};