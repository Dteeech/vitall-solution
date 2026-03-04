"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'

interface AlternatingSectionProps {
  title: string
  imageUrl: string
  description: string
  items: string[]
  reverse?: boolean
}

export const AlternatingSection = ({ title, imageUrl, description, items, reverse = false }: AlternatingSectionProps) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className={`flex flex-col lg:flex-row items-center gap-16 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          <motion.div
            initial={{ opacity: 0, x: reverse ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <div className="aspect-[4/3] rounded-3xl bg-[#f8fafc] border border-gray-100 shadow-lg overflow-hidden relative">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1 max-w-xl"
          >
            <h2 className="text-4xl font-bold text-[#132E49] mb-4">{title}</h2>
            <p className="text-gray-500 mb-8">{description}</p>

            <ul className="space-y-4">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 h-5 rounded-full border border-orange-200 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#EA8B49]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
