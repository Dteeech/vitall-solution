import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json(
        { message: "Session ID manquant" },
        { status: 400 }
      )
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session.metadata) {
      return NextResponse.json(
        { message: "Métadonnées de session manquantes" },
        { status: 400 }
      )
    }

    const { email } = session.metadata

    // Récupérer l'utilisateur créé
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des infos utilisateur:", error)
    return NextResponse.json(
      { message: "Erreur lors de la récupération des infos" },
      { status: 500 }
    )
  }
}
