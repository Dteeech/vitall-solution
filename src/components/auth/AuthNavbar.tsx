"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export const AuthNavbar = () => {
  const pathname = usePathname()

  const isLoginPage = pathname === '/login'
  const linkHref = isLoginPage ? '/account-setup' : '/login'
  const linkText = isLoginPage ? 'Créer un compte' : 'Se connecter'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer relative z-50">
          <Image
            src="/assets/images/logo-hompepage.avif"
            alt="Vitall Logo"
            width={100}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:inline-block">
            {isLoginPage ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
          </span>
          <Link
            href={linkHref}
            className="text-sm font-semibold text-[#132E49] hover:text-[#EA8B49] transition-colors cursor-pointer"
          >
            {linkText}
          </Link>
        </div>
      </div>
    </header>
  )
}
