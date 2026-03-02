
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Temporaire : mock session retrieval si pas encore configuré
// Dans la réalité, vous utiliserez getServerSession
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

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { organizationId: true }
    });

    if (!user || !user.organizationId) {
        return NextResponse.json({ error: 'User or Organization not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    // Récupérer les plannings de l'organisation
    // Et les shifts associés
    const plannings = await prisma.planning.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        shifts: {
            // Filtrer par date si start/end fournis
            where: (start && end) ? {
                startTime: {
                    gte: new Date(start),
                    lte: new Date(end)
                }
            } : undefined,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        }
      },
    });

    return NextResponse.json(plannings);
  } catch (error) {
    console.error('Error fetching plannings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { organizationId: true }
    });

    if (!user || !user.organizationId) {
        return NextResponse.json({ error: 'User or Organization not found' }, { status: 404 });
    }

    const body = await request.json();
    const { startTime, endTime, type, userId, isAvailable } = body;

    // TODO: Validation du body (dates valides, type valide...)

    // Trouver ou créer le planning principal de l'organisation
    // Pour simplifier, on prend le premier planning existant ou on en crée un par défaut
    let planning = await prisma.planning.findFirst({
        where: { organizationId: user.organizationId }
    });

    if (!planning) {
        planning = await prisma.planning.create({
            data: {
                name: 'Planning Principal',
                organizationId: user.organizationId
            }
        });
    }

    const shift = await prisma.shift.create({
        data: {
            planningId: planning.id,
            userId: userId || null, // Optionnel
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            type: type, // Doit correspondre à l'enum ShiftType
            isAvailable: isAvailable ?? true
        }
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, startTime, endTime, type, userId } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const shift = await prisma.shift.update({
      where: { id },
      data: {
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        type: type,
        userId: userId || null
      }
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.error('Error updating shift:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await prisma.shift.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shift:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
