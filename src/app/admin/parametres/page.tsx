"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useAuth } from "@/context/AuthContext"

type TabType = "informations" | "preferences" | "securite"

export default function ParametresPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("informations")
  const [loading, setLoading] = useState(false)

  // Informations personnelles
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [tel, setTel] = useState("00 00 00 00 00")
  const [telPro, setTelPro] = useState("")

  useEffect(() => {
    if (user) {
      setNom(user.lastName || "")
      setPrenom(user.firstName || "")
      setRole(user.role === "ADMIN" ? "Administrateur" : "Utilisateur")
      setEmail(user.email || "")
    }
  }, [user])

  const handleSaveInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: prenom, lastName: nom, phone: telPro })
      })
      if (response.ok) {
        alert('Profil mis à jour avec succès')
      }
    } catch (error) {
      console.error('Erreur save:', error)
    } finally {
      setLoading(false)
    }
  }

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

    setLoading(true)
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors du changement de mot de passe")
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
      </header>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-neutral-200 mb-8">
        <button
          onClick={() => setActiveTab("informations")}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === "informations"
              ? "text-primary border-b-2 border-primary"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Informations personnelles
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
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-3xl">
        {activeTab === "informations" && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {prenom?.[0] || "U"}{nom?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{prenom} {nom}</h2>
                <p className="text-neutral-600">{role}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  + Télécharger votre fichier
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom"
                />
              </div>

              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Prénom"
                />
              </div>

              <div>
                <Label htmlFor="role">Rôle</Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Chef de caserne"
                />
              </div>

              <div>
                <Label htmlFor="email">Email professionnel</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                />
              </div>

              <div>
                <Label htmlFor="tel">Téléphone</Label>
                <Input
                  id="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="00 00 00 00 00"
                />
              </div>

              <div>
                <Label htmlFor="telPro">Téléphone professionnel</Label>
                <Input
                  id="telPro"
                  value={telPro}
                  onChange={(e) => setTelPro(e.target.value)}
                  placeholder="Ajouter"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button
                onClick={handleSaveInfo}
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Notification</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="email-notif" className="text-neutral-700">
                    Recevoir les informations par email
                  </label>
                  <div
                    onClick={() => setEmailNotif(!emailNotif)}
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
                    onClick={() => setSmsNotif(!smsNotif)}
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
                <Button variant="outline" onClick={() => {
                  setOldPassword("")
                  setNewPassword("")
                  setConfirmPassword("")
                }}>
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
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
