
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Temporaire : mock session retrieval (comme dans api/planning)
async function getSession() {
  // TODO: Remplacer par la vraie authentification
  return { 
      user: { 
          email: 'admin@test.fr',
          role: 'ADMIN'
      } 
  };
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { organizationId: true }
    });

    if (!currentUser || !currentUser.organizationId) {
        return NextResponse.json({ error: 'User or Organization not found' }, { status: 404 });
    }

    const users = await prisma.user.findMany({
        where: {
            organizationId: currentUser.organizationId
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
