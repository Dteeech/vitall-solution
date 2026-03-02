import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCookiesGet } = vi.hoisted(() => ({
  mockCookiesGet: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: mockCookiesGet,
  }),
}))

vi.mock('jose', async () => {
  const actual = await vi.importActual<typeof import('jose')>('jose')
  return {
    ...actual,
    jwtVerify: vi.fn(),
  }
})

import '@/__mocks__/prisma'
import { prisma } from '@/__mocks__/prisma'
import { jwtVerify } from 'jose'
import { GET } from '@/app/api/auth/session/route'

describe('GET /api/auth/session', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retourne 401 sans cookie', async () => {
    mockCookiesGet.mockReturnValueOnce(undefined)
    const res = await GET(new Request('http://localhost/api/auth/session'))
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.authenticated).toBe(false)
  })

  it('retourne 401 si le token est invalide', async () => {
    mockCookiesGet.mockReturnValueOnce({ value: 'bad-token' })
    vi.mocked(jwtVerify).mockRejectedValueOnce(new Error('invalid'))
    const res = await GET(new Request('http://localhost/api/auth/session'))
    expect(res.status).toBe(401)
  })

  it("retourne 401 si l'utilisateur n'existe plus en BDD", async () => {
    mockCookiesGet.mockReturnValueOnce({ value: 'valid-token' })
    vi.mocked(jwtVerify).mockResolvedValueOnce({
      payload: { userId: 'deleted-user' },
      protectedHeader: { alg: 'HS256' },
    } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)

    const res = await GET(new Request('http://localhost/api/auth/session'))
    expect(res.status).toBe(401)
  })

  it('retourne 200 avec les infos utilisateur si session valide', async () => {
    mockCookiesGet.mockReturnValueOnce({ value: 'valid-token' })
    vi.mocked(jwtVerify).mockResolvedValueOnce({
      payload: { userId: '1' },
      protectedHeader: { alg: 'HS256' },
    } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: '1',
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'ADMIN',
      organization: { id: 'org1', name: 'Org' },
    } as never)

    const res = await GET(new Request('http://localhost/api/auth/session'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.authenticated).toBe(true)
    expect(data.user.email).toBe('test@test.com')
  })
})
