import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { withMetrics } from "@/lib/withMetrics"

export const POST = withMetrics(async function POST(request: Request) {
  try {
    const authUser = await getAuthUser()
    if (!authUser || !authUser.organizationId) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const { moduleId } = await request.json()

    // 1. Trouver la subscription
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId: authUser.organizationId }
    })

    if (!subscription) {
      return NextResponse.json({ message: "Abonnement non trouvé" }, { status: 404 })
    }

    // 2. Supprimer la liaison module
    await prisma.subscriptionModule.deleteMany({
      where: {
        subscriptionId: subscription.id,
        moduleId: moduleId
      }
    })

    return NextResponse.json({ success: true, moduleId })
  } catch (error) {
    console.error("Remove module API error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
})
