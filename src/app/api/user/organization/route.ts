import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { withMetrics } from "@/lib/withMetrics"

export const GET = withMetrics(async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 })
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    if (!user.organizationId) {
      return NextResponse.json({ message: "Aucune organisation associée" }, { status: 404 })
    }

    const organization = await prisma.organization.findUnique({
      where: { id: user.organizationId },
      include: {
        users: {
          where: { role: "ADMIN" },
          take: 1
        }
      }
    })

    if (!organization) {
      return NextResponse.json({ message: "Organisation non trouvée" }, { status: 404 })
    }

    return NextResponse.json(organization)
  } catch (error) {
    console.error("Erreur API Organization GET:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
})

export const PATCH = withMetrics(async function PATCH(request: Request) {
  try {
    const user = await getAuthUser()
    const body = await request.json()

    if (!user) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 })
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 })
    }

    if (!user.organizationId) {
      return NextResponse.json({ message: "Aucuna organisation associée" }, { status: 404 })
    }

    const updated = await prisma.organization.update({
      where: { id: user.organizationId },
      data: {
        name: body.name,
        address: body.address,
        recruitmentOpen: body.recruitmentOpen,
        openPositions: body.openPositions,
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Erreur API Organization PATCH:", error)
    return NextResponse.json({ message: "Erreur lors de la mise à jour" }, { status: 500 })
  }
})
