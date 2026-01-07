import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "votre-secret-super-securise-changez-moi"
)

export type AuthUser = {
  userId: string
  email: string
  role: string
  organizationId: string
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token.value, JWT_SECRET)

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      organizationId: payload.organizationId as string,
    }
  } catch (error) {
    return null
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser()

  if (!user) {
    throw new Error("Non authentifié")
  }

  return user
}

export async function verifyAuth(request: Request): Promise<AuthUser | null> {
  try {
    const cookieHeader = request.headers.get("cookie")
    if (!cookieHeader) {
      return null
    }

    const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/)
    if (!tokenMatch) {
      return null
    }

    const { payload } = await jwtVerify(tokenMatch[1], JWT_SECRET)

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      organizationId: payload.organizationId as string,
    }
  } catch (error) {
    return null
  }
}
