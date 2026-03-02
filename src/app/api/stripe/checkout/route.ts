import { NextResponse } from "next/server"
import Stripe from "stripe"
import { withMetrics } from "@/lib/withMetrics"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
})

type CheckoutRequest = {
  organizationName: string
  email: string
  password: string
  firstName: string
  lastName: string
  selectedModuleNames: string[]
  totalPrice: number
}

export const POST = withMetrics(async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json()

    const {
      organizationName,
      email,
      totalPrice,
      selectedModuleNames,
      firstName,
      lastName,
      password,
    } = body

    // Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Vitall - ${organizationName}`,
              description: `Pack de base + ${selectedModuleNames.length} module(s)`,
            },
            unit_amount: Math.round(totalPrice * 100), // Stripe utilise les centimes
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account-setup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account-setup?canceled=true`,
      customer_email: email,
      metadata: {
        organizationName,
        email,
        password, // ATTENTION: En production, utilisez un système plus sécurisé
        firstName,
        lastName,
        selectedModuleNames: JSON.stringify(selectedModuleNames),
        totalPrice: totalPrice.toString(),
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Erreur Stripe checkout:", error)
    return NextResponse.json(
      {
        message: "Erreur lors de la création de la session de paiement",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    )
  }
})
