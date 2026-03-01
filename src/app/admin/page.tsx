'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getModuleDefinition } from '@/core/config/module-registry'

type ActiveModule = {
  id: string
  name: string
  category: string
}

type KPICard = {
  value: number
  label: string
  color: 'orange' | 'teal' | 'slate'
}

type QuickAction = {
  moduleName: string
  title: string
  action: string
  href: string
}

/** KPIs statiques — à remplacer par des données API réelles */
const KPI_CARDS: KPICard[] = [
  { value: 3, label: 'Demandes de congés à traiter', color: 'orange' },
  { value: 5, label: 'Nouvelles candidatures', color: 'teal' },
  { value: 1, label: 'Demandes de transfert', color: 'slate' },
]

/** Quick actions par module — texte d'accroche pour le dashboard */
const QUICK_ACTIONS: Record<string, { title: string; action: string }> = {
  Recrutement: { title: 'Module recrutement', action: 'Partagez un profil de votre caserne' },
  Planning: { title: 'Module planning', action: 'Assignez une activité à un SPV' },
  Flottes: { title: 'Module gestion de flotte', action: 'Assignez un véhicule à un SPV' },
  Congés: { title: 'Module congés', action: 'Gérez les demandes de congés' },
  Formation: { title: 'Module formation', action: 'Planifiez une session de formation' },
  Paie: { title: 'Module paie', action: 'Consultez les bulletins de paie' },
  Compta: { title: 'Module comptabilité', action: 'Suivez vos factures et trésorerie' },
  'Chat interne': { title: 'Module messagerie', action: 'Communiquez avec vos équipes' },
  Matériel: { title: 'Module matériel', action: "Gérez l'inventaire du matériel" },
}

const kpiColorMap: Record<KPICard['color'], { bg: string; text: string; badge: string }> = {
  orange: { bg: 'bg-[#FFF5EC]', text: 'text-[#E67E22]', badge: 'bg-[#E67E22]' },
  teal: { bg: 'bg-[#EBF5F0]', text: 'text-[#2E7D5B]', badge: 'bg-[#2E7D5B]' },
  slate: { bg: 'bg-[#F0F2F4]', text: 'text-[#475569]', badge: 'bg-[#475569]' },
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [modules, setModules] = useState<ActiveModule[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/user/modules')
        if (response.ok) {
          const data = await response.json()
          setModules(data.modules)
        }
      } catch (error) {
        console.error('Dashboard fetch modules error:', error)
      }
    }
    fetchModules()
  }, [])

  // Construire les quick actions à partir des modules actifs
  const quickActions: QuickAction[] = modules
    .map((mod) => {
      const qa = QUICK_ACTIONS[mod.name]
      const def = getModuleDefinition(mod.name)
      if (!qa || !def) return null
      return {
        moduleName: mod.name,
        title: qa.title,
        action: qa.action,
        href: def.adminRoutes.length > 0 ? def.adminRoutes[0].href : '#',
      }
    })
    .filter((qa): qa is QuickAction => qa !== null)

  const firstName = user?.firstName ?? 'Utilisateur'

  return (
    <main className="flex-1 min-h-screen bg-[#FCFCFC]">
      <div className="flex flex-col gap-8 pt-8 pr-4 pl-4 pb-6">
        {/* Header + Search */}
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-[32px] font-semibold text-[#131315] font-[family-name:var(--font-poppins)]">
            Bonjour {firstName}, vos modules en un clin d&apos;œil !
          </h1>
          <div className="flex items-center gap-2 bg-[#FCFCFC] border border-[#F1F1F1] rounded-lg px-4 py-2 w-full max-w-md">
            <Search className="size-5 text-[#969390]" />
            <input
              type="text"
              placeholder="Rechercher un module, un candidat, un planning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#131315] placeholder:text-[#969390] outline-none font-[family-name:var(--font-poppins)]"
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="flex gap-6">
          {KPI_CARDS.map((kpi) => {
            const colors = kpiColorMap[kpi.color]
            return (
              <div
                key={kpi.label}
                className={`${colors.bg} flex items-start justify-between p-6 rounded-2xl w-[350px]`}
              >
                <div className="flex flex-col gap-2">
                  <span className={`text-[64px] font-semibold leading-none ${colors.text} font-[family-name:var(--font-poppins)]`}>
                    {kpi.value}
                  </span>
                  <span className="text-lg font-semibold text-[#131315] font-[family-name:var(--font-poppins)]">
                    {kpi.label}
                  </span>
                </div>
                <div className={`${colors.badge} flex items-center justify-center rounded-lg size-10`}>
                  <ChevronRight className="size-5 text-white" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Accès rapide */}
        <div className="flex flex-col gap-4 border border-[#B6B2AE] rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-[#131315] font-[family-name:var(--font-poppins)]">
            Accès rapide
          </h2>
          <div className="flex gap-6">
            {quickActions.length > 0 ? (
              quickActions.map((qa) => {
                const def = getModuleDefinition(qa.moduleName)
                return (
                  <div
                    key={qa.moduleName}
                    className="bg-[#FCFCFC] border border-[#B6B2AE] rounded-2xl px-4 py-6 w-[260px] h-[278px] flex flex-col justify-between overflow-hidden"
                  >
                    {/* Module header */}
                    <div className="flex items-center gap-1">
                      {def && (
                        <div className="size-8 rounded overflow-hidden flex items-center justify-center">
                          <Image src={def.icon} width={24} height={24} alt="" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-black font-[family-name:var(--font-poppins)]">
                        {qa.title}
                      </span>
                    </div>

                    {/* Action text */}
                    <p className="text-xl font-semibold text-black leading-tight font-[family-name:var(--font-poppins)]">
                      {qa.action}
                    </p>

                    {/* CTA Button */}
                    <Link
                      href={qa.href}
                      className="inline-flex items-center gap-2 bg-[#EA8B49] text-white px-4 py-2 rounded-lg font-medium text-base w-fit hover:bg-[#D5762F] transition-colors font-[family-name:var(--font-poppins)]"
                    >
                      Accéder au module
                      <ChevronRight className="size-5" />
                    </Link>
                  </div>
                )
              })
            ) : (
              <p className="text-neutral-500 text-sm py-8">
                Aucun module actif.{' '}
                <Link href="/admin/modules" className="text-[#E67E22] font-semibold hover:underline">
                  Ajouter des modules
                </Link>{' '}
                pour voir vos accès rapides.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
