import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'votre-secret-super-securise-changez-moi'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Routes publiques
  const publicPaths = ['/login', '/account-setup', '/mentions-legales', '/api/stripe/webhook']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Vérifier le token pour les routes admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const { payload } = await jwtVerify(token.value, JWT_SECRET)

      // Vérifier le rôle ADMIN - rediriger les USER vers /dashboard
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      return NextResponse.next()
    } catch (error) {
      // Token invalide
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Vérifier le token pour les routes dashboard (USER et ADMIN)
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth-token')

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      await jwtVerify(token.value, JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      // Token invalide
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets|public).*)',
  ],
}
