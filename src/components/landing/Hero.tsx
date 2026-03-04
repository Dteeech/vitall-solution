"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-16"
        >
          <div className="lg:max-w-2xl text-left">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-normal tracking-tight text-[#132E49] leading-[1.1]">
              Alléger le quotidien de ceux qui veillent sur le nôtre
            </h1>
          </div>

          <div className="lg:max-w-md w-full">
            <p className="text-gray-500 mb-8 text-lg">
              Vitall, logiciel de gestion sur mesure conçu pour les structures d’intervention.
              La plateforme centralise la gestion des équipes, des ressources et des opérations dans un seul outil.
              Un logiciel de gestion sur mesure conçu pour simplifier l’organisation et améliorer l’efficacité des équipes sur le terrain.

            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/account-setup"
                className="py-6 flex-1 w-full bg-[#132E49] hover:bg-[#1a3e61] text-white rounded-md px-8 h-12 flex items-center justify-center text-normal font-normal cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Mon compte
              </Link>
              <Link
                href="#demo"
                className="py-6 flex-1 w-full border border-[#EA8B49] text-[#EA8B49] hover:bg-orange-50 rounded-md px-8 h-12 flex items-center justify-center text-normal font-normal cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Demander une démo
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-6xl mx-auto mt-12"
        >
          <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden aspect-[16/10] relative">
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
              <video
                src="/assets/videos/video-presentation-vitall.webm"
                autoPlay
                loop
                muted
                playsInline
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/5 pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
