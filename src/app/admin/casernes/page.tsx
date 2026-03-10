'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Search, MapPin, Phone, MessageSquare, Filter, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const CASERNES_LIST = [
  { id: 1, name: "CIS Le Loroux", posts: 3 },
  { id: 2, name: "CIS Nantes-Nord", posts: 1, current: true },
  { id: 3, name: "CIS SPGL", posts: 3 },
  { id: 4, name: "CIS Rezé", posts: 3 },
  { id: 5, name: "CIS Vertou", posts: 3 },
  { id: 6, name: "CIS Clisson", posts: 3 },
  { id: 7, name: "CIS Bouaye", posts: 3 },
  { id: 8, name: "CIS Pornic", posts: 3 },
]

export default function AdminCasernesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState(2)

  return (
    <main className="flex-1 h-screen bg-[#F9FAFB] overflow-hidden flex flex-col">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold text-[#131315]">Casernes</h1>
        <p className="text-[#969390] text-sm">16 casernes</p>
      </div>

      <div className="flex-1 flex overflow-hidden p-8 pt-0 gap-6">
        {/* Left Panel - List */}
        <div className="w-80 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700">
              <Filter className="size-4" />
              Filtrer
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-hide">
            <Badge variant="secondary" className="bg-[#1E293B] text-white hover:bg-[#1E293B] whitespace-nowrap">Postes ouverts ×</Badge>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {CASERNES_LIST.map((caserne) => (
              <button
                key={caserne.id}
                onClick={() => setSelectedId(caserne.id)}
                className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-colors ${selectedId === caserne.id
                    ? 'bg-[#1E293B] text-white'
                    : 'bg-white text-[#131315] hover:bg-gray-50 border border-transparent hover:border-gray-100'
                  }`}
              >
                <span className="font-bold text-sm">{caserne.name}</span>
                <Badge className={selectedId === caserne.id ? 'bg-white/20 text-white border-none' : 'bg-gray-100 text-gray-600 border-none'}>
                  {caserne.posts} postes
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Detail */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <Card className="flex-1 p-8 rounded-[32px] border-none shadow-sm flex flex-col gap-8 bg-white overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-[#131315]">CIS Nantes-Nord</h2>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-medium">
                    Caserne en astreinte
                  </Badge>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-5 flex items-center justify-center text-[#969390]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Chef de caserne</p>
                      <p className="text-sm font-bold text-[#131315]">Jérôme Noël</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="size-5 text-[#969390]" />
                    <p className="text-sm font-bold text-[#131315]">Nantes • Nord</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-[#131315]">
                  <MessageSquare className="size-5" />
                </button>
                <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-[#131315]">
                  <Phone className="size-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Besoins</h3>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="size-2 rounded-full bg-orange-500" />
                <p className="text-sm font-bold text-[#131315]">1 poste ouvert</p>
              </div>
            </div>

            <div className="flex-1 min-h-[300px] relative rounded-3xl overflow-hidden border border-gray-100 bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2709.766185694563!2d-1.5451864!3d47.2211571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4805ef99288bf609%3A0x437d3a67c7ba5fbb!2sCentre%20d&#39;Incendie%20et%20de%20Secours%20Nantes%20Gouz%C3%A9!5e0!3m2!1sfr!2sfr!4v1772657067396!5m2!1sfr!2sfr"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                title="Carte"
              ></iframe>
              <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                <span className="bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm text-[10px] font-bold text-gray-500 uppercase">Orvault</span>
                <span className="bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm text-[10px] font-bold text-gray-500 uppercase">Nantes Nord</span>
              </div>
              <div className="absolute bottom-8 right-8 pointer-events-none text-right">
                <p className="text-4xl font-black text-[#132E49]/10 uppercase select-none">Nantes</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
