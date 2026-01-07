import Image from "next/image"
import logo from "../../../public/assets/images/Logo-couleur.svg"
export default function AccountSetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-white border-b border-neutral-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Image
            src={logo}
            alt="Vitall"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
          <a
            href="/login"
            className="text-sm text-neutral-600 hover:text-primary transition"
          >
            Déjà un compte ? Se connecter
          </a>
        </div>
      </header>
      {children}
    </div>
  )
}
