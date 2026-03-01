import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { withMetrics } from "@/lib/withMetrics"

export const POST = withMetrics(async function POST(request: Request) {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      )
    }

    const { firstName, lastName } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        firstName,
        lastName,
      },
      include: {
        organization: true
      }
    })

    const { password: _, ...safeUser } = updatedUser

    return NextResponse.json({ user: safeUser })
  } catch (error) {
    console.error("Erreur dans /api/user/update-profile:", error)
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour" },
      { status: 500 }
    )
  }
})
