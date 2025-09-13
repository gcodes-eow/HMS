// middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccess } from "./lib/routes";

// Create matchers for each route with its allowed roles
const matchers = Object.keys(routeAccess).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccess[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = new URL(req.url);

  // Extract role from session metadata or assign fallback
  const role = userId && sessionClaims?.metadata?.role?.toLowerCase();
  const fallbackRole = role ?? (userId ? "patient" : "sign-in");

  // Find matching route and check role access
  const matchingRoute = matchers.find(({ matcher }) => matcher(req));
  if (matchingRoute && !matchingRoute.allowedRoles.includes(fallbackRole)) {
    return NextResponse.redirect(new URL(`/${fallbackRole}`, url.origin));
  }

  return NextResponse.next();
});

// Middleware config to match relevant routes
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
