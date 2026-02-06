import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}))

vi.mock('@/lib/auth', () => ({
  verifyAuth: vi.fn(),
}))

import '@/__mocks__/prisma'
import { prisma } from '@/__mocks__/prisma'
import bcrypt from 'bcryptjs'
import { verifyAuth } from '@/lib/auth'
import { POST } from '@/app/api/auth/change-password/route'

function createRequest(body: Record<string, unknown>, cookie?: string): Request {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (cookie) headers['cookie'] = cookie
  return new Request('http://localhost:3000/api/auth/change-password', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/change-password', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retourne 401 si non authentifié', async () => {
    vi.mocked(verifyAuth).mockResolvedValueOnce(null)
    const res = await POST(createRequest({ oldPassword: 'a', newPassword: 'b' }))
    expect(res.status).toBe(401)
  })

  it('retourne 400 si champs manquants', async () => {
    vi.mocked(verifyAuth).mockResolvedValueOnce({
      userId: '1',
      email: 'u@t.com',
      role: 'USER',
      organizationId: 'org1',
    })
    const res = await POST(createRequest({ oldPassword: '', newPassword: '' }))
    expect(res.status).toBe(400)
  })

  it('retourne 401 si ancien mot de passe incorrect', async () => {
    vi.mocked(verifyAuth).mockResolvedValueOnce({
      userId: '1',
      email: 'u@t.com',
      role: 'USER',
      organizationId: 'org1',
    })
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: '1',
      password: '$2a$10$hash',
    } as never)
    vi.mocked(bcrypt).compare.mockResolvedValueOnce(false as never)

    const res = await POST(createRequest({ oldPassword: 'wrong', newPassword: 'new123' }))
    expect(res.status).toBe(401)
  })

  it('retourne 200 et met à jour le mot de passe', async () => {
    vi.mocked(verifyAuth).mockResolvedValueOnce({
      userId: '1',
      email: 'u@t.com',
      role: 'USER',
      organizationId: 'org1',
    })
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: '1',
      password: '$2a$10$hash',
    } as never)
    vi.mocked(bcrypt).compare.mockResolvedValueOnce(true as never)
    vi.mocked(bcrypt).hash.mockResolvedValueOnce('$2a$10$newhash' as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce({} as never)

    const res = await POST(createRequest({ oldPassword: 'old', newPassword: 'new123' }))
    expect(res.status).toBe(200)
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { password: '$2a$10$newhash' },
    })
  })
})
