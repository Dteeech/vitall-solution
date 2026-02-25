import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { withMetrics } from "@/lib/withMetrics"

export const POST = withMetrics(async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("auth-token")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
    return NextResponse.json(
      { message: "Erreur lors de la déconnexion" },
      { status: 500 }
    )
  }
})
