"use client"

import { User, Bell, Settings, FileText } from "lucide-react"
import Link from "next/link"

export default function DashboardUserPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Tableau de bord</h1>
        <p className="text-neutral-600 mt-2">Bienvenue sur votre espace personnel</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/profil" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <User className="size-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Mon profil</h2>
          </div>
          <p className="text-neutral-600">Consultez et modifiez vos informations personnelles</p>
        </Link>

        <Link href="/dashboard/modules" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <FileText className="size-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Mes modules</h2>
          </div>
          <p className="text-neutral-600">Accédez aux modules auxquels vous êtes abonné</p>
        </Link>

        <Link href="/dashboard/notifications" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Bell className="size-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <p className="text-neutral-600">Consultez vos dernières notifications</p>
        </Link>

        <Link href="/dashboard/parametres" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Settings className="size-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Paramètres</h2>
          </div>
          <p className="text-neutral-600">Gérez vos préférences et votre compte</p>
        </Link>
      </div>
    </div>
  )
}
