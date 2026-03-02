import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { withMetrics } from "@/lib/withMetrics"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "votre-secret-super-securise-changez-moi"
)

type AutoLoginRequest = {
  userId: string
  email: string
  role: string
  organizationId: string
}

export const POST = withMetrics(async function POST(request: Request) {
  try {
    const { userId, email, role, organizationId }: AutoLoginRequest = await request.json()

    // Créer le token JWT
    const token = await new SignJWT({
      userId,
      email,
      role,
      organizationId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    // Créer la réponse avec le cookie
    const response = NextResponse.json({ success: true })

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
    console.error("Erreur lors de l'auto-login:", error)
    return NextResponse.json(
      { message: "Erreur lors de l'auto-login" },
      { status: 500 }
    )
  }
})
