import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "votre-secret-super-securise-changez-moi"
)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")

    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      )
    }

    // Vérifier le token
    const { payload } = await jwtVerify(token.value, JWT_SECRET)

    // Récupérer les infos utilisateur
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: {
        organization: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organization: user.organization,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la vérification de session:", error)
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    )
  }
}
