import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const payload = await verifyAuth(request)
    if (!payload) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 })
    }

    const { oldPassword, newPassword } = await request.json()

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Ancien et nouveau mot de passe requis" },
        { status: 400 }
      )
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(oldPassword, user.password)
    if (!isValid) {
      return NextResponse.json(
        { message: "Mot de passe actuel incorrect" },
        { status: 401 }
      )
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: "Mot de passe modifié avec succès" })
  } catch (error) {
    console.error("Erreur changement mot de passe:", error)
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    )
  }
}
