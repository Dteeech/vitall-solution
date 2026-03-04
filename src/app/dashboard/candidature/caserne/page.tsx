"use client"

import { Card } from "@/components/ui/Card"
import { MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CasernePage() {
  const recruiterInfo = [
    { label: "Nom", value: "Delcourt" },
    { label: "Prénom", value: "Martin" },
    { label: "Adresse email", value: "martin.delcourt@gmail.com" },
    { label: "Caserne", value: "Caserne de saint-herblain" },
  ]

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-[#132E49] mb-12">Caserne</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column - Recruiter Identity Card */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="rounded-[40px] overflow-hidden bg-[#FFF0E4] shadow-sm border border-gray-100 h-full">
            <div className="p-8 pb-4 flex flex-col items-center">
              <h2 className="text-base font-bold text-[#132E49] mb-8">Votre recruteur</h2>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm mb-4">
                <Avatar className="w-full h-full">
                  <AvatarImage src="/assets/images/firefighter-avatar.png" />
                  <AvatarFallback className="bg-[#132E49] text-white font-bold">DM</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Info Block with Orange Background */}
            <div className="bg-[#EA8B48] p-6 m-3 rounded-[32px] space-y-4 text-white">
              {recruiterInfo.map((info, i) => (
                <div key={i} className="text-sm">
                  <span className="font-bold">{info.label} : </span>
                  <span className="font-medium opacity-90">{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Caserne Details & Map */}
        <div className="flex-1 space-y-6 w-full">
          {/* Header Card */}
          <div className="bg-[#EAF1F9] rounded-[32px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#132E49]">Caserne de saint-herblain</h2>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">entrée caserne</p>
              <div className="flex items-center gap-2 mt-4 text-[#132E49]">
                <MapPin size={16} />
                <span className="text-sm font-bold">Saint-herblain - Nantes</span>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm self-start md:self-center px-4 py-2 rounded-full">
              <span className="text-[#132E49] text-xs font-bold">À 3.5 Km du candidat</span>
            </div>
          </div>

          {/* Map Card */}
          <Card className="rounded-[32px] p-8 border border-gray-100 shadow-sm bg-white overflow-hidden">
            <h3 className="text-lg font-bold text-[#132E49] mb-8">Localisation</h3>
            <div className="relative rounded-2xl overflow-hidden border border-gray-100">
              {/* Main Map Background */}
              <div className="aspect-[16/9] w-full bg-[#E5E7EB]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2709.766185694563!2d-1.5451864!3d47.2211571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4805ef99288bf609%3A0x437d3a67c7ba5fbb!2sCentre%20d&#39;Incendie%20et%20de%20Secours%20Nantes%20Gouz%C3%A9!5e0!3m2!1sfr!2sfr!4v1772657067396!5m2!1sfr!2sfr"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0"
                ></iframe>
              </div>

              {/* Street names overlay (simulated) */}
              <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                <span className="bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm text-[10px] font-bold text-gray-500 uppercase">Sautron</span>
                <span className="bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm text-[10px] font-bold text-gray-500 uppercase">La Chapelle-sur-Erdre</span>
              </div>
              <div className="absolute bottom-8 right-8 pointer-events-none text-right">
                <p className="text-4xl font-black text-[#132E49]/10 uppercase select-none">Nantes</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
