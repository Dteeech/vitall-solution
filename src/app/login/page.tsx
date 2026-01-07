import { Suspense } from 'react'
import LoginPageContent from './content'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div>Chargement...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
