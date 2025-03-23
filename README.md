Check out the website! https://github-pr-counter-v2-reload.vercel.app/

<img width="1315" alt="image" src="https://github.com/user-attachments/assets/3fa5b63f-f408-4b9e-adec-f2ec87f1da47" />

A note about Vercel and Supabase oauth:
Despite what people online will tell you, supabase SSR package IS compatible with Vercel and the Edge runtime.
I ran into this same issue. I followed the supabase oauth tutorial (https://supabase.com/docs/guides/auth/server-side/nextjs) for NextJS. Everything looked good in my dev environment but when I deployed on Vercel, I got the error that the middleware package was not supported by the edge runtime. Moving the updateSession code out of utils/middleware and directly calling supabase/ssr package from the middleware.ts file fixes the issue.
This works:
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log("user", user)

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
But the tutorial has you do this
export async function middleware(request: NextRequest) {
    return await updateSession(request)
}