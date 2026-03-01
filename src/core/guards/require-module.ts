/**
 * Guard API — Vérifie qu'un module est actif pour l'organisation de l'utilisateur
 * avant d'autoriser l'accès aux routes API protégées.
 *
 * Usage dans un route handler :
 *   import { requireModule } from "@/core/guards/require-module"
 *
 *   export const GET = async (req: Request) => {
 *     const guard = await requireModule(req, "Planning")
 *     if (guard.error) return guard.error
 *     const { authUser } = guard
 *     // ... logique métier
 *   }
 */

import { NextResponse } from "next/server"
import { getAuthUser, type AuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type GuardSuccess = { authUser: AuthUser; error: null }
type GuardFailure = { authUser: null; error: NextResponse }
type GuardResult = GuardSuccess | GuardFailure

/**
 * Vérifie l'authentification ET l'activation du module pour l'organisation.
 * Renvoie un objet { authUser, error } — vérifiez `error` avant de continuer.
 */
export async function requireModule(
  _req: Request,
  moduleName: string
): Promise<GuardResult> {
  const authUser = await getAuthUser()

  if (!authUser || !authUser.organizationId) {
    return {
      authUser: null,
      error: NextResponse.json({ message: "Non autorisé" }, { status: 401 }),
    }
  }

  // Vérifier que le module est actif pour cette organisation
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId: authUser.organizationId },
    include: {
      subscriptionModules: {
        include: { module: true },
      },
    },
  })

  if (!subscription || subscription.status !== "ACTIVE") {
    return {
      authUser: null,
      error: NextResponse.json(
        { message: "Abonnement inactif" },
        { status: 403 }
      ),
    }
  }

  const isModuleActive = subscription.subscriptionModules.some(
    (sm) => sm.module.name === moduleName
  )

  if (!isModuleActive) {
    return {
      authUser: null,
      error: NextResponse.json(
        { message: `Module "${moduleName}" non activé pour votre organisation` },
        { status: 403 }
      ),
    }
  }

  return { authUser, error: null }
}

/**
 * Version simplifiée qui vérifie seulement l'auth + org (sans module spécifique).
 */
export async function requireAuth(): Promise<GuardResult> {
  const authUser = await getAuthUser()

  if (!authUser || !authUser.organizationId) {
    return {
      authUser: null,
      error: NextResponse.json({ message: "Non autorisé" }, { status: 401 }),
    }
  }

  return { authUser, error: null }
}
