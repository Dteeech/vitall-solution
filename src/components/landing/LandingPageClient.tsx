"use client"

import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { ModuleTabs } from '@/components/landing/ModuleTabs'
import { AlternatingSection } from '@/components/landing/AlternatingSection'
import { FAQ } from '@/components/landing/FAQ'
import { Footer } from '@/components/landing/Footer'

export default function LandingPageClient() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />

        <div id="modules">
          <ModuleTabs />
        </div>

        <AlternatingSection
          title="Centraliser la gestion des équipes"
          description="Vitall permet de simplifier la gestion des ressources humaines et la coordination des équipes. La plateforme facilite la gestion des équipes, la coordination d’équipe, le suivi des disponibilités et la planification des missions."
          items={[
            "Vision globale des équipes",
            "Coordination en temps réel",
            "Suivi des disponibilités",
            "Planification automatisée"
          ]}
        />

        <AlternatingSection
          title="Automatiser les processus administratifs"
          description="L’un des objectifs d’un Logiciel de gestion sur mesure est de réduire les tâches administratives. Vitall permet d’automatiser la gestion du planning, le suivi des candidatures et les dossiers RH."
          items={[
            "Automatisation du planning",
            "Suivi des candidatures intelligent",
            "Gestion dématérialisée des dossiers RH",
            "Suivi automatisé des formations"
          ]}
          reverse
        />

        <AlternatingSection
          title="Piloter vos ressources et vos équipements"
          description="Vitall centralise la gestion des ressources opérationnelles. Logiciel de gestion sur mesure permet notamment de gérer les équipements, l’inventaire matériel et le logiciel de gestion de flotte."
          items={[
            "Gestion centralisée des équipements",
            "Inventaire matériel en temps réel",
            "Logiciel de gestion de flotte intégré",
            "Suivi des ressources opérationnelles"
          ]}
        />

        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#132E49] mb-4">Un Logiciel de gestion sur mesure pour piloter votre organisation</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Vitall permet de structurer et de piloter votre organisation grâce à un système centralisé.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "vision globale des équipes",
                "gestion simplifiée du planning",
                "suivi des recrutements",
                "suivi du matériel et des ressources",
                "meilleure coordination des interventions"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-green-500 font-bold">✔</div>
                  <div className="text-[#132E49] font-medium capitalize">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-[#132E49] mb-8 text-center">Un Logiciel de gestion sur mesure pensé pour les réalités du terrain</h2>
              <p className="text-gray-500 text-lg mb-12 text-center">
                Les services d’intervention ont besoin d’outils simples, fiables et adaptés à leur organisation. Vitall a été conçu pour répondre à ces contraintes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { t: "Coordination rapide des équipes", d: "Réactivité maximale en opération" },
                  { t: "Accès rapide aux informations", d: "Données critiques à portée de main" },
                  { t: "Suivi des ressources", d: "Vision nette des moyens engagés" },
                  { t: "Gestion opérationnelle simplifiée", d: "Se concentrer sur la mission" }
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-[#f8fafc] border border-gray-100">
                    <h3 className="text-xl font-bold text-[#132E49] mb-2">{item.t}</h3>
                    <p className="text-gray-500 text-sm">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div id="faq">
          <FAQ />
        </div>
      </main>
      <Footer />
    </div>
  )
}
