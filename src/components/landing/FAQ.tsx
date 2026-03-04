"use client"

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Link from 'next/link'

const faqItems = [
  {
    q: "Vitall est-il un Un logiciel de gestion sur mesure ?",
    a: "Oui. Vitall est un logiciel de gestion sur mesure composé de modules activables selon les besoins de votre organisation."
  },
  {
    q: "À qui s’adresse la plateforme Vitall ?",
    a: "Vitall est conçu pour les services d’intervention, les structures de secours et les organisations qui doivent coordonner des équipes et des ressources sur le terrain."
  },
  {
    q: "Peut-on personnaliser les modules de l’Logiciel de gestion sur mesure ?",
    a: "Oui. Les modules permettent de construire un Logiciel de gestion sur mesure adapté aux besoins spécifiques de votre structure."
  },
]

export const FAQ = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-orange-100 text-[#EA8B49] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              FAQ
            </span>
            <h2 className="text-4xl font-bold text-[#132E49] mt-6 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-gray-500 text-sm">
              On répond à toutes vos questions juste ici.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none bg-[#f8fafc]/60 rounded-xl px-2">
                <AccordionTrigger className="text-[#132E49] font-bold hover:no-underline px-4 cursor-pointer">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 px-4 pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA section integrated with FAQ as per screenshot */}
        <div className="mt-32 relative overflow-hidden rounded-[24px] bg-[#FFEDD4] p-12 md:p-20 text-center">
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center bg-[#132E49] text-white px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
              Vitall
            </div>
            <h3 className="text-4xl md:text-5xl border-transparent font-medium text-black mb-6">
              Essayer c'est l'adopter
            </h3>
            <p className="text-gray-800 text-lg mb-12 max-w-2xl mx-auto">
              Demandez une démonstration ou obtenez un essai gratuit auprès de nos équipes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#trial"
                className="bg-[#132E49] hover:bg-[#1a3e61] text-white font-medium h-12 px-8 rounded-lg shadow-sm flex items-center justify-center cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Se connecter / créer un compte
              </Link>
              <Link
                href="#demo"
                className="bg-[#EA8B49] hover:bg-[#d67a38] text-white font-medium h-12 px-8 rounded-lg shadow-sm flex items-center justify-center cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Demander une démo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
