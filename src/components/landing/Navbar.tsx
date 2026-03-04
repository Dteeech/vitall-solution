"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'Modules', href: '#modules' },
    { name: 'Métiers', href: '#métiers' },
    { name: 'Tarifs', href: '#tarifs' },
    { name: 'Guides', href: '#guides' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="container mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 cursor-pointer relative z-50">
          <Image
            src="/assets/images/logo-hompepage.avif"
            alt="Vitall Logo"
            width={100}
            height={32}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#demo"
                className="text-[#EA8B49] text-sm font-semibold hover:bg-orange-50 px-4 py-2 rounded-md cursor-pointer transition-all"
              >
                Demander une démo
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/account-setup"
                className="bg-[#132E49] hover:bg-[#1a3e61] text-white text-sm font-semibold rounded-md px-6 py-2 cursor-pointer transition-all"
              >
                Mon compte
              </Link>
            </motion.div>
          </div>

          <button
            className="lg:hidden p-2 text-gray-600 hover:text-black relative z-50 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-semibold text-gray-800 hover:text-[#EA8B49] transition-colors cursor-pointer"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                <Link
                  href="#demo"
                  onClick={() => setIsOpen(false)}
                  className="text-[#EA8B49] font-bold text-center py-4 rounded-xl border border-orange-100 cursor-pointer"
                >
                  Demander une démo
                </Link>
                <Link
                  href="/account-setup"
                  onClick={() => setIsOpen(false)}
                  className="bg-[#132E49] text-white font-bold text-center py-4 rounded-xl shadow-lg cursor-pointer"
                >
                  Mon compte
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
