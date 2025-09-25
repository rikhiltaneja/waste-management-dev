import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)', '/trainings(.*)', '/settings(.*)'])
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const url = req.nextUrl.clone()
  
  // Root path redirect logic
  if (url.pathname === '/') {
    if (userId) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    } else {
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }
  }
  
  // Allow public routes
  if (isPublicRoute(req)) return
  
  // Protect specific routes
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}