import { describe, it, expect, vi, beforeEach } from 'vitest'

// Utiliser vi.hoisted pour que les variables soient disponibles lors du hoisting de vi.mock
const { mockCookiesSet } = vi.hoisted(() => ({
  mockCookiesSet: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    set: mockCookiesSet,
  }),
}))

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  },
}))

// Mock jose SignJWT pour éviter l'erreur Uint8Array dans les tests
vi.mock('jose', () => {
  const mockSign = vi.fn().mockResolvedValue('mocked-jwt-token')
  class MockSignJWT {
    setProtectedHeader() { return this }
    setExpirationTime() { return this }
    sign = mockSign
  }
  return {
    SignJWT: MockSignJWT,
  }
})

import '@/__mocks__/prisma'
import { prisma } from '@/__mocks__/prisma'
import bcrypt from 'bcryptjs'
import { POST } from '@/app/api/auth/login/route'

const mockedBcrypt = vi.mocked(bcrypt)

function createRequest(body: Record<string, unknown>): Request {
  return new Request('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retourne 400 si email ou password manquant', async () => {
    const res = await POST(createRequest({ email: '' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.message).toBe('Email et mot de passe requis')
  })

  it("retourne 401 si l'utilisateur n'existe pas", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    const res = await POST(createRequest({ email: 'no@one.com', password: '123' }))
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.message).toBe('Identifiants incorrects')
  })

  it('retourne 401 si le mot de passe est incorrect', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: '1',
      email: 'test@test.com',
      password: '$2a$10$hashedpassword',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      organizationId: 'org1',
      organization: { id: 'org1', name: 'Org' },
    } as never)
    mockedBcrypt.compare.mockResolvedValueOnce(false as never)

    const res = await POST(createRequest({ email: 'test@test.com', password: 'wrong' }))
    expect(res.status).toBe(401)
  })

  it('retourne 200 et set le cookie si login valide', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: '1',
      email: 'test@test.com',
      password: '$2a$10$hashedpassword',
      firstName: 'Test',
      lastName: 'User',
      role: 'ADMIN',
      organizationId: 'org1',
      organization: { id: 'org1', name: 'Org' },
    } as never)
    mockedBcrypt.compare.mockResolvedValueOnce(true as never)

    const res = await POST(createRequest({ email: 'test@test.com', password: 'correct' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.user.email).toBe('test@test.com')
    expect(data.user.role).toBe('ADMIN')
    expect(mockCookiesSet).toHaveBeenCalledWith(
      'auth-token',
      expect.any(String),
      expect.objectContaining({ httpOnly: true, path: '/' })
    )
  })
})
