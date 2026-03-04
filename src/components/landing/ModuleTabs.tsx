"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const modules = [
  {
    id: 'teams',
    title: 'Gestion des équipes',
    description: 'Centralisez le pilotage de vos effectifs et simplifiez la coordination opérationnelle.',
    details: 'Voir plus →',
    color: 'bg-orange-50',
    iconColor: 'bg-orange-100',
    image: '/assets/images/modules.avif',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-6 h-6 fill-[#EA8B49]">
        <g>
          <path d="M168,100a60,60,0,1,1-60-60A60,60,0,0,1,168,100Z" opacity="0.2"></path>
          <path d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"></path>
        </g>
      </svg>
    )
  },
  {
    id: 'inventory',
    title: 'Inventaire et équipements',
    description: 'Suivi en temps réel de votre matériel et maintenance préventive de vos ressources.',
    details: 'Voir plus →',
    color: 'bg-orange-50',
    iconColor: 'bg-orange-100',
    image: '/assets/images/planning.avif',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-6 h-6 fill-[#EA8B49]">
        <g>
          <path d="M216,48V88H40V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z" opacity="0.2"></path>
          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
        </g>
      </svg>
    )
  },
  {
    id: 'recruit',
    title: 'Recrutement',
    description: 'Gérez vos flux de candidatures et recrutez les meilleurs profils pour vos interventions.',
    details: 'Voir plus →',
    color: 'bg-orange-50',
    iconColor: 'bg-orange-100',
    image: '/assets/images/candidatures.avif',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-6 h-6 fill-[#EA8B49]">
        <g>
          <path d="M216,160l-56,56V160Z" opacity="0.2"></path>
          <path d="M88,96a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,96Zm8,40h64a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Zm32,16H96a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16ZM224,48V156.69A15.86,15.86,0,0,1,219.31,168L168,219.31A15.86,15.86,0,0,1,156.69,224H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H152V160a8,8,0,0,1,8-8h48V48H48Zm120-40v28.7L196.69,168Z"></path>
        </g>
      </svg>
    )
  },
  {
    id: 'hr',
    title: 'Gestion RH',
    description: 'Logiciel RH complet pour le suivi des carrières, formations et habilitations.',
    details: 'Voir plus →',
    color: 'bg-orange-50',
    iconColor: 'bg-orange-100',
    image: '/assets/images/modules.avif',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-6 h-6 fill-[#EA8B49]">
        <g>
          <path d="M168,100a60,60,0,1,1-60-60A60,60,0,0,1,168,100Z" opacity="0.2"></path>
          <path d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"></path>
        </g>
      </svg>
    )
  },
  {
    id: 'fleet',
    title: 'Logistique et gestion de flotte',
    description: 'Optimisez vos déplacements et assurez la disponibilité de votre parc automobile.',
    details: 'Voir plus →',
    color: 'bg-orange-50',
    iconColor: 'bg-orange-100',
    image: '/assets/images/planning.avif',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-6 h-6 fill-[#EA8B49]">
        <g>
          <path d="M216,48V88H40V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z" opacity="0.2"></path>
          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
        </g>
      </svg>
    )
  }
]

export const ModuleTabs = () => {
  const [activeTab, setActiveTab] = useState(modules[0].id)

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="bg-[#132E49] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Modules
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#132E49] mt-6 mb-4">
            Un ERP sur mesure construit autour de vos besoins
          </h2>
          <div className="text-gray-500 max-w-2xl mx-auto space-y-2">
            <p>Vitall propose un ERP modulaire qui permet de composer votre solution selon vos besoins.</p>
            <p>Votre ERP sur mesure évolue avec votre organisation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {modules.map((mod) => (
              <div
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${activeTab === mod.id
                  ? 'bg-white border-gray-100 shadow-xl'
                  : 'bg-transparent border-transparent hover:bg-gray-50/50'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${mod.iconColor}`}>
                    {mod.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#132E49] mb-2">{mod.title}</h3>
                    {activeTab === mod.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                          {mod.description}
                        </p>
                        <span className="text-xs font-bold text-[#132E49] inline-flex items-center">
                          {mod.details}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative aspect-square lg:aspect-video rounded-3xl border border-gray-100 bg-[#f8fafc] overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <div className="w-full h-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
                  <Image
                    src={modules.find(m => m.id === activeTab)?.image || ''}
                    alt={activeTab}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
