"use client"

import { Card } from "@/components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Progress } from "@/components/ui/progress"
import { Mail, MapPin, FileIcon, CheckCircle2, Clock } from "lucide-react"

export default function DashboardUserPage() {
  const applicationSteps = [
    { title: "Dossier d'inscription", date: "Complet", status: "completed" },
    { title: "Test sportif", date: "12 Octobre 2024", status: "completed" },
    { title: "Visite médicale", date: "En cours", status: "current" },
    { title: "Test théorique", date: "À venir", status: "upcoming" },
    { title: "Entretien de recrutement", date: "À venir", status: "upcoming" },
    { title: "Formation initiale", date: "À venir", status: "upcoming" },
  ]

  const recentDocuments = [
    { name: "Carte d'identité.pdf", size: "2.4 Mo", date: "12/09/2024" },
    { name: "Permis de conduire.pdf", size: "1.8 Mo", date: "12/09/2024" },
    { name: "Diplôme_Bac.pdf", size: "3.1 Mo", date: "10/09/2024" },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#132E49]">Bonjour, Jean !</h1>
        <p className="text-gray-500">Ravi de vous revoir. Voici où en est votre candidature.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Application Tracking */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 border-none shadow-sm rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#132E49]">Suivi de candidature</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#132E49]">Phase 3/6</span>
                <div className="w-32">
                  <Progress value={50} className="h-2" />
                </div>
              </div>
            </div>
            <div className="relative space-y-6">
              {/* Vertical line connector */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />

              {applicationSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  <div className={`z-10 w-6 h-6 rounded-half flex items-center justify-center ${step.status === 'completed' ? 'bg-[#132E49] text-white' :
                    step.status === 'current' ? 'bg-orange-100 text-[#EA8B48] border-2 border-[#EA8B48]' :
                      'bg-white border-2 border-gray-200'
                    }`}>
                    {step.status === 'completed' ? <CheckCircle2 size={14} /> :
                      step.status === 'current' ? <Clock size={14} /> : null}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold ${step.status === 'current' ? 'text-[#132E49]' : 'text-gray-900'}`}>{step.title}</h3>
                      <span className={`text-sm ${step.status === 'completed' ? 'text-green-500 font-medium' : 'text-gray-400'}`}>
                        {step.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Documents Section */}
          <Card className="p-6 border-none shadow-sm rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#132E49]">Document ajouté</h2>
              <button className="text-sm font-bold text-[#132E49] hover:underline">Voir tout</button>
            </div>
            <div className="space-y-4">
              {recentDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <FileIcon className="text-[#132E49]" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[#132E49] text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-400">{doc.size} • {doc.date}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12.5V3.33334" stroke="#132E49" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6.66663 9.16666L9.99996 12.5L13.3333 9.16666" stroke="#132E49" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16.6666 13.3333V15.8333C16.6666 16.2754 16.491 16.6993 16.1785 17.0118C15.8659 17.3244 15.442 17.5 15 17.5H5C4.55794 17.5 4.13402 17.3244 3.82145 17.0118C3.50889 16.6993 3.3333 16.2754 3.3333 15.8333V13.3333" stroke="#132E49" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Recruiter Info */}
        <div className="space-y-8">
          <Card className="p-8 border-none shadow-sm rounded-3xl bg-[#EA8B48] text-white">
            <h2 className="text-lg font-bold mb-6">Votre recruteur</h2>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-white/20 p-1 mb-4 relative overflow-hidden">
                <Avatar className="w-full h-full">
                  <AvatarImage src="/assets/images/recruiter.png" />
                  <AvatarFallback className="bg-white/10 text-xl font-bold">DM</AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-bold mb-1">Delcourt Martin</h3>
              <p className="text-white/80 text-sm mb-6">Adjudant-chef</p>

              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                  <Mail size={18} className="shrink-0" />
                  <span className="text-sm truncate">m.delcourt@sdis75.fr</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                  <MapPin size={18} className="shrink-0" />
                  <span className="text-sm truncate">Caserne de Chaligny</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
            <h2 className="text-lg font-bold text-[#132E49] mb-4">Besoin d'aide ?</h2>
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

