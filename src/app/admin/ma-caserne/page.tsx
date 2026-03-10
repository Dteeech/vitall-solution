'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MapPin, User, Minus, Plus, Loader2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/context/AuthContext'

export default function MaCasernePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [organization, setOrganization] = useState<any>(null)

  const fetchOrganization = async () => {
    try {
      const res = await fetch('/api/user/organization')
      if (res.ok) {
        const data = await res.json()
        setOrganization(data)
      }
    } catch (error) {
      console.error("Error fetching organization:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganization()
  }, [])

  const handleUpdate = async (updates: any) => {
    setUpdating(true)
    try {
      const res = await fetch('/api/user/organization', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (res.ok) {
        const updated = await res.json()
        setOrganization(updated)
      }
    } catch (error) {
      console.error("Error updating organization:", error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="flex-1 p-8">
        <p>Organisation non trouvée.</p>
      </div>
    )
  }

  // Use the admin user from the organization if available, otherwise the current user
  const adminUser = organization.users?.[0] || user

  return (
    <main className="flex-1 min-h-screen bg-[#F9FAFB] p-8">
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#131315]">Ma caserne</h1>
          {updating && <Loader2 className="size-4 animate-spin text-orange-500" />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Card 1: Info Base */}
          <Card className="p-8 rounded-[32px] border-none shadow-sm bg-white flex flex-col gap-8">
            <div>
              <h2 className="text-xl font-bold text-[#131315]">{organization.name}</h2>
              <p className="text-xs text-gray-400 font-medium uppercase mt-1">Caserne en astreinte</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <User className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Chef de caserne</p>
                  <p className="text-sm font-bold text-[#131315]">{adminUser?.firstName} {adminUser?.lastName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <Phone className="size-5" />
                </div>
                <p className="text-sm font-bold text-[#131315]">00 00 00 00 00</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <Mail className="size-5" />
                </div>
                <p className="text-sm font-bold text-[#131315]">{adminUser?.email}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <MapPin className="size-5" />
                </div>
                <p className="text-sm font-bold text-[#131315]">{organization.address || 'Non renseigné'}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button className="w-full py-4 bg-[#F97316] text-white font-bold text-sm rounded-2xl hover:bg-[#EA580C] transition-colors shadow-sm shadow-orange-200">
                Modifier
              </button>
              <button className="w-full py-4 bg-white text-red-500 font-bold text-sm rounded-2xl border border-red-100 hover:bg-red-50 transition-colors">
                Supprimer ma caserne
              </button>
            </div>
          </Card>

          {/* Card 2: Mes besoins */}
          <Card className="p-8 rounded-[32px] border-none shadow-sm bg-white h-fit">
            <h2 className="text-xl font-bold text-[#131315] mb-8">Mes besoins</h2>

            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#131315]">Recrutement ouvert</p>
                  <p className="text-xs text-gray-400">Permettre aux candidats de postuler</p>
                </div>
                <Switch
                  checked={organization.recruitmentOpen}
                  onCheckedChange={(val) => handleUpdate({ recruitmentOpen: val })}
                  disabled={updating}
                  className="data-[state=checked]:bg-[#F97316]"
                />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-[#131315]">Nombre de postes libres</p>
                <div className="flex items-center gap-4">
                  <button
                    disabled={updating || organization.openPositions <= 0}
                    onClick={() => handleUpdate({ openPositions: Math.max(0, organization.openPositions - 1) })}
                    className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#131315] transition-colors border border-gray-100 disabled:opacity-50"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="text-2xl font-black text-[#131315] min-w-[2ch] text-center">
                    {organization.openPositions}
                  </span>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdate({ openPositions: organization.openPositions + 1 })}
                    className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#131315] transition-colors border border-gray-100 disabled:opacity-50"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
