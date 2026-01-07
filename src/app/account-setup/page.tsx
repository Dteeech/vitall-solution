"use client"

import { useState } from "react"
import { PrimaryButton, SecondaryButton } from "@/components/ui"
import { useRouter } from "next/navigation"

type Module = {
  id: string
  name: string
  category: string
  price: number
  description: string
}

const modules: Module[] = [
  // RH
  { id: "1", name: "Recrutement", category: "RH", price: 90.0, description: "Module de gestion du recrutement" },
  { id: "2", name: "Congés", category: "RH", price: 50.0, description: "Module de gestion des congés" },
  { id: "3", name: "Employés", category: "RH", price: 25.0, description: "Module de gestion des employés" },
  { id: "4", name: "Entretien", category: "RH", price: 20.0, description: "Module de suivi des entretiens" },
  { id: "5", name: "Planning", category: "RH", price: 65.0, description: "Module de planification des équipes" },
  { id: "6", name: "Formation", category: "RH", price: 40.0, description: "Module de gestion des formations" },
  { id: "7", name: "Paie", category: "RH", price: 70.0, description: "Module de gestion de la paie" },
  { id: "8", name: "Signature", category: "RH", price: 50.0, description: "Module de signature électronique" },
  
  // Communication
  { id: "9", name: "Rendez-vous", category: "Communication", price: 40.0, description: "Module de prise de rendez-vous" },
  { id: "10", name: "Email marketing", category: "Communication", price: 15.0, description: "Module pour campagnes emailing" },
  { id: "11", name: "Chat interne", category: "Communication", price: 15.0, description: "Module de messagerie instantanée" },
  
  // Gestion
  { id: "12", name: "Flottes", category: "Gestion", price: 50.0, description: "Module de gestion de flotte de véhicules" },
  { id: "13", name: "Matériel", category: "Gestion", price: 45.0, description: "Module de gestion de matériel" },
  { id: "14", name: "Compta", category: "Gestion", price: 60.0, description: "Module de comptabilité" },
  { id: "15", name: "Note de frais", category: "Gestion", price: 32.90, description: "Module de gestion des notes de frais" },
]

const BASE_PACK_PRICE = 270.0

export default function AccountSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  
  // Form data
  const [organizationName, setOrganizationName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const modulesTotal = modules
    .filter((m) => selectedModules.includes(m.id))
    .reduce((sum, m) => sum + m.price, 0)

  const totalPrice = BASE_PACK_PRICE + modulesTotal

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Créer une session Stripe Checkout
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName,
          email,
          password,
          firstName,
          lastName,
          selectedModuleNames: modules
            .filter((m) => selectedModules.includes(m.id))
            .map((m) => m.name),
          totalPrice,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de la création de la session de paiement")
      }

      const { url } = await response.json()
      
      // Rediriger vers Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : "Erreur inconnue")
      setLoading(false)
    }
  }

  return (
    <main className="p-6 py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-neutral-900">Configuration de votre organisation</h1>
          <p className="text-neutral-600 mt-2">Créez votre compte administrateur et sélectionnez vos modules</p>
        </header>

        <Stepper step={step} />

        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
          {step === 1 && (
            <StepOrganization
              organizationName={organizationName}
              setOrganizationName={setOrganizationName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
            />
          )}

          {step === 2 && (
            <StepModules
              modules={modules}
              selectedModules={selectedModules}
              toggleModule={toggleModule}
            />
          )}

          {step === 3 && (
            <StepRecap
              organizationName={organizationName}
              email={email}
              firstName={firstName}
              lastName={lastName}
              selectedModuleNames={modules
                .filter((m) => selectedModules.includes(m.id))
                .map((m) => m.name)}
              basePrice={BASE_PACK_PRICE}
              modulesTotal={modulesTotal}
              totalPrice={totalPrice}
            />
          )}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div>
            {step > 1 && (
              <SecondaryButton
                label="Précédent"
                onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
              />
            )}
          </div>

          <div className="flex gap-4 items-center">
            {step === 2 && (
              <div className="text-right">
                <p className="text-sm text-neutral-600">Total mensuel</p>
                <p className="text-3xl font-bold text-primary">{totalPrice.toFixed(2)} €</p>
              </div>
            )}
            
            {step < 3 ? (
              <PrimaryButton
                label="Suivant"
                onClick={() => setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))}
              />
            ) : (
              <PrimaryButton
                label={loading ? "Redirection vers paiement..." : "Procéder au paiement"}
                onClick={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Organisation", "Modules", "Récapitulatif"]
  
  return (
    <div className="flex items-center gap-4">
      {steps.map((label, idx) => {
        const stepNum = idx + 1
        const isActive = step === stepNum
        const isCompleted = step > stepNum
        
        return (
          <div key={stepNum} className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  isActive
                    ? "bg-primary text-white"
                    : isCompleted
                    ? "bg-success text-white"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-neutral-900" : "text-neutral-500"
                }`}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="h-0.5 flex-1 bg-neutral-200" />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepOrganization({
  organizationName,
  setOrganizationName,
  email,
  setEmail,
  password,
  setPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
}: {
  organizationName: string
  setOrganizationName: (v: string) => void
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  firstName: string
  setFirstName: (v: string) => void
  lastName: string
  setLastName: (v: string) => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-neutral-900">Informations de votre organisation</h2>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Nom de l&apos;organisation *
        </label>
        <input
          type="text"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="SDIS 75, Caserne centrale..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Prénom *
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Jean"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Dupont"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Email administrateur *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="admin@sdis75.fr"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Mot de passe *
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="••••••••"
        />
      </div>
    </div>
  )
}

function StepModules({
  modules,
  selectedModules,
  toggleModule,
}: {
  modules: Module[]
  selectedModules: string[]
  toggleModule: (id: string) => void
}) {
  const categories = ["RH", "Communication", "Gestion"]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-neutral-900">Sélectionnez vos modules</h2>
      <p className="text-neutral-600">
        Pack de base (270€) inclus : Dashboard, Gestion des utilisateurs, Paramètres
      </p>

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-800">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {modules
              .filter((m) => m.category === category)
              .map((module) => {
                const isSelected = selectedModules.includes(module.id)
                return (
                  <button
                    key={module.id}
                    onClick={() => toggleModule(module.id)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary-light"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900">{module.name}</h4>
                        <p className="text-sm text-neutral-600 mt-1">{module.description}</p>
                      </div>
                      <span className="ml-4 font-bold text-primary">{module.price.toFixed(2)}€</span>
                    </div>
                  </button>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}

function StepRecap({
  organizationName,
  email,
  firstName,
  lastName,
  selectedModuleNames,
  basePrice,
  modulesTotal,
  totalPrice,
}: {
  organizationName: string
  email: string
  firstName: string
  lastName: string
  selectedModuleNames: string[]
  basePrice: number
  modulesTotal: number
  totalPrice: number
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-neutral-900">Récapitulatif</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-neutral-600">Organisation</h3>
          <p className="text-lg font-semibold text-neutral-900">{organizationName}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-neutral-600">Administrateur</h3>
          <p className="text-lg font-semibold text-neutral-900">
            {firstName} {lastName} ({email})
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-neutral-600 mb-2">Modules sélectionnés</h3>
          <div className="flex flex-wrap gap-2">
            {selectedModuleNames.map((name) => (
              <span
                key={name}
                className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-neutral-700">
              <span>Pack de base</span>
              <span className="font-semibold">{basePrice.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Modules supplémentaires ({selectedModuleNames.length})</span>
              <span className="font-semibold">{modulesTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t">
              <span>Total mensuel</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
