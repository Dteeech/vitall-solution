import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { withMetrics } from "@/lib/withMetrics"

export const GET = withMetrics(async function GET() {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      )
    }

    if (!authUser.organizationId) {
       return NextResponse.json(
        { message: "Organisation non trouvée" },
        { status: 404 }
      )
    }

    // Récupérer la subscription de l'organisation et les modules associés
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId: authUser.organizationId },
      include: {
        subscriptionModules: {
          include: {
            module: true
          }
        }
      }
    })

    if (!subscription) {
      return NextResponse.json({ modules: [] })
    }

    const modules = subscription.subscriptionModules.map(sm => sm.module)

    return NextResponse.json({ modules })
  } catch (error) {
    console.error("Erreur dans /api/user/modules:", error)
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    )
  }
})
