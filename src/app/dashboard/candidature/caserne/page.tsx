"use client"

import { useState, useEffect } from 'react'
import { CaserneHeader } from "@/components/caserne/CaserneHeader"
import { CaserneMap } from "@/components/caserne/CaserneMap"
import { RecruiterIdentityCard } from "@/components/caserne/RecruiterIdentityCard"
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function CasernePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/user/organization')
        if (res.ok) {
          const org = await res.json()
          setData(org)
        }
      } catch (error) {
        console.error("Error fetching caserne info:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8">
        <p>Information de caserne indisponible.</p>
      </div>
    )
  }

  const admin = data.users?.[0] || {}
  const recruiterInfo = {
    firstName: admin.firstName || "Inconnu",
    lastName: admin.lastName || "",
    email: admin.email || "",
    caserne: data.name,
    avatarSrc: "",
    initials: (admin.firstName?.[0] || "") + (admin.lastName?.[0] || "")
  }

  const caserneDetails = {
    name: data.name,
    label: "Caserne d'affectation",
    city: data.address?.split(',')?.pop()?.trim() || "Ville non renseignée",
    distanceKm: 0,
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/place?key=REPLACE_ME&q=${encodeURIComponent(data.address || data.name)}`,
    needs: [
      { label: "Recrutement", value: data.recruitmentOpen ? "Ouvert" : "Fermé" },
      { label: "Postes libres", value: data.openPositions.toString() }
    ]
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-[#132E49] mb-12">Caserne</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <RecruiterIdentityCard recruiter={recruiterInfo} />

        <div className="flex-1 space-y-6 w-full">
          <CaserneHeader caserne={caserneDetails} />
          <CaserneMap caserne={caserneDetails} />
        </div>
      </div>
    </div>
  )
}
