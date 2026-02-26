import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { processSuccessfulCheckout } from "@/lib/registration"
import { withMetrics } from "@/lib/withMetrics"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
})

export const GET = withMetrics(async function GET(request: Request) {
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
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    })

    // Fallback: Si l'utilisateur n'est pas encore créé par le webhook
    // et que le paiement est réussi, on le crée ici.
    if (!user && session.payment_status === "paid" && session.status === "complete") {
      console.log(`Utilisateur ${email} non trouvé, création via API fallback...`)
      const result = await processSuccessfulCheckout(session)
      
      // On recharge l'utilisateur avec l'organisation
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          organization: true,
        },
      })
    }

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
})
