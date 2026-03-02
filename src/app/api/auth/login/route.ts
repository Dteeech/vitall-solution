import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { withMetrics } from "@/lib/withMetrics"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "votre-secret-super-securise-changez-moi"
)

export const POST = withMetrics(async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      )
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: "Identifiants incorrects" },
        { status: 401 }
      )
    }

    // Vérifier le password avec bcrypt
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { message: "Identifiants incorrects" },
        { status: 401 }
      )
    }

    // Créer le token JWT
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    // Créer la réponse avec le cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organization: user.organization,
      },
    })

    // Définir le cookie httpOnly
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json(
      {
        message: "Erreur lors de la connexion",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    )
  }
})
