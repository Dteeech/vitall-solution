"use client"

import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Check, ChevronRight, ChevronLeft, Upload, MapPin, Search, FileText, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/shadcn-io/progress"

const STEPS = [
  "Vos informations",
  "Votre candidature",
  "Vos documents",
  "Vos diplômes",
  "Récapitulatif",
  "La caserne",
  "Envoi"
]

export default function CandidateApplyPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#132E49]">Dossier de candidature</h1>
              <p className="text-gray-500">Étape {currentStep} sur 7 : {STEPS[currentStep - 1]}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#132E49]">{Math.round((currentStep / 7) * 100)}% complété</span>
            </div>
          </div>

          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${i + 1 <= currentStep ? 'bg-[#132E49]' : 'bg-gray-200'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-12">
          {currentStep === 1 && <Step1Informations />}
          {currentStep === 2 && <Step2Candidature />}
          {currentStep === 3 && <Step3Documents />}
          {currentStep === 4 && <Step4Diplomes />}
          {currentStep === 5 && <Step5Recapitulatif />}
          {currentStep === 6 && <Step6Caserne />}
          {currentStep === 7 && <Step7Envoi />}
        </div>

        {/* Navigation */}
        {currentStep < 7 && (
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 font-bold text-sm transition-opacity ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-[#132E49]'
                }`}
            >
              <ChevronLeft size={18} />
              Précédent
            </button>
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-[#132E49] text-white rounded-2xl font-bold text-sm hover:bg-[#1a3f66] transition-all shadow-md group"
            >
              {currentStep === 6 ? 'Envoyer mon dossier' : 'Étape suivante'}
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Step1Informations() {
  return (
    <Card className="p-8 border-none shadow-sm rounded-3xl bg-white space-y-8">
      <h2 className="text-xl font-bold text-[#132E49]">Vos informations personnelles</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prénom</label>
          <input type="text" placeholder="Jean" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#132E49] transition-all font-medium text-[#132E49]" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nom</label>
          <input type="text" placeholder="Dupont" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#132E49] transition-all font-medium text-[#132E49]" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date de naissance</label>
          <input type="date" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#132E49] transition-all font-medium text-[#132E49]" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lieu de naissance</label>
          <input type="text" placeholder="Paris" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#132E49] transition-all font-medium text-[#132E49]" />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Adresse de résidence</label>
          <input type="text" placeholder="26 Rue de la Paix" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#132E49] transition-all font-medium text-[#132E49]" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Code postal</label>
          <input type="text" placeholder="75000" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#132E49] transition-all font-medium text-[#132E49]" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ville</label>
          <input type="text" placeholder="Paris" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#132E49] transition-all font-medium text-[#132E49]" />
        </div>
        <div className="space-y-2 text-[#132E49]">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Numéro de téléphone</label>
          <div className="flex items-center bg-gray-50 rounded-2xl px-4">
            <span className="font-bold border-r border-gray-200 pr-4 mr-4 py-4">+33</span>
            <input type="tel" placeholder="6 12 34 56 78" className="bg-transparent border-none focus:ring-0 w-full font-medium" />
          </div>
        </div>
      </div>
    </Card>
  )
}

function Step2Candidature() {
  return (
    <Card className="p-8 border-none shadow-sm rounded-3xl bg-white space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#132E49]">Votre candidature</h2>
        <p className="text-gray-500 text-sm mt-1">Téléversez les deux documents essentiels pour votre dossier.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadBox title="Curriculum Vitae (CV)" description="Format PDF uniquement" />
        <UploadBox title="Lettre de motivation" description="Expliquez vos motivations" />
      </div>
    </Card>
  )
}

function Step3Documents() {
  return (
    <Card className="p-8 border-none shadow-sm rounded-3xl bg-white space-y-8">
      <h2 className="text-xl font-bold text-[#132E49]">Documents administratifs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadBox title="Carte d'identité" description="Recto / Verso" />
        <UploadBox title="Attestation de droits" description="Imeli / Sécurité Sociale" />
        <UploadBox title="Relevé d'identité bancaire (RIB)" description="Pour les indemnités" />
        <UploadBox title="Certificat médical" description="De moins de 3 mois" />
      </div>
    </Card>
  )
}

function Step4Diplomes() {
  return (
    <Card className="p-8 border-none shadow-sm rounded-3xl bg-white space-y-8">
      <h2 className="text-xl font-bold text-[#132E49]">Vos diplômes & Attestations</h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center py-12">
          <div className="bg-white p-3 rounded-full shadow-sm mb-4">
            <Upload className="text-[#132E49]" size={24} />
          </div>
          <p className="font-bold text-[#132E49]">Ajouter un diplôme</p>
          <p className="text-xs text-gray-400 mt-1">Glissez-déposez vos fichiers ou cliquez ici</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {["Diplôme de Baccalauréat", "Attestation PSC1"].map((diploma, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <FileText className="text-[#132E49]" size={20} />
                <span className="font-bold text-[#132E49] text-sm">{diploma}</span>
              </div>
              <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function Step5Recapitulatif() {
  return (
    <div className="space-y-8">
      <Card className="p-8 border-none shadow-sm rounded-3xl bg-white">
        <h2 className="text-xl font-bold text-[#132E49] mb-6">Récapitulatif de votre dossier</h2>
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-gray-400 font-medium">Informations personnelles</span>
            <button className="text-[#132E49] font-bold text-sm">Modifier</button>
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Identité</p>
              <p className="font-bold text-[#132E49]">Jean Dupont</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Date de naissance</p>
              <p className="font-bold text-[#132E49]">12 Mai 1995</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-bold text-gray-400 uppercase">Adresse</p>
              <p className="font-bold text-[#132E49]">26 Rue de la Paix, 75000 Paris</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 border-none shadow-sm rounded-3xl bg-white">
        <h2 className="text-lg font-bold text-[#132E49] mb-6">Documents joints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["CV.pdf", "Motivation.pdf", "CNI.png", "RIB.pdf"].map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm font-bold text-[#132E49]">{file}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function Step6Caserne() {
  return (
    <Card className="p-8 border-none shadow-sm rounded-3xl bg-white space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#132E49]">Sélection de la caserne de recrutement</h2>
        <p className="text-gray-500 text-sm mt-1">Choisissez le centre de secours le plus proche de chez vous.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Rechercher une ville, un code postal..." className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#132E49] transition-all font-medium text-[#132E49]" />
      </div>

      <div className="space-y-4">
        {[
          { name: "Caserne de Chaligny", address: "26 Rue de Chaligny, 75012 Paris", distance: "1.2 km" },
          { name: "Caserne Rousseau", address: "21 Rue du Jour, 75001 Paris", distance: "3.5 km" },
          { name: "Caserne Port-Royal", address: "55 Bd de Port-Royal, 75013 Paris", distance: "4.8 km" },
        ].map((caserne, i) => (
          <div key={i} className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${i === 0 ? 'border-[#132E49] bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${CasIconColor(i)}`}>
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-bold text-[#132E49]">{caserne.name}</p>
                <p className="text-sm text-gray-500">{caserne.address}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#132E49]">{caserne.distance}</p>
              {i === 0 && <span className="text-[10px] font-bold uppercase bg-[#132E49] text-white px-2 py-0.5 rounded-full">Sélectionné</span>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function Step7Envoi() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-8 bg-white rounded-[50px] shadow-sm border border-gray-100">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
        <Check size={48} strokeWidth={3} />
      </div>
      <h2 className="text-3xl font-bold text-[#132E49] mb-4">Votre dossier a été envoyé !</h2>
      <p className="text-gray-500 max-w-lg mb-10 text-lg">
        Félicitations ! Votre candidature est désormais entre les mains de nos recruteurs. Vous recevrez une notification par e-mail dès qu'il y aura du nouveau sur votre dossier.
      </p>
      <button className="px-10 py-4 bg-[#132E49] text-white rounded-2xl font-bold text-lg hover:bg-[#1a3f66] transition-all shadow-xl">
        Accéder à mon tableau de bord
      </button>
    </div>
  )
}

function UploadBox({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center py-8 hover:border-[#132E49] hover:bg-white transition-all group cursor-pointer">
      <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:bg-[#132E49] group-hover:text-white transition-colors">
        <Upload size={20} />
      </div>
      <p className="text-sm font-bold text-[#132E49]">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  )
}

function CasIconColor(i: number) {
  switch (i) {
    case 0: return "bg-[#132E49] text-white";
    default: return "bg-white text-gray-400 shadow-sm";
  }
}
