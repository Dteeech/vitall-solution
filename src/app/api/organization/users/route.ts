
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authUser = await verifyAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = authUser.organizationId;
    if (!organizationId) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const users = await prisma.user.findMany({
        where: {
            organizationId: organizationId
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
        }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching organization users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
