import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import Stripe from "stripe"

export async function processSuccessfulCheckout(session: Stripe.Checkout.Session) {
  const metadata = session.metadata
  if (!metadata) {
    throw new Error("Métadonnées de session manquantes")
  }

  const {
    organizationName,
    email,
    password,
    firstName,
    lastName,
    selectedModuleNames: modulesJson,
    totalPrice,
  } = metadata

  const selectedModuleNames: string[] = JSON.parse(modulesJson || "[]")

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { user: existingUser }
  }

  // Hash password avec bcrypt
  const hashedPassword = await bcrypt.hash(password, 10)

  // Récupérer les modules
  const modules = await prisma.module.findMany({
    where: { name: { in: selectedModuleNames } },
  })

  // Transaction pour créer tout
  return await prisma.$transaction(async (tx) => {
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

    return { user, organization }
  })
}
