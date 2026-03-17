import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const authUser = await verifyAuth(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { email: true, organizationId: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const candidature = await prisma.candidature.findFirst({
      where: {
        email: user.email,
        organizationId: user.organizationId ?? undefined,
      },
    })

    return NextResponse.json(candidature)
  } catch (error) {
    console.error('Error fetching candidature:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
