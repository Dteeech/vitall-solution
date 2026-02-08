import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock jose pour contrôler jwtVerify
vi.mock('jose', async () => {
  const actual = await vi.importActual<typeof import('jose')>('jose')
  return {
    ...actual,
    jwtVerify: vi.fn(),
  }
})

import { middleware } from '@/middleware'
import { jwtVerify } from 'jose'

const mockedJwtVerify = vi.mocked(jwtVerify)

function createRequest(path: string, token?: string): NextRequest {
  const url = `http://localhost:3000${path}`
  const req = new NextRequest(url)
  if (token) {
    req.cookies.set('auth-token', token)
  }
  return req
}

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Routes publiques', () => {
    it.each([
      '/login',
      '/account-setup',
      '/account-setup/success',
      '/mentions-legales',
      '/api/stripe/webhook',
    ])('laisse passer %s sans vérification', async (path) => {
      const req = createRequest(path)
      const res = await middleware(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('x-middleware-next')).toBe('1')
    })
  })

  describe('Route /', () => {
    it("laisse passer la page d'accueil sans token", async () => {
      const req = createRequest('/')
      const res = await middleware(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('x-middleware-next')).toBe('1')
    })
  })

  describe('Routes /admin', () => {
    it('redirige vers /login sans token', async () => {
      const req = createRequest('/admin')
      const res = await middleware(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/login')
    })

    it('redirige vers /login avec un token invalide', async () => {
      mockedJwtVerify.mockRejectedValueOnce(new Error('invalid token'))
      const req = createRequest('/admin', 'bad-token')
      const res = await middleware(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/login')
    })

    it('redirige un USER vers /dashboard', async () => {
      mockedJwtVerify.mockResolvedValueOnce({
        payload: { userId: '1', email: 'u@t.com', role: 'USER', organizationId: 'org1' },
        protectedHeader: { alg: 'HS256' },
      } as never)
      const req = createRequest('/admin', 'valid-token')
      const res = await middleware(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/dashboard')
    })

    it('laisse passer un ADMIN', async () => {
      mockedJwtVerify.mockResolvedValueOnce({
        payload: { userId: '1', email: 'a@t.com', role: 'ADMIN', organizationId: 'org1' },
        protectedHeader: { alg: 'HS256' },
      } as never)
      const req = createRequest('/admin', 'valid-token')
      const res = await middleware(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('x-middleware-next')).toBe('1')
    })
  })

  describe('Routes /dashboard', () => {
    it('redirige vers /login sans token', async () => {
      const req = createRequest('/dashboard')
      const res = await middleware(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/login')
    })

    it('redirige vers /login avec un token invalide', async () => {
      mockedJwtVerify.mockRejectedValueOnce(new Error('expired'))
      const req = createRequest('/dashboard', 'expired-token')
      const res = await middleware(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/login')
    })

    it('laisse passer avec un token valide', async () => {
      mockedJwtVerify.mockResolvedValueOnce({
        payload: { userId: '1', email: 'u@t.com', role: 'USER', organizationId: 'org1' },
        protectedHeader: { alg: 'HS256' },
      } as never)
      const req = createRequest('/dashboard', 'valid-token')
      const res = await middleware(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('x-middleware-next')).toBe('1')
    })
  })
})
