import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getCurrentUser } from "./lib/session"

export default withAuth(
    async function middleware(req) {
        const user = await getCurrentUser()

        const isAuthPage =
            req.nextUrl.pathname.startsWith("/login")

        if (isAuthPage) {
            if (user) {
                return NextResponse.redirect(new URL("/dashboard", req.url))
            }

            return null
        }

        if (!user) {
            let from = req.nextUrl.pathname;
            if (req.nextUrl.search) {
                from += req.nextUrl.search;
            }

            return NextResponse.redirect(
                new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
            );
        }
    },
    {
        callbacks: {
            async authorized() {
                // This is a work-around for handling redirect on auth pages.
                // We return true here so that the middleware function above
                // is always called.
                return true
            },
        },
    }
)

export const config = {
    matcher: ["/dashboard/:path*", "/login"],
}