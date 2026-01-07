"use client"

import { User } from "lucide-react"

export default function ProfilPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Mon Profil</h1>
        <p className="text-neutral-600 mt-2">Consultez et modifiez vos informations personnelles</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <User className="size-12 text-primary" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Page Profil
        </h2>
        <p className="text-neutral-600">
          Utilisez la page &quot;Paramètres&quot; pour modifier vos informations
        </p>
      </div>
    </div>
  )
}
