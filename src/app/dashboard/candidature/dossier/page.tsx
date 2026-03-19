"use client"

import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import {
  FileIcon,
  Download,
  Cake,
  MapPin,
  AtSign,
  Briefcase,
  Calendar,
  FileText,
  Loader2
} from "lucide-react"

type CandidatureStatus = 'PENDING' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED'

interface Candidature {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  status: CandidatureStatus
  appliedAt: string
}

const STATUS_LABEL: Record<CandidatureStatus, string> = {
  PENDING: 'En attente',
  INTERVIEW: 'En cours',
  ACCEPTED: 'Acceptée',
  REJECTED: 'Rejetée',
}

export default function DossierPage() {
  const { user, loading: authLoading } = useAuth()
  const [candidature, setCandidature] = useState<Candidature | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch('/api/user/candidature')
      .then(r => r.ok ? r.json() : null)
      .then(data => setCandidature(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const userInfo = [
    { icon: Cake, label: "Âge", value: "Non renseigné" },
    { icon: MapPin, label: "Caserne", value: user?.organization?.name || "Non renseignée" },
    { icon: AtSign, label: "Email", value: user?.email || "-" },
    { icon: Briefcase, label: "Métier", value: "Candidat" },
    {
      icon: Calendar,
      label: "Candidature",
      value: candidature ? STATUS_LABEL[candidature.status] : "Aucune",
    },
  ]

  const initials = (user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")

  // Document sections — vides car aucun système de documents n'existe encore
  const sections = [
    { title: "Vos résultats", theme: "blue", items: [] },
    { title: "Documents personnels", theme: "white", items: [] },
    { title: "Candidature", theme: "white", items: [] },
    { title: "Diplômes", theme: "white", items: [] },
  ]

  return (
    <div className="min-h-screen bg-white p-8">
      <header className="mb-12">
        <h1 className="text-2xl font-bold text-[#132E49] mb-8">Dossier</h1>

        <div className="flex items-start gap-12">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-[#7195AA]/60 flex items-center justify-center border-4 border-white shadow-sm">
              <span className="text-4xl font-bold text-white">{initials || '??'}</span>
            </div>
          </div>

          {/* Infos */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-[#132E49]">
                {user?.firstName} {user?.lastName}
              </h2>
              <span className="px-3 py-1 bg-[#D3E1EB] text-[#132E49] text-xs font-bold rounded-md">
                {candidature ? 'Dossier actif' : 'Aucun dossier'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-12">
              {userInfo.map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <item.icon size={18} className="text-gray-400 group-hover:text-[#132E49] transition-colors" />
                  </div>
                  <div className="flex justify-between flex-1 max-w-[200px]">
                    <span className="text-sm font-medium text-gray-500">{item.label}</span>
                    <span className="text-sm font-bold text-[#132E49]">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText size={24} className="text-[#132E49]" />
          <h2 className="text-xl font-bold text-[#132E49]">Vos documents</h2>
        </div>

        {sections.map((section, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-8 ${section.theme === 'blue' ? 'bg-[#EAF1F9]' : 'bg-white border border-gray-100 shadow-sm'}`}
          >
            <h3 className="text-lg font-bold text-[#132E49] mb-6">{section.title}</h3>
            {section.items.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun document pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((doc: { name: string; size: string }, docIdx) => (
                  <div
                    key={docIdx}
                    className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50 shadow-sm group hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#132E49] rounded-lg flex items-center justify-center shadow-sm">
                        <FileIcon size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#132E49] leading-tight truncate max-w-[150px]">{doc.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{doc.size}</p>
                      </div>
                    </div>
                    <button className="p-2 text-[#132E49] hover:bg-gray-50 rounded-lg transition-colors">
                      <Download size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
