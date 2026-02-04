"use client"

import { Bell } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Notifications</h1>
        <p className="text-neutral-600 mt-2">Vos dernières notifications</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-neutral-100 p-4 rounded-full">
            <Bell className="size-12 text-neutral-400" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Aucune notification
        </h2>
        <p className="text-neutral-600">
          Vous n&apos;avez aucune notification pour le moment
        </p>
      </div>
    </div>
  )
}
