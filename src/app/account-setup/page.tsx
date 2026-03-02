"use client"

import { useState } from "react"
import { PrimaryButton } from "@/components/ui"
import { useRouter } from "next/navigation"
import {
  Users,
  CalendarDays,
  GraduationCap,
  Truck,
  Building2,
  MessageSquare,
  CreditCard,
  FileSignature,
  UserCheck,
  Mail,
  PenLine,
  Settings,
  Check,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Module = {
  id: string
  name: string
  category: "RH" | "Communication" | "Gestion"
  price: number
  description: string
  icon: React.ReactNode
}

// ─── Modules data (correct prices) ──────────────────────────────────────────

const modules: Module[] = [
  // RH
  { id: "rh-1", name: "Recrutement", category: "RH", price: 90, description: "Module de gestion de recrutement.", icon: <Users size={20} /> },
  { id: "rh-2", name: "Paie", category: "RH", price: 70, description: "Module de gestion de la paie.", icon: <CreditCard size={20} /> },
  { id: "rh-3", name: "Planning", category: "RH", price: 65, description: "Module de gestion des employés.", icon: <CalendarDays size={20} /> },
  { id: "rh-4", name: "Congés", category: "RH", price: 50, description: "Module de gestion des congés.", icon: <CalendarDays size={20} /> },
  { id: "rh-5", name: "Signature", category: "RH", price: 50, description: "Module de signature électronique.", icon: <FileSignature size={20} /> },
  { id: "rh-6", name: "Formation", category: "RH", price: 40, description: "Module de gestion des formations.", icon: <GraduationCap size={20} /> },
  { id: "rh-7", name: "Employés", category: "RH", price: 25, description: "Module de gestion des employés.", icon: <UserCheck size={20} /> },
  { id: "rh-8", name: "Entretien", category: "RH", price: 20, description: "Module de suivi des entretiens.", icon: <PenLine size={20} /> },
  // Communication
  { id: "co-1", name: "Rendez-vous", category: "Communication", price: 40, description: "Module de prise de rendez-vous.", icon: <CalendarDays size={20} /> },
  { id: "co-2", name: "Email marketing", category: "Communication", price: 15, description: "Module pour campagnes emailing.", icon: <Mail size={20} /> },
  { id: "co-3", name: "Chat interne", category: "Communication", price: 15, description: "Module de messagerie instantanée.", icon: <MessageSquare size={20} /> },
  // Gestion
  { id: "ge-1", name: "Compta", category: "Gestion", price: 60, description: "Module de comptabilité.", icon: <Building2 size={20} /> },
  { id: "ge-2", name: "Flottes", category: "Gestion", price: 50, description: "Module de gestion de flottes de véhicules.", icon: <Truck size={20} /> },
  { id: "ge-3", name: "Matériel", category: "Gestion", price: 45, description: "Module de gestion de matériel.", icon: <Settings size={20} /> },
  { id: "ge-4", name: "Note de frais", category: "Gestion", price: 32.90, description: "Module de gestion des notes de frais.", icon: <CreditCard size={20} /> },
]

const BASE_PACK_PRICE = 270

// ─── Stepper ─────────────────────────────────────────────────────────────────

const STEPS = [
  "Informations",
  "Profil",
  "Modules",
  "Sécurité",
  "Caserne",
]

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, idx) => {
        const num = idx + 1
        const isCompleted = current > num
        const isActive = current === num
        const isUpcoming = current < num
        const isLast = idx === STEPS.length - 1

        return (
          <div key={num} className="flex items-center">
            {/* Step pill */}
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all ${isCompleted || isActive
                ? "bg-[#132E49] text-white"
                : "bg-white border border-neutral-300 text-neutral-400"
                }`}
            >
              {/* Badge number / check */}
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCompleted
                  ? "bg-white text-[#132E49]"
                  : isActive
                    ? "bg-white text-[#132E49]"
                    : "border border-neutral-300 text-neutral-400"
                  }`}
              >
                {isCompleted ? <Check size={10} strokeWidth={3} /> : num}
              </span>
              <span>{label}</span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={`w-5 h-px mx-0.5 shrink-0 ${isCompleted ? "bg-[#132E49]" : "bg-neutral-200"
                  }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Module Thumbnail ─────────────────────────────────────────────────────────

function ModuleThumbnail() {
  return (
    <div className="w-[110px] h-full min-h-[90px] shrink-0 rounded-lg overflow-hidden bg-[#132E49] p-2 flex flex-col gap-1">
      <div className="h-1.5 bg-white/20 rounded w-3/4" />
      <div className="h-1 bg-white/10 rounded w-full mt-0.5" />
      <div className="h-1 bg-white/10 rounded w-5/6" />
      <div className="h-1 bg-white/10 rounded w-full" />
      <div className="h-2.5 bg-white/15 rounded w-full mt-0.5" />
      <div className="h-1 bg-white/10 rounded w-4/5" />
      <div className="h-1 bg-white/10 rounded w-full" />
      <div className="h-2.5 bg-white/15 rounded w-full mt-0.5" />
      <div className="h-1 bg-white/10 rounded w-3/5" />
    </div>
  )
}

// ─── Module Card ──────────────────────────────────────────────────────────────

function ModuleCard({
  module,
  selected,
  onToggle,
}: {
  module: Module
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full text-left flex items-stretch gap-4 p-4 rounded-2xl border transition-all focus:outline-none ${selected
        ? "border-primary bg-orange-50 shadow-sm"
        : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
        }`}
    >
      <ModuleThumbnail />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-primary shrink-0">{module.icon}</span>
            <span className="text-base font-bold text-neutral-900 leading-tight">
              {module.name}
            </span>
          </div>
          <span className="text-base font-bold text-neutral-900 shrink-0">
            {module.price % 1 === 0
              ? `${module.price} €`
              : `${module.price.toFixed(2).replace(".", ",")} €`}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-500 mt-1.5 leading-snug">
          {module.description}
        </p>

        {/* Checkbox */}
        <div className="flex justify-end mt-3">
          <div
            className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-colors ${selected ? "border-primary bg-primary" : "border-neutral-300"}`}
          >
            {selected && <Check size={12} strokeWidth={3} className="text-white" />}
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function StepOrganization({
  organizationName, setOrganizationName,
  email, setEmail,
  password, setPassword,
  firstName, setFirstName,
  lastName, setLastName,
}: {
  organizationName: string; setOrganizationName: (v: string) => void
  email: string; setEmail: (v: string) => void
  password: string; setPassword: (v: string) => void
  firstName: string; setFirstName: (v: string) => void
  lastName: string; setLastName: (v: string) => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-neutral-900">Informations de votre organisation</h2>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Nom de l&apos;organisation *</label>
        <input type="text" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)}
          className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="SDIS 75, Caserne centrale..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Prénom *</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Jean" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Dupont" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Email administrateur *</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="admin@sdis75.fr" />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Mot de passe *</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="••••••••" />
      </div>
    </div>
  )
}

function StepModules({
  selectedModules,
  toggleModule,
}: {
  selectedModules: string[]
  toggleModule: (id: string) => void
}) {
  const categories: Array<"RH" | "Communication" | "Gestion"> = ["RH", "Communication", "Gestion"]

  return (
    <div className="space-y-8">
      {/* Pack de base — obligatoire, toujours sélectionné */}
      <div>
        <div className="w-full text-left flex items-stretch gap-4 p-4 rounded-2xl border border-primary bg-orange-50 shadow-sm cursor-default">
          <ModuleThumbnail />
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-primary shrink-0"><Building2 size={20} /></span>
                <span className="text-base font-bold text-neutral-900">Pack de base</span>
              </div>
              <span className="text-base font-bold text-neutral-900 shrink-0">270 €</span>
            </div>
            <p className="text-sm text-neutral-500 mt-1.5 leading-snug">
              Dashboard, gestion des utilisateurs et paramètres inclus. Obligatoire.
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs font-medium text-primary bg-orange-100 px-2 py-0.5 rounded-full">Inclus</span>
              <div className="w-5 h-5 rounded-sm border-2 border-primary bg-primary flex items-center justify-center">
                <Check size={12} strokeWidth={3} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="text-base font-semibold text-neutral-500 uppercase tracking-wide mb-3">{cat}</h3>
          <div className="flex flex-col gap-3">
            {modules
              .filter((m) => m.category === cat)
              .map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  selected={selectedModules.includes(module.id)}
                  onToggle={() => toggleModule(module.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function StepRecap({
  organizationName, email, firstName, lastName,
  selectedModuleNames, basePrice, modulesTotal, totalPrice,
}: {
  organizationName: string; email: string; firstName: string; lastName: string
  selectedModuleNames: string[]; basePrice: number; modulesTotal: number; totalPrice: number
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-neutral-900">Récapitulatif</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">Organisation</p>
          <p className="text-lg font-semibold text-neutral-900">{organizationName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-500">Administrateur</p>
          <p className="text-lg font-semibold text-neutral-900">{firstName} {lastName} ({email})</p>
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-500 mb-2">Modules sélectionnés</p>
          <div className="flex flex-wrap gap-2">
            {selectedModuleNames.length === 0
              ? <span className="text-neutral-400 text-sm">Aucun module sélectionné</span>
              : selectedModuleNames.map((name) => (
                <span key={name} className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-medium">{name}</span>
              ))}
          </div>
        </div>
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-neutral-700">
            <span>Pack de base</span>
            <span className="font-semibold">{basePrice} €</span>
          </div>
          <div className="flex justify-between text-neutral-700">
            <span>Modules additionnels ({selectedModuleNames.length})</span>
            <span className="font-semibold">{modulesTotal.toFixed(2).replace(".", ",")} €</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t">
            <span>Total mensuel</span>
            <span>{totalPrice.toFixed(2).replace(".", ",")} €</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5

const PLACEHOLDER_STEPS = [2, 4, 5] // steps with placeholder content

export default function AccountSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const [organizationName, setOrganizationName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const modulesTotal = modules
    .filter((m) => selectedModules.includes(m.id))
    .reduce((sum, m) => sum + m.price, 0)

  const totalPrice = BASE_PACK_PRICE + modulesTotal

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName, email, password, firstName, lastName,
          selectedModuleNames: modules.filter((m) => selectedModules.includes(m.id)).map((m) => m.name),
          totalPrice,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Erreur lors de la création de la session de paiement")
      }
      const { url } = await res.json()
      window.location.href = url
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur inconnue")
      setLoading(false)
    }
  }

  const next = () => setStep((s) => Math.min(s + 1, 5) as Step)
  const prev = () => setStep((s) => Math.max(s - 1, 1) as Step)

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">
          Création de votre compte
        </h1>

        {/* Stepper */}
        <div className="overflow-x-auto pb-2">
          <Stepper current={step} />
        </div>

        {/* Content */}
        <div className="mt-8">
          {step === 1 && (
            <StepOrganization
              organizationName={organizationName} setOrganizationName={setOrganizationName}
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              firstName={firstName} setFirstName={setFirstName}
              lastName={lastName} setLastName={setLastName}
            />
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Profil</h2>
              <p className="text-neutral-500">Complétez votre profil utilisateur.</p>
            </div>
          )}

          {step === 3 && (
            <StepModules
              selectedModules={selectedModules}
              toggleModule={toggleModule}
            />
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Sécurité</h2>
              <p className="text-neutral-500">Configurez vos paramètres de sécurité.</p>
            </div>
          )}

          {step === 5 && (
            <StepRecap
              organizationName={organizationName}
              email={email}
              firstName={firstName}
              lastName={lastName}
              selectedModuleNames={modules.filter((m) => selectedModules.includes(m.id)).map((m) => m.name)}
              basePrice={BASE_PACK_PRICE}
              modulesTotal={modulesTotal}
              totalPrice={totalPrice}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="mt-10 flex justify-between items-center">
          <button
            type="button"
            onClick={step === 1 ? () => router.push("/") : prev}
            className="text-neutral-600 font-medium hover:text-neutral-800 transition-colors"
          >
            Annuler
          </button>

          {step === 5 ? (
            <PrimaryButton
              label={loading ? "Redirection..." : "Procéder au paiement"}
              onClick={handleSubmit}
            />
          ) : (
            <PrimaryButton label="Suivant" onClick={next} />
          )}
        </div>
      </div>
    </main>
  )
}
