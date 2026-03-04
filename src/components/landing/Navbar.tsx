"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export const Navbar = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/assets/images/logo-hompepage.avif"
            alt="Vitall Logo"
            width={100}
            height={32}
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {['Accueil', 'Modules', 'Métiers', 'Tarifs', 'Guides', 'Contact'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="#demo"
            className="text-[#EA8B49] text-sm font-semibold hover:bg-orange-50 px-4 py-2 rounded-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Demander une démo
          </Link>
          <Link
            href="#trial"
            className="bg-[#132E49] hover:bg-[#1a3e61] text-white text-sm font-semibold rounded-md px-6 py-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Obtenir un essai gratuit
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
