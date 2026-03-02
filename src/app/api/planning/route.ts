
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

    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const plannings = await prisma.planning.findMany({
      where: {
        organizationId: organizationId,
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
    const authUser = await verifyAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = authUser.organizationId;
    if (!organizationId) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const body = await request.json();
    const { startTime, endTime, type, userId, isAvailable } = body;

    // TODO: Validation du body (dates valides, type valide...)

    // Trouver ou créer le planning principal de l'organisation
    // Pour simplifier, on prend le premier planning existant ou on en crée un par défaut
    let planning = await prisma.planning.findFirst({
        where: { organizationId: organizationId }
    });

    if (!planning) {
        planning = await prisma.planning.create({
            data: {
                name: 'Planning Principal',
                organizationId: organizationId
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
    const authUser = await verifyAuth(request);
    if (!authUser) {
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
    const authUser = await verifyAuth(request);
    if (!authUser) {
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
