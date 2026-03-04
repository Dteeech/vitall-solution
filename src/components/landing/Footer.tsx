"use client"

import Image from 'next/image'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="py-12 bg-white border-t border-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/images/logo-hompepage.avif"
              alt="Vitall Logo"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </div>

          <nav className="flex flex-wrap justify-center gap-8">
            {['Accueil', 'Modules', 'Métiers', 'Tarifs', 'Guides', 'Contact'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs font-semibold text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} Vitall. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  )
}
