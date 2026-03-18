"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, ChevronLeft, Paperclip, Loader2 } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Organization {
  id: string
  name: string
  address: string | null
}

interface FormData {
  // Step 1 — Informations
  lastName: string
  firstName: string
  birthDate: string
  birthCity: string
  address: string
  email: string
  postalCode: string
  phone: string
  // Step 2 — Candidature
  cvFile: File | null
  motivationFile: File | null
  // Step 3 — Documents
  attestationFile: File | null
  domicileFile: File | null
  ribFile: File | null
  isProfessional: boolean
  ficheEmployeurFile: File | null
  certificatFile: File | null
  // Step 4 — Diplômes
  profile: "nouveau" | "spv"
  serviceCiviqueFile: File | null
  militaireFile: File | null
  charteAccepted: boolean
  rgpdAccepted: boolean
  // Step 6 — Caserne
  selectedOrgId: string | null
}

const STEPS = [
  "Vos informations",
  "Votre candidature",
  "Vos documents",
  "Vos diplômes",
  "Récapitulatif",
  "La caserne",
  "Envoi",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StepBadge({ status }: { status: "done" | "current" | "todo" }) {
  if (status === "done")
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#132E49] text-white">Terminé</span>
  if (status === "current")
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#3B82F6]/20 text-[#3B82F6]">En cours</span>
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-400">À remplir</span>
}

function Stepper({ current, completed }: { current: number; completed: number[] }) {
  return (
    <div className="flex items-start gap-0 mb-10 overflow-x-auto pb-2">
      {STEPS.map((label, idx) => {
        const stepNum = idx + 1
        const isDone = completed.includes(stepNum)
        const isCurrent = stepNum === current
        const status = isDone ? "done" : isCurrent ? "current" : "todo"

        return (
          <div key={stepNum} className="flex items-start flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0">
              {/* circle + line */}
              <div className="flex items-center w-full">
                <div
                  className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    isDone
                      ? "bg-[#132E49] border-[#132E49]"
                      : isCurrent
                      ? "bg-white border-[#132E49]"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {isDone ? (
                    <Check size={13} className="text-white" strokeWidth={3} />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#132E49]" />
                  ) : null}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 ${isDone ? "bg-[#132E49]" : "bg-gray-200"}`} />
                )}
              </div>
              {/* label + badge */}
              <div className="mt-1.5 text-center px-1 w-full min-w-0">
                <p className={`text-[10px] font-semibold truncate ${isCurrent || isDone ? "text-[#132E49]" : "text-gray-400"}`}>
                  Étape {stepNum}
                </p>
                <p className={`text-[10px] truncate mb-1 ${isCurrent || isDone ? "text-[#132E49]" : "text-gray-400"}`}>
                  {label}
                </p>
                <StepBadge status={status} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function UploadButton({ label, file, onChange, required }: {
  label: string
  file: File | null
  onChange: (f: File | null) => void
  required?: boolean
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-[#132E49]">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#132E49] text-white text-sm font-medium rounded-md cursor-pointer hover:bg-[#1a3f66] transition-colors">
        <Paperclip size={15} />
        {file ? file.name : "Sélectionnez votre fichier"}
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => onChange(e.target.files?.[0] ?? null)} />
      </label>
      <p className="text-xs text-gray-400">Format de document accepté : PDF, JPG, PNG</p>
      <p className="text-xs text-gray-400">Taille maximale autorisée : 10 Mo</p>
    </div>
  )
}

function SectionTitle({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      <p className="text-xs font-semibold text-gray-400 mb-0.5">Étape {step}</p>
      <h2 className="text-lg font-bold text-[#132E49]">{title}</h2>
    </div>
  )
}

// ─── Intro ────────────────────────────────────────────────────────────────────

function IntroPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 2L2 8v8c0 8.837 5.926 14.82 14 16 8.074-1.18 14-7.163 14-16V8L16 2z" fill="#132E49" />
            </svg>
          </div>
          <span className="font-bold text-lg text-[#132E49]">Vitall</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#132E49] mb-3">Création de votre dossier de candidature</h1>
          <p className="text-gray-500 text-sm">Vous allez commencer la création de votre dossier pour devenir sapeur-pompier volontaire.</p>
          <p className="text-gray-500 text-sm mt-2">Cette étape prend environ <strong>10 minutes.</strong></p>
          <p className="text-sm text-gray-600 mt-4 max-w-2xl mx-auto">
            Nous vous recommandons de préparer à l&apos;avance les documents personnels suivants, selon votre profil :{" "}
            <strong>Tous les candidats, candidat mineur ou SPV en activité.</strong>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Les documents listés dans la catégorie <strong>« Tous les candidats »</strong> sont obligatoires, quel que soit votre profil.
          </p>
        </div>

        {/* Documents table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-[#132E49]">Document</th>
                <th className="text-center px-4 py-3 font-semibold text-[#132E49]">Tous les candidats</th>
                <th className="text-center px-4 py-3 font-semibold text-[#132E49]">SPV en activité</th>
                <th className="text-center px-4 py-3 font-semibold text-[#132E49]">Candidat mineur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Carte nationale d'identité ou passeport (recto/verso)", true, false, "Requis"],
                ["Permis de conduire", true, false, "Optionnel"],
                ["Titre de séjour", true, false, "Optionnel"],
                ["CV", true, false, "Requis"],
                ["Lettre de motivation", true, false, "Requis"],
              ].map(([doc, all, spv, mineur], i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#132E49] rounded-sm shrink-0" />
                      {doc as string}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {all && <span className="text-[10px] font-bold bg-[#EA8B48] text-white px-2 py-0.5 rounded">PDF, JPG, PNG</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400 text-xs">{spv ? "Requis" : "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium ${mineur === "Requis" ? "text-[#132E49]" : "text-gray-400"}`}>{mineur as string}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#EA8B48] text-white font-bold rounded-md hover:bg-[#d97a3a] transition-colors"
          >
            Créer mon dossier
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
  return (
    <div>
      <SectionTitle step={1} title="Vos informations" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-[#132E49] mb-1">Nom <span className="text-red-500">*</span></label>
          <input value={data.lastName} onChange={e => onChange({ lastName: e.target.value })} placeholder="Votre nom" className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#132E49]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#132E49] mb-1">Prénom <span className="text-red-500">*</span></label>
          <input value={data.firstName} onChange={e => onChange({ firstName: e.target.value })} placeholder="Votre prénom" className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#132E49]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#132E49] mb-1">Date de naissance <span className="text-red-500">*</span></label>
          <input type="date" value={data.birthDate} onChange={e => onChange({ birthDate: e.target.value })} className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#132E49]" />
          <p className="text-xs text-gray-400 mt-1">Format attendu : JJ/MM/AAAA</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#132E49] mb-1">Ville de naissance <span className="text-red-500">*</span></label>
          <input value={data.birthCity} onChange={e => onChange({ birthCity: e.target.value })} placeholder="Votre ville" className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#132E49]" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-[#132E49] mb-1">Adresse postale <span className="text-red-500">*</span></label>
          <input value={data.address} onChange={e => onChange({ address: e.target.value })} placeholder="Votre adresse" className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#132E49]" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-[#132E49] mb-1">Adresse email <span className="text-red-500">*</span></label>
          <input type="email" value={data.email} onChange={e => onChange({ email: e.target.value })} placeholder="Votre email" className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#132E49]" />
          <p className="text-xs text-gray-400 mt-1">Ex : exemple@domaine.com</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#132E49] mb-1">Code postal <span className="text-red-500">*</span></label>
          <input value={data.postalCode} onChange={e => onChange({ postalCode: e.target.value })} placeholder="00000" className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#132E49]" />
          <p className="text-xs text-gray-400 mt-1">Ex : 44100</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#132E49] mb-1">N° de téléphone <span className="text-red-500">*</span></label>
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#132E49]">
            <span className="px-3 py-2.5 bg-gray-50 text-sm font-medium text-[#132E49] border-r border-gray-200">+33</span>
            <input value={data.phone} onChange={e => onChange({ phone: e.target.value })} placeholder="0 00 00 00 00" className="flex-1 px-3 py-2.5 text-sm focus:outline-none" />
          </div>
          <p className="text-xs text-gray-400 mt-1">Ex : +33 6 65 90 38 92</p>
        </div>
      </div>
    </div>
  )
}

function Step2({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
  return (
    <div>
      <SectionTitle step={2} title="Votre candidature" />
      <p className="text-sm text-gray-500 mb-6">
        Ces documents permettent à nos recruteurs d&apos;évaluer votre motivation et votre engagement à devenir sapeur-pompier volontaire.
        C&apos;est une démarche importante qui mérite réflexion, car cet engagement ne doit pas être pris à la légère.
      </p>
      <div className="space-y-6">
        <UploadButton label="CV" required file={data.cvFile} onChange={f => onChange({ cvFile: f })} />
        <UploadButton label="Lettre de motivation" required file={data.motivationFile} onChange={f => onChange({ motivationFile: f })} />
      </div>
    </div>
  )
}

function Step3({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
  return (
    <div>
      <SectionTitle step={3} title="Vos documents" />
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <UploadButton label="Attestation d'assuré social" required file={data.attestationFile} onChange={f => onChange({ attestationFile: f })} />
          <UploadButton label="Justificatif de domicile (< 3 mois)" required file={data.domicileFile} onChange={f => onChange({ domicileFile: f })} />
          <UploadButton label="RIB (compte au nom du candidat)" required file={data.ribFile} onChange={f => onChange({ ribFile: f })} />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.isProfessional}
            onChange={e => onChange({ isProfessional: e.target.checked })}
            className="w-4 h-4 accent-[#132E49]"
          />
          <span className="text-sm text-[#132E49]">J&apos;exerce actuellement une activité professionnelle</span>
        </label>

        {data.isProfessional && (
          <UploadButton label="Fiche employeur SPV" required file={data.ficheEmployeurFile} onChange={f => onChange({ ficheEmployeurFile: f })} />
        )}

        <div>
          <h3 className="text-sm font-bold text-[#132E49] mb-4">Vos documents de santés</h3>
          <UploadButton label="Certificat médical d'aptitude" required file={data.certificatFile} onChange={f => onChange({ certificatFile: f })} />
        </div>
      </div>
    </div>
  )
}

function Step4({ data, onChange }: { data: FormData; onChange: (d: Partial<FormData>) => void }) {
  return (
    <div>
      <SectionTitle step={4} title="Vos diplômes" />
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-[#132E49] mb-3">Quel est votre profil ? <span className="text-red-500">*</span></p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="profile" value="nouveau" checked={data.profile === "nouveau"} onChange={() => onChange({ profile: "nouveau" })} className="accent-[#132E49]" />
              <span className="text-sm text-gray-700">Je souhaite devenir sapeur pompier</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="profile" value="spv" checked={data.profile === "spv"} onChange={() => onChange({ profile: "spv" })} className="accent-[#132E49]" />
              <span className="text-sm text-gray-700">Je suis un sapeur-pompier volontaire et je souhaite changer de caserne</span>
            </label>
          </div>
        </div>

        <UploadButton label="Justificatif de service civique" required file={data.serviceCiviqueFile} onChange={f => onChange({ serviceCiviqueFile: f })} />
        <UploadButton label="Attestation militaire (ou JDC)" required file={data.militaireFile} onChange={f => onChange({ militaireFile: f })} />

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={data.charteAccepted} onChange={e => onChange({ charteAccepted: e.target.checked })} className="w-4 h-4 mt-0.5 accent-[#132E49]" />
            <span className="text-sm text-gray-600">
              En cochant cette case, je reconnais avoir pris connaissance de la{" "}
              <strong className="text-[#132E49]">Charte nationale du sapeur-pompier volontaire</strong>{" "}
              et m&apos;engage à la respecter.
            </span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={data.rgpdAccepted} onChange={e => onChange({ rgpdAccepted: e.target.checked })} className="w-4 h-4 mt-0.5 accent-[#132E49]" />
            <span className="text-sm text-gray-600">
              En cochant cette case, je reconnais avoir pris connaissance de la mention d&apos;information relative à la collecte et au traitement de mes données personnelles,
              conformément aux articles 13 et 14 du{" "}
              <strong className="text-[#132E49]">Règlement Général sur la Protection des Données (RGPD)</strong>.
              J&apos;accepte que mes données soient utilisées dans le cadre de ma candidature en tant que sapeur-pompier volontaire,
              selon les finalités précisées dans la <strong className="text-[#132E49] underline cursor-pointer">politique de confidentialité</strong>.
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

function Step5({ data, onEdit }: { data: FormData; onEdit: (step: number) => void }) {
  const rows: [string, string][] = [
    ["Nom :", data.lastName || "—"],
    ["Prénom :", data.firstName || "—"],
    ["Date de naissance :", data.birthDate || "—"],
    ["Ville de naissance :", data.birthCity || "—"],
    ["Adresse postal :", data.address || "—"],
    ["Adresse email :", data.email || "—"],
    ["Code postal :", data.postalCode || "—"],
    ["N° de téléphone :", data.phone ? `+33 ${data.phone}` : "—"],
    ["Mineur :", "Non"],
  ]

  const docs: [string, File | null][] = [
    ["CV", data.cvFile],
    ["Lettre de motivation", data.motivationFile],
    ["Attestation d'assuré social", data.attestationFile],
    ["Justificatif de domicile", data.domicileFile],
    ["RIB", data.ribFile],
    ["Certificat médical", data.certificatFile],
  ]

  return (
    <div>
      <SectionTitle step={5} title="Récapitulatif de vos informations" />
      <div className="space-y-6">
        {/* Vos informations */}
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400">Étape 1</p>
              <p className="font-bold text-[#132E49]">Vos informations</p>
            </div>
            <button
              onClick={() => onEdit(1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#132E49] border border-[#132E49] rounded-md px-3 py-1.5 hover:bg-gray-50"
            >
              <span>✏</span> Modifier cette étape
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 text-sm">
                <span className="font-medium text-[#132E49]">{label}</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-[#132E49]">Vos documents</p>
            <button
              onClick={() => onEdit(2)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#132E49] border border-[#132E49] rounded-md px-3 py-1.5 hover:bg-gray-50"
            >
              <span>✏</span> Modifier
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {docs.map(([label, file]) => (
              <div
                key={label}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border ${
                  file ? "border-[#132E49] bg-[#132E49]/5 text-[#132E49]" : "border-gray-200 text-gray-400"
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center ${file ? "bg-[#132E49]" : "bg-gray-200"}`}>
                  {file && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step6({
  data,
  onChange,
  organizations,
}: {
  data: FormData
  onChange: (d: Partial<FormData>) => void
  organizations: Organization[]
}) {
  return (
    <div>
      <SectionTitle step={6} title="La caserne" />
      <p className="text-sm text-gray-500 mb-6">
        À partir des informations renseignées dans votre dossier, voici les casernes auxquelles vous êtes éligible.
        Sélectionnez celle que vous souhaitez intégrer, puis validez votre choix pour envoyer votre candidature.
      </p>

      {organizations.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Aucune caserne disponible.</p>
      ) : (
        <div className="space-y-3">
          {organizations.map(org => {
            const isSelected = data.selectedOrgId === org.id || (data.selectedOrgId === null && organizations[0]?.id === org.id)
            return (
              <label
                key={org.id}
                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected ? "border-[#132E49] bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onChange({ selectedOrgId: org.id })}
              >
                <div>
                  <p className="font-bold text-[#132E49]">{org.name}</p>
                  {org.address && <p className="text-sm text-gray-500">{org.address}</p>}
                </div>
                <input
                  type="radio"
                  name="caserne"
                  checked={isSelected}
                  onChange={() => onChange({ selectedOrgId: org.id })}
                  className="accent-[#132E49] w-4 h-4"
                />
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Step7({ onDashboard }: { onDashboard: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Check size={32} className="text-green-600" strokeWidth={3} />
      </div>
      <h2 className="text-2xl font-bold text-[#132E49] mb-3">Dossier envoyé avec succès !</h2>
      <p className="text-gray-500 text-sm mb-2">Votre dossier a bien été transmis à la caserne sélectionnée.</p>
      <p className="text-gray-500 text-sm mb-2">Vous allez recevoir un e-mail récapitulatif contenant les informations de votre candidature.</p>
      <p className="text-gray-500 text-sm mb-2">Vous serez recontacté dans les plus brefs délais.</p>
      <p className="text-gray-500 text-sm mb-8">En attendant, vous pouvez accéder à votre espace candidat pour suivre l&apos;avancement de votre dossier.</p>
      <button
        onClick={onDashboard}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#EA8B48] text-white font-bold rounded-md hover:bg-[#d97a3a] transition-colors"
      >
        Accéder à mon espace candidat
      </button>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CandidateApplyPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [showIntro, setShowIntro] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: user?.lastName || "",
    birthDate: "",
    birthCity: "",
    address: "",
    email: user?.email || "",
    postalCode: "",
    phone: "",
    cvFile: null,
    motivationFile: null,
    attestationFile: null,
    domicileFile: null,
    ribFile: null,
    isProfessional: false,
    ficheEmployeurFile: null,
    certificatFile: null,
    profile: "nouveau",
    serviceCiviqueFile: null,
    militaireFile: null,
    charteAccepted: false,
    rgpdAccepted: false,
    selectedOrgId: null,
  })

  useEffect(() => {
    fetch("/api/organization/list")
      .then(r => r.ok ? r.json() : [])
      .then(setOrganizations)
      .catch(console.error)
  }, [])

  const updateForm = (partial: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...partial }))
  }

  const goNext = async () => {
    if (currentStep === 6) {
      setSubmitting(true)
      try {
        const orgId = formData.selectedOrgId ?? organizations[0]?.id
        const res = await fetch('/api/user/candidature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            organizationId: orgId,
          }),
        })
        if (!res.ok) {
          const data = await res.json()
          console.error('Erreur soumission candidature:', data.error)
          setSubmitting(false)
          return
        }
      } catch (err) {
        console.error('Erreur soumission candidature:', err)
        setSubmitting(false)
        return
      }
      setSubmitting(false)
    }
    setCompletedSteps(prev => prev.includes(currentStep) ? prev : [...prev, currentStep])
    setCurrentStep(prev => Math.min(prev + 1, 7))
  }

  const goPrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const editStep = (step: number) => {
    setCurrentStep(step)
  }

  if (showIntro) {
    return <IntroPage onStart={() => setShowIntro(false)} />
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        {/* Header */}
        <h1 className="text-xl font-bold text-[#132E49] mb-6">Création de votre dossier</h1>

        {/* Stepper */}
        <Stepper current={currentStep} completed={completedSteps} />

        {/* Step content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && <Step1 data={formData} onChange={updateForm} />}
          {currentStep === 2 && <Step2 data={formData} onChange={updateForm} />}
          {currentStep === 3 && <Step3 data={formData} onChange={updateForm} />}
          {currentStep === 4 && <Step4 data={formData} onChange={updateForm} />}
          {currentStep === 5 && <Step5 data={formData} onEdit={editStep} />}
          {currentStep === 6 && <Step6 data={formData} onChange={updateForm} organizations={organizations} />}
          {currentStep === 7 && <Step7 onDashboard={() => router.push("/dashboard")} />}
        </div>

        {/* Navigation */}
        {currentStep < 7 && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={goPrev}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors ${
                currentStep === 1 ? "invisible" : ""
              }`}
            >
              <ChevronLeft size={16} />
              Retour
            </button>
            <button
              onClick={goNext}
              disabled={submitting}
              className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-bold bg-[#EA8B48] text-white rounded-md hover:bg-[#d97a3a] transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : currentStep === 6 ? (
                <>Envoyer mon dossier à cette caserne <ChevronRight size={16} /></>
              ) : (
                <>Suivant <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
