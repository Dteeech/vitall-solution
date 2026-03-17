import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const authUser = await verifyAuth(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(organizations)
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
