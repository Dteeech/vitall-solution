import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const authUser = await verifyAuth(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizationId = authUser.organizationId
    if (!organizationId) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const transfers = await prisma.transfer.findMany({
      where: {
        OR: [
          { fromOrganizationId: organizationId },
          { toOrganizationId: organizationId },
        ],
      },
      include: {
        fromOrganization: { select: { id: true, name: true } },
        toOrganization: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(transfers)
  } catch (error) {
    console.error('Error fetching transfers:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await verifyAuth(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizationId = authUser.organizationId
    if (!organizationId) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const body = await request.json()
    const { type, candidateName, toOrganizationId, applicationDate, exchangeDate, notes } = body

    if (!type || !candidateName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const transfer = await prisma.transfer.create({
      data: {
        fromOrganizationId: organizationId,
        toOrganizationId: toOrganizationId || null,
        candidateName,
        type,
        applicationDate: applicationDate ? new Date(applicationDate) : null,
        exchangeDate: exchangeDate ? new Date(exchangeDate) : null,
        notes: notes || null,
        status: 'EN_COURS',
      },
      include: {
        fromOrganization: { select: { id: true, name: true } },
        toOrganization: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(transfer, { status: 201 })
  } catch (error) {
    console.error('Error creating transfer:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
