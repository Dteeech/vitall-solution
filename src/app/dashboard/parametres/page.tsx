"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

type TabType = "preferences" | "securite"

export default function ParametresPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("securite")
  const [loading, setLoading] = useState(false)

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(false)

  // Sécurité
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du changement de mot de passe")
      }

      toast.success("Mot de passe modifié avec succès")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Paramètres</h1>
        <p className="text-neutral-600 mt-2">Gérez vos préférences</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-neutral-200 mb-8">
        <button
          onClick={() => setActiveTab("securite")}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === "securite"
              ? "text-primary border-b-2 border-primary"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Sécurité
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === "preferences"
              ? "text-primary border-b-2 border-primary"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Préférences
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-3xl">
        {activeTab === "securite" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Modifier mon mot de passe</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="old-password">Mot de passe actuel *</Label>
                  <Input
                    id="old-password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Mot de passe actuel"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">Nouveau mot de passe *</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirmer le mot de passe *</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOldPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={loading || !oldPassword || !newPassword || !confirmPassword}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  {loading ? "Modification..." : "Modifier"}
                </Button>
              </div>
            </div>
            <div className="pt-6 border-t">
              <Button onClick={handleLogout} variant="destructive" className="w-full">
                Se déconnecter
              </Button>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="email-notif" className="text-neutral-700">
                    Recevoir les informations par email
                  </label>
                  <div
                    role="switch"
                    aria-checked={emailNotif}
                    tabIndex={0}
                    onClick={() => setEmailNotif(!emailNotif)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEmailNotif(!emailNotif) } }}
                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                      emailNotif ? "bg-primary" : "bg-neutral-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform m-0.5 ${
                        emailNotif ? "translate-x-6" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="sms-notif" className="text-neutral-700">
                    Recevoir les informations par SMS
                  </label>
                  <div
                    role="switch"
                    aria-checked={smsNotif}
                    tabIndex={0}
                    onClick={() => setSmsNotif(!smsNotif)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSmsNotif(!smsNotif) } }}
                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                      smsNotif ? "bg-primary" : "bg-neutral-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform m-0.5 ${
                        smsNotif ? "translate-x-6" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
