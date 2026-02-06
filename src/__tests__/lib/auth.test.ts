import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('jose', async () => {
  const actual = await vi.importActual<typeof import('jose')>('jose')
  return {
    ...actual,
    jwtVerify: vi.fn(),
  }
})

import { jwtVerify } from 'jose'
import { verifyAuth } from '@/lib/auth'

describe('verifyAuth()', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retourne null si pas de header cookie', async () => {
    const req = new Request('http://localhost:3000/api/test')
    const result = await verifyAuth(req)
    expect(result).toBeNull()
  })

  it('retourne null si pas de auth-token dans les cookies', async () => {
    const req = new Request('http://localhost:3000/api/test', {
      headers: { cookie: 'other=value' },
    })
    const result = await verifyAuth(req)
    expect(result).toBeNull()
  })

  it('retourne null si le token est invalide', async () => {
    vi.mocked(jwtVerify).mockRejectedValueOnce(new Error('invalid'))
    const req = new Request('http://localhost:3000/api/test', {
      headers: { cookie: 'auth-token=bad-token' },
    })
    const result = await verifyAuth(req)
    expect(result).toBeNull()
  })

  it("retourne l'AuthUser si le token est valide", async () => {
    vi.mocked(jwtVerify).mockResolvedValueOnce({
      payload: {
        userId: '1',
        email: 'u@t.com',
        role: 'ADMIN',
        organizationId: 'org1',
      },
      protectedHeader: { alg: 'HS256' },
    } as never)
    const req = new Request('http://localhost:3000/api/test', {
      headers: { cookie: 'auth-token=valid-token' },
    })
    const result = await verifyAuth(req)
    expect(result).toEqual({
      userId: '1',
      email: 'u@t.com',
      role: 'ADMIN',
      organizationId: 'org1',
    })
  })
})
