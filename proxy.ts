import { type NextRequest, NextResponse } from 'next/server'

// No authentication — all routes are public
export default function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export { proxy }

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}