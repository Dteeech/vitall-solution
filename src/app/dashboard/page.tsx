"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card } from "@/components/ui/Card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Mail, MapPin, FileIcon, CheckCircle2, Clock, Loader2 } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type CandidatureStatus = 'PENDING' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED'

interface Candidature {
  id: string
  status: CandidatureStatus
  appliedAt: string
}

interface OrgUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

// ─── Steps derived from candidature status ────────────────────────────────────

const ALL_STEPS = [
  "Dossier d'inscription",
  "Test sportif",
  "Visite médicale",
  "Test théorique",
  "Entretien de recrutement",
  "Formation initiale",
]

const STATUS_STEP_INDEX: Record<CandidatureStatus, number> = {
  PENDING: 0,
  INTERVIEW: 1,
  ACCEPTED: 5,
  REJECTED: -1,
}

function buildSteps(status: CandidatureStatus, appliedAt: string) {
  const currentIdx = STATUS_STEP_INDEX[status]
  return ALL_STEPS.map((title, i) => {
    if (i < currentIdx) return { title, date: "Complet", status: "completed" as const }
    if (i === currentIdx) return { title, date: "En cours", status: "current" as const }
    return { title, date: "À venir", status: "upcoming" as const }
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardUserPage() {
  const { user, loading: authLoading } = useAuth()
  const [candidature, setCandidature] = useState<Candidature | null>(null)
  const [recruiter, setRecruiter] = useState<OrgUser | null>(null)
  const [orgName, setOrgName] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [candRes, usersRes, orgRes] = await Promise.all([
          fetch('/api/user/candidature'),
          fetch('/api/organization/users'),
          fetch('/api/user/organization'),
        ])

        if (candRes.ok) {
          const cand = await candRes.json()
          setCandidature(cand)
        }
        if (usersRes.ok) {
          const users: OrgUser[] = await usersRes.json()
          const admin = users.find(u => u.role === 'ADMIN')
          if (admin) setRecruiter(admin)
        }
        if (orgRes.ok) {
          const org = await orgRes.json()
          setOrgName(org.name || "")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const steps = candidature
    ? buildSteps(candidature.status, candidature.appliedAt)
    : []

  const currentStepIdx = steps.findIndex(s => s.status === 'current')
  const completedCount = steps.filter(s => s.status === 'completed').length
  const progressValue = candidature ? Math.round(((completedCount + (currentStepIdx >= 0 ? 0.5 : 0)) / ALL_STEPS.length) * 100) : 0
  const phaseLabel = currentStepIdx >= 0 ? `Phase ${currentStepIdx + 1}/${ALL_STEPS.length}` : candidature?.status === 'ACCEPTED' ? 'Terminé' : '—'

  const recruiterInitials = recruiter
    ? (recruiter.firstName[0] || '') + (recruiter.lastName[0] || '')
    : '??'

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#132E49]">
          Bonjour, {user?.firstName} !
        </h1>
        <p className="text-gray-500">Ravi de vous revoir. Voici où en est votre candidature.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Suivi candidature */}
          <Card className="p-6 border-none shadow-sm rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#132E49]">Suivi de candidature</h2>
              {candidature ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#132E49]">{phaseLabel}</span>
                  <div className="w-32">
                    <Progress value={progressValue} className="h-2" />
                  </div>
                </div>
              ) : (
                <span className="text-sm text-gray-400">Aucune candidature</span>
              )}
            </div>

            {candidature ? (
              <div className="relative space-y-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-[#132E49] text-white' :
                      step.status === 'current' ? 'bg-orange-100 text-[#EA8B48] border-2 border-[#EA8B48]' :
                      'bg-white border-2 border-gray-200'
                    }`}>
                      {step.status === 'completed' ? <CheckCircle2 size={14} /> :
                       step.status === 'current' ? <Clock size={14} /> : null}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-bold ${step.status === 'current' ? 'text-[#132E49]' : 'text-gray-900'}`}>
                          {step.title}
                        </h3>
                        <span className={`text-sm ${step.status === 'completed' ? 'text-green-500 font-medium' : 'text-gray-400'}`}>
                          {step.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Aucune candidature en cours.</p>
            )}
          </Card>

          {/* Documents */}
          <Card className="p-6 border-none shadow-sm rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#132E49]">Documents ajoutés</h2>
              <button className="text-sm font-bold text-[#132E49] hover:underline">Voir tout</button>
            </div>
            {candidature?.status && (
              <p className="text-sm text-gray-400 text-center py-6">
                Aucun document déposé pour le moment.
              </p>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <Card className="p-8 border-none shadow-sm rounded-3xl bg-[#EA8B48] text-white">
            <h2 className="text-lg font-bold mb-6">Votre recruteur</h2>
            {recruiter ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-white/20 p-1 mb-4 overflow-hidden">
                  <Avatar className="w-full h-full">
                    <AvatarFallback className="bg-white/10 text-xl font-bold text-white">
                      {recruiterInitials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-xl font-bold mb-1">
                  {recruiter.firstName} {recruiter.lastName}
                </h3>
                <p className="text-white/80 text-sm mb-6">Administrateur</p>
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                    <Mail size={18} className="shrink-0" />
                    <span className="text-sm truncate">{recruiter.email}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                    <MapPin size={18} className="shrink-0" />
                    <span className="text-sm truncate">{orgName || "Caserne"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-white/70 text-sm text-center">Aucun recruteur assigné.</p>
            )}
          </Card>

          <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
            <h2 className="text-lg font-bold text-[#132E49] mb-4">Besoin d&apos;aide ?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Consultez notre FAQ ou contactez directement votre recruteur pour toute question sur votre dossier.
            </p>
            <button className="w-full py-3 bg-[#132E49] text-white rounded-2xl font-bold text-sm hover:bg-[#1a3f66] transition-colors">
              Consulter la FAQ
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
