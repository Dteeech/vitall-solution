'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { TextInput } from './TextInput'
import { PrimaryButton } from './PrimaryButton'
import { useAuth } from '@/context/AuthContext'

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
// ... (rest of imports and component starts)
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Identifiants incorrects')
        setLoading(false)
        return
      }

      toast.success('Connexion réussie !')
      
      // Mise à jour de l'état global
      login(data.user)

      // Redirection selon le rôle
      const redirectUrl = data.user.role === 'ADMIN' ? '/admin' : '/dashboard'
      setTimeout(() => router.push(redirectUrl), 500)
    } catch (err) {
      toast.error('Erreur de connexion. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-2">Connexion</h2>
      <p className="text-sm text-neutral-dark mb-6">Saisissez vos identifiants pour accéder à votre compte.</p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-neutral-dark">Identifiant <span className="text-danger">*</span></label>
        <TextInput
          placeholder="email@exemple.fr"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-neutral-dark">Mot de passe <span className="text-danger">*</span></label>
        <TextInput
          placeholder="Votre mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <input
          id="remember"
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4"
          disabled={loading}
        />
        <label htmlFor="remember" className="text-sm text-neutral-dark">Se souvenir de mon mot de passe</label>
      </div>

      <PrimaryButton
        label={loading ? "Connexion..." : "Connexion"}
        type="submit"
        className="w-full"
        disabled={loading}
      />
    </form>
  )
}
