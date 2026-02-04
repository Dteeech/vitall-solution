"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import logo from "../../../../public/assets/images/Logo-couleur.svg"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(3)
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Vérification du paiement...")

  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      setStatus("error")
      setMessage("Session de paiement introuvable")
      return
    }

    // Auto-login après paiement
    const autoLogin = async () => {
      try {
        // 1. Récupérer les infos utilisateur depuis la session Stripe
        const userResponse = await fetch(`/api/stripe/session-user?session_id=${sessionId}`)
        
        if (!userResponse.ok) {
          throw new Error("Impossible de récupérer les informations utilisateur")
        }

        const userData = await userResponse.json()

        // 2. Créer la session d'authentification
        const loginResponse = await fetch("/api/auth/auto-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        })

        if (!loginResponse.ok) {
          throw new Error("Erreur lors de la connexion automatique")
        }

        setStatus("success")
        setMessage("Compte créé avec succès ! Redirection...")

        // 3. Démarrer le compte à rebours vers le dashboard
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              router.push("/admin")
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (error) {
        console.error("Erreur auto-login:", error)
        setStatus("error")
        setMessage(
          error instanceof Error 
            ? error.message 
            : "Une erreur est survenue. Veuillez vous connecter manuellement."
        )
      }
    }

    autoLogin()
  }, [router, searchParams])

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl w-full text-center">
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="Vitall" width={150} height={50} />
        </div>

        {status === "loading" && (
          <div className="mb-8">
            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-3">
              Vérification en cours...
            </h1>
            <p className="text-lg text-neutral-600">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="mb-8">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Paiement réussi !
            </h1>
            <p className="text-lg text-neutral-600 mb-6">
              Votre compte a été créé avec succès. Vous allez recevoir un email de confirmation.
            </p>

            <div className="bg-primary-light border border-primary rounded-lg p-4 mb-6">
              <p className="text-primary font-medium">
                🎉 Bienvenue dans Vitall ! Votre organisation est maintenant active.
              </p>
            </div>

            <p className="text-neutral-500">
              Redirection vers votre tableau de bord dans{" "}
              <span className="font-bold text-primary">{countdown}</span> seconde
              {countdown > 1 ? "s" : ""}...
            </p>

            <button
              onClick={() => router.push("/admin")}
              className="mt-6 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition"
            >
              Accéder au tableau de bord
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="mb-8">
            <div className="w-20 h-20 bg-error rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Erreur
            </h1>
            <p className="text-lg text-neutral-600 mb-6">{message}</p>

            <button
              onClick={() => router.push("/login")}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition"
            >
              Se connecter manuellement
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl w-full text-center">
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  )
}
