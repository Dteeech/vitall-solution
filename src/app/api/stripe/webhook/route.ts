import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
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

      const metadata = session.metadata!
      const {
        organizationName,
        email,
        password,
        firstName,
        lastName,
        selectedModuleNames: modulesJson,
        totalPrice,
      } = metadata

      const selectedModuleNames: string[] = JSON.parse(modulesJson)

      // Hash password avec bcrypt
      const hashedPassword = await bcrypt.hash(password, 10)

      // Récupérer les modules
      const modules = await prisma.module.findMany({
        where: { name: { in: selectedModuleNames } },
      })

      // Transaction pour créer tout
      const result = await prisma.$transaction(async (tx) => {
        // 1. Créer l'organisation
        const organization = await tx.organization.create({
          data: {
            name: organizationName,
          },
        })

        // 2. Créer l'utilisateur admin
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: "ADMIN",
            organizationId: organization.id,
          },
        })

        // 3. Créer la subscription avec Stripe ID
        const subscription = await tx.subscription.create({
          data: {
            organizationId: organization.id,
            status: "ACTIVE",
            startDate: new Date(),
            monthlyPrice: parseFloat(totalPrice),
            stripeSubscriptionId: session.subscription as string,
            stripeCustomerId: session.customer as string,
          },
        })

        // 4. Créer les entrées SubscriptionModule
        await Promise.all(
          modules.map((module) =>
            tx.subscriptionModule.create({
              data: {
                subscriptionId: subscription.id,
                moduleId: module.id,
              },
            })
          )
        )

        console.log(`✅ Compte créé pour ${organizationName} (${email})`)
        
        return { user, organization }
      })

      // Stocker les infos utilisateur dans les métadonnées de session pour auto-login
      console.log(`🔑 Utilisateur créé - ID: ${result.user.id}, Email: ${result.user.email}`)
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
