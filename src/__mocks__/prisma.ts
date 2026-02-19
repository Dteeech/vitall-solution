import { vi } from 'vitest'

export const prisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  organization: {
    create: vi.fn(),
  },
  module: {
    findMany: vi.fn(),
  },
  subscription: {
    create: vi.fn(),
  },
  subscriptionModule: {
    create: vi.fn(),
  },
  $transaction: vi.fn((fn: (tx: unknown) => Promise<unknown>) => fn(prisma)),
}

vi.mock('@/lib/prisma', () => ({
  prisma,
}))
