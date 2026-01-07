"use client"

import { Settings } from "lucide-react"

export default function ParametresPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Paramètres</h1>
        <p className="text-neutral-600 mt-2">Gérez vos préférences</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Settings className="size-12 text-primary" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Paramètres utilisateur
        </h2>
        <p className="text-neutral-600">
          Page en cours de développement
        </p>
      </div>
    </div>
  )
}
