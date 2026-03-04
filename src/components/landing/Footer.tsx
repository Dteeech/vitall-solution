"use client"

import Image from 'next/image'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="py-16 bg-white border-t border-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo and text */}
          <div className="space-y-6">
            <Link href="/" className="inline-block cursor-pointer">
              <Image
                src="/assets/images/logo-hompepage.avif"
                alt="Vitall Logo"
                width={140}
                height={45}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-800 text-sm leading-relaxed max-w-[220px] font-medium">
              Alléger le quotidien de ceux<br />qui veillent sur le nôtre
            </p>
          </div>

          {/* Column 2: Restons en contact */}
          <div>
            <h4 className="text-gray-500 font-medium text-sm mb-6">Restons en contact</h4>
            <ul className="space-y-4">
              {['Qui sommes nous ?', 'Nous contacter', 'Newsletter'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm font-semibold text-[#132E49] hover:text-[#EA8B49] transition-colors cursor-pointer">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Vitall */}
          <div>
            <h4 className="text-gray-500 font-medium text-sm mb-6">Vitall</h4>
            <ul className="space-y-4">
              {['Modules', 'Métiers', 'Tarif', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm font-semibold text-[#132E49] hover:text-[#EA8B49] transition-colors cursor-pointer">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Légal */}
          <div>
            <h4 className="text-gray-500 font-medium text-sm mb-6">Légal</h4>
            <ul className="space-y-4">
              {['Politique de confidentialité', 'Mentions légales', 'Accessibilité', 'Plan du site', 'Cookies'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm font-semibold text-[#132E49] hover:text-[#EA8B49] transition-colors cursor-pointer">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
