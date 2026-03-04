"use client"

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const features = [
  {
    title: 'Texte ici',
    description: 'Texte ici',
    icon: '🔒'
  },
  {
    title: 'Texte ici',
    description: 'Texte ici',
    icon: '📄'
  },
  {
    title: 'Texte ici',
    description: 'Texte ici',
    icon: '⏱️'
  }
]

export const FeatureGrid = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl mb-6">{feat.icon}</div>
              <h3 className="text-xl font-bold text-[#132E49] mb-3">{feat.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
