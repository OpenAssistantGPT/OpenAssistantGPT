import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"


export default withAuth(
  async function middleware(req) {

    return NextResponse.next()

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

