import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { withMetrics } from "@/lib/withMetrics"

export const GET = withMetrics(async function GET() {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
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

    // On ne renvoie pas le mot de passe
    const { password: _, ...safeUser } = user

    return NextResponse.json({ user: safeUser })
  } catch (error) {
    console.error("Erreur dans /api/auth/me:", error)
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    )
  }
})
