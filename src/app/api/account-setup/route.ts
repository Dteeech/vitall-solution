import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type AccountSetupRequest = {
  organizationName: string
  email: string
  password: string
  firstName: string
  lastName: string
  selectedModuleNames: string[]
}

export async function POST(request: Request) {
  try {
    const body: AccountSetupRequest = await request.json()

    const {
      organizationName,
      email,
      password,
      firstName,
      lastName,
      selectedModuleNames,
    } = body

    // Validation
    if (!organizationName || !email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      )
    }

    // TODO: Hash password avec bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10)
    const hashedPassword = password // TEMPORAIRE - À REMPLACER

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 409 }
      )
    }

    // Récupérer les modules par nom
    const modules = await prisma.module.findMany({
      where: {
        name: { in: selectedModuleNames },
      },
    })

    if (modules.length !== selectedModuleNames.length) {
      return NextResponse.json(
        { message: "Certains modules sélectionnés n'existent pas" },
        { status: 400 }
      )
    }

    // Calculer le prix total
    const BASE_PACK_PRICE = 270.0
    const modulesTotal = modules.reduce((sum, m) => sum + m.price, 0)
    const totalPrice = BASE_PACK_PRICE + modulesTotal

    // Transaction pour créer tout en une fois
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

      // 3. Créer la subscription
      const subscription = await tx.subscription.create({
        data: {
          organizationId: organization.id,
          status: "ACTIVE",
          startDate: new Date(),
          monthlyPrice: totalPrice,
        },
      })

      // 4. Créer les entrées SubscriptionModule
      const subscriptionModules = await Promise.all(
        modules.map((module) =>
          tx.subscriptionModule.create({
            data: {
              subscriptionId: subscription.id,
              moduleId: module.id,
            },
          })
        )
      )

      return {
        organization,
        user,
        subscription,
        subscriptionModules,
      }
    })

    return NextResponse.json(
      {
        message: "Compte créé avec succès",
        organizationId: result.organization.id,
        userId: result.user.id,
        subscriptionId: result.subscription.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur lors de la création du compte:", error)
    return NextResponse.json(
      {
        message: "Erreur lors de la création du compte",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    )
  }
}
