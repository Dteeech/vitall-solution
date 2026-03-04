import { AuthNavbar } from '@/components/auth/AuthNavbar'

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="pt-16 min-h-screen bg-neutral-50">
      <AuthNavbar />
      {children}
    </div>
  )
}
