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

    const { moduleName } = await request.json()

    // 1. Trouver le module par son nom
    const module = await prisma.module.findUnique({
      where: { name: moduleName }
    })

    if (!module) {
      return NextResponse.json({ message: "Module non trouvé" }, { status: 404 })
    }

    // 2. Trouver la subscription de l'organisation
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId: authUser.organizationId }
    })

    if (!subscription) {
      return NextResponse.json({ message: "Abonnement non trouvé" }, { status: 404 })
    }

    // 3. Vérifier si déjà possédé
    const existing = await prisma.subscriptionModule.findFirst({
      where: {
        subscriptionId: subscription.id,
        moduleId: module.id
      }
    })

    if (existing) {
      return NextResponse.json({ message: "Module déjà activé" }, { status: 400 })
    }

    // 4. Ajouter le module
    await prisma.subscriptionModule.create({
      data: {
        subscriptionId: subscription.id,
        moduleId: module.id
      }
    })

    return NextResponse.json({ success: true, module })
  } catch (error) {
    console.error("Add module API error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
})
