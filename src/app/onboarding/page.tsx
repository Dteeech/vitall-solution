"use client"

import { useState } from "react"
import { PrimaryButton, SecondaryButton } from "@/components/ui"
import Image from "next/image"

type Step = 1 | 2 | 3 | 4

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1)

  const next = () => setStep((s) => (s < 4 ? ((s + 1) as Step) : s))
  const prev = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))

  return (
    <main className="flex min-h-screen bg-neutral-100 p-6">
      <aside className="hidden xl:block w-[473px] rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-primary-light" />
        <div className="relative z-10 w-full h-full">
          <Image src="/assets/images/onboarding.png" alt="Illustration" fill className="object-cover w-full h-full" />
        </div>
      </aside>

      <section className="flex-1 flex items-center">
        <div className="w-full max-w-3xl mx-auto pt-24 px-8">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">Création de votre compte</h1>
          </header>

          <Stepper step={step} />

          <div className="mt-8">
            {step === 1 && <StepConnexion />}
            {step === 2 && <StepSecurite />}
            {step === 3 && <StepProfil />}
            {step === 4 && <StepCaserne />}
          </div>

          <div className="mt-8 flex justify-end gap-4">
            {step > 1 && <SecondaryButton label="Annuler" onClick={prev} />}
            <PrimaryButton label={step === 4 ? "Terminer" : "Suivant"} onClick={next} />
          </div>
        </div>
      </section>
    </main>
  )
}

function Stepper({ step }: { step: Step }) {
  const items = ["Connexion", "Sécurité", "Profil", "Caserne"]
  return (
    <div className="flex items-center gap-4">
      {items.map((label, i) => {
        const index = (i + 1) as Step
        const active = step === index
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`${
                active
                  ? "bg-secondary-900 text-white border-secondary-900"
                  : "border-secondary-900 text-secondary-900"
              } border rounded-full h-7 w-7 flex items-center justify-center text-xs font-semibold`}
            >
              {index}
            </div>
            <span className={`${active ? "text-secondary-900" : "text-neutral-900"} text-sm font-semibold`}>{label}</span>
            {i < items.length - 1 && <div className="w-24 h-[2px] bg-neutral-300" />}
          </div>
        )
      })}
    </div>
  )
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 w-full text-secondary-900">
      <div className="flex items-start gap-2">
        <label className="text-secondary-900 text-base font-semibold">
          {label} {required && <span className="text-error">*</span>}
        </label>
      </div>
      {children}
      {hint && <p className="text-sm italic text-secondary-900/80">{hint}</p>}
    </div>
  )
}

function TextInputBase({ type = "text", placeholder = "Placeholder" }: { type?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="h-11 w-full rounded-lg border border-neutral-400 px-4 text-sm text-neutral-800 placeholder-neutral-600 bg-white outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
      aria-label={placeholder}
    />
  )
}

function StepConnexion() {
  return (
    <div className="flex flex-col gap-6 items-end">
      <Field label="Identifiant" required hint="Commençant par X9">
        <TextInputBase />
      </Field>
      <Field label="Mot de passe" required hint="Code à 6 chiffres">
        <TextInputBase type="password" />
      </Field>
    </div>
  )
}

function StepSecurite() {
  return (
    <div className="flex flex-col gap-6 items-start">
      <Field label="Email professionnel" required>
        <TextInputBase type="email" />
      </Field>
      <Field label="Nouveau mot de passe" required>
        <TextInputBase type="password" />
      </Field>
      <Field label="Confirmer le mot de passe" required>
        <TextInputBase type="password" />
      </Field>
      <label className="flex items-center gap-2 text-secondary-900 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-secondary-900 text-secondary-900 focus:ring-primary"
        />
        Mémoriser mon mot de passe
      </label>
    </div>
  )
}

function StepProfil() {
  return (
    <div className="flex flex-col gap-6 items-start">
      <Field label="Nom" required>
        <TextInputBase />
      </Field>
      <Field label="Prénom" required>
        <TextInputBase />
      </Field>
      <Field label="Email professionnel" required>
        <TextInputBase type="email" />
      </Field>
      <Field label="Téléphone professionnel">
        <TextInputBase type="tel" />
      </Field>
      <Field label="Photo de profil" hint="Format accepté : PDF, JPG, JPEG — Taille max : 1 Mo">
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-900 hover:bg-secondary-800 text-white rounded-lg font-medium">
            Sélectionnez votre fichier
          </button>
          <span className="text-sm">Aucun fichier sélectionné</span>
        </div>
      </Field>

      <Field label="Ajouter un document" hint="PDF, JPG, JPEG — Taille max : 5 Mo">
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-900 hover:bg-secondary-800 text-white rounded-lg font-medium">
            Ajouter un document
          </button>
          <span className="text-sm">Aucun document ajouté</span>
        </div>
      </Field>
    </div>
  )
}

function StepCaserne() {
  return (
    <div className="flex flex-col gap-6 items-start">
      <Field label="Type de caserne" required>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-secondary-900 text-sm">
            <input type="radio" name="type_caserne" className="h-4 w-4 border-secondary-900 text-secondary-900 focus:ring-primary" />
            Caserne en poste gardée
          </label>
          <label className="flex items-center gap-2 text-secondary-900 text-sm">
            <input type="radio" name="type_caserne" className="h-4 w-4 border-secondary-900 text-secondary-900 focus:ring-primary" />
            Caserne en astreinte
          </label>
          <label className="flex items-center gap-2 text-secondary-900 text-sm">
            <input type="radio" name="type_caserne" className="h-4 w-4 border-secondary-900 text-secondary-900 focus:ring-primary" />
            Caserne en garde mixte
          </label>
        </div>
      </Field>

      <Field label="Actuellement en besoin" required>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-secondary-900 text-sm">
            <input type="radio" name="besoin" className="h-4 w-4 border-secondary-900 text-secondary-900 focus:ring-primary" /> Oui
          </label>
          <label className="flex items-center gap-2 text-secondary-900 text-sm">
            <input type="radio" name="besoin" className="h-4 w-4 border-secondary-900 text-secondary-900 focus:ring-primary" /> Non
          </label>
        </div>
      </Field>

      <Field label="Adresse">
        <TextInputBase />
      </Field>
    </div>
  )
}
// Fin des étapes d'onboarding
