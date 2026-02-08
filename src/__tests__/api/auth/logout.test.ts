import { describe, it, expect, vi } from 'vitest'

const { mockCookiesDelete } = vi.hoisted(() => ({
  mockCookiesDelete: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    delete: mockCookiesDelete,
  }),
}))

import { POST } from '@/app/api/auth/logout/route'

describe('POST /api/auth/logout', () => {
  it('supprime le cookie auth-token et retourne success', async () => {
    const res = await POST()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(mockCookiesDelete).toHaveBeenCalledWith('auth-token')
  })
})
