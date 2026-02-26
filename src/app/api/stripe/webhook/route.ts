import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { processSuccessfulCheckout } from "@/lib/registration"
import { withMetrics } from "@/lib/withMetrics"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const POST = withMetrics(async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      )
    }

    // Gérer l'événement de paiement réussi
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      
      const result = await processSuccessfulCheckout(session)

      console.log(`✅ Webhook: Compte traité pour ${result.user.email}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erreur webhook Stripe:", error)
    return NextResponse.json(
      {
        message: "Erreur lors du traitement du webhook",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    )
  }
})
