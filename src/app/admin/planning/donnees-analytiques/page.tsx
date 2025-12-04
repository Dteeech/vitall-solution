"use client"

import { Calendar, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

// Type pour les données de KPI
type KPICardData = {
  value: string
  label: string
  bgColor: string
  iconBgColor: string
  Icon: React.ComponentType<{ className?: string }>
}

// Type pour les données du graphique circulaire
type ActivityData = {
  label: string
  color: string
  percentage: number
}

// Type pour les données du graphique à barres
type CollaboratorHours = {
  name: string
  hours: number
  maxHours: number // Pour calculer le pourcentage de la barre
}

// Composant pour une carte KPI
function KPICard({ value, label, bgColor, iconBgColor, Icon }: KPICardData) {
  return (
    <div className={`${bgColor} flex items-start justify-between p-6 rounded-2xl flex-1`}>
      <div className="flex flex-col gap-2">
        <p className="text-[64px] font-semibold text-[#131315] leading-none">
          {value}
        </p>
        <p className="text-sm font-semibold text-[#131315]">
          {label}
        </p>
      </div>
      <div className={`${iconBgColor} w-10 h-10 rounded-lg flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  )
}

// Composant pour la légende du graphique
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1 w-[117px]">
      <div className={`w-4 h-4 rounded ${color}`} />
      <p className="text-xs text-[#465b5e] tracking-[0.12px]">
        {label}
      </p>
    </div>
  )
}

// Composant pour le graphique circulaire (simplifié)
function DonutChart({ data, total }: { data: ActivityData[]; total: string }) {
  // Pour un vrai graphique, vous pouvez utiliser une bibliothèque comme recharts ou chart.js
  // Ici, nous utilisons un SVG simple pour la démonstration
  let currentAngle = 0

  const createArc = (percentage: number) => {
    const startAngle = currentAngle
    const endAngle = currentAngle + (percentage / 100) * 360
    currentAngle = endAngle

    const startRad = (startAngle - 90) * Math.PI / 180
    const endRad = (endAngle - 90) * Math.PI / 180

    const radius = 70
    const innerRadius = 45
    const cx = 79
    const cy = 78

    const x1 = cx + radius * Math.cos(startRad)
    const y1 = cy + radius * Math.sin(startRad)
    const x2 = cx + radius * Math.cos(endRad)
    const y2 = cy + radius * Math.sin(endRad)
    const x3 = cx + innerRadius * Math.cos(endRad)
    const y3 = cy + innerRadius * Math.sin(endRad)
    const x4 = cx + innerRadius * Math.cos(startRad)
    const y4 = cy + innerRadius * Math.sin(startRad)

    const largeArc = percentage > 50 ? 1 : 0

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <svg width="158" height="156" viewBox="0 0 158 156" className="shrink-0">
        {data.map((item, index) => (
          <path
            key={index}
            d={createArc(item.percentage)}
            fill={item.color}
          />
        ))}
      </svg>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-wrap gap-4 justify-between py-2">
          {data.map((item, index) => (
            <LegendItem key={index} color={item.color} label={item.label} />
          ))}
        </div>

        <div className="bg-[#f1f1f1] px-4 py-1 rounded-lg text-center text-sm">
          <span className="font-normal">Total : </span>
          <span className="font-semibold">{total}</span>
        </div>
      </div>
    </div>
  )
}

// Composant pour une barre horizontale
function HorizontalBar({ name, hours, maxHours }: CollaboratorHours) {
  const percentage = (hours / maxHours) * 100

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-xs text-[#131315] w-20 text-right">
        {name}
      </span>
      <div className="flex-1 h-4 bg-[#f1f1f1] rounded-full relative">
        <div
          className="h-full bg-[#555455] rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default function DonneesAnalytiquesPage() {
  // Données mock - À remplacer par des données réelles de votre API
  const kpiData: KPICardData[] = [
    {
      value: "24",
      label: "Interventions planifiées",
      bgColor: "bg-[#fff0e4]",
      iconBgColor: "bg-[#ea8b49]",
      Icon: Calendar,
    },
    {
      value: "32",
      label: "Collaborateurs actifs",
      bgColor: "bg-[#eaf1f6]",
      iconBgColor: "bg-[#132e49]",
      Icon: Users,
    },
    {
      value: "1,842h",
      label: "Heures planifiées",
      bgColor: "bg-[#f4f4f4]",
      iconBgColor: "bg-[#555455]",
      Icon: Clock,
    },
  ]

  const activityData: ActivityData[] = [
    { label: "Astreintes", color: "bg-[#ea8b49]", percentage: 30 },
    { label: "Interventions", color: "bg-[#7195aa]", percentage: 25 },
    { label: "Formations", color: "bg-[#b6b2ae]", percentage: 20 },
    { label: "Ges.admin.", color: "bg-[#f1f1f1]", percentage: 15 },
    { label: "Entretien", color: "bg-[#d3d3d3]", percentage: 10 },
  ]

  const collaboratorData: CollaboratorHours[] = [
    { name: "Marin D.", hours: 125, maxHours: 154 },
    { name: "Sophie L.", hours: 125, maxHours: 154 },
    { name: "Jean M.", hours: 125, maxHours: 154 },
    { name: "Marie P.", hours: 25, maxHours: 154 },
    { name: "Claire B.", hours: 75, maxHours: 154 },
    { name: "Luc T.", hours: 100, maxHours: 154 },
    { name: "Emma D.", hours: 125, maxHours: 154 },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-semibold text-[#131315]">
          Données analytiques
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="flex gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Graphiques */}
      <div className="flex gap-6">
        {/* Graphique circulaire - Répartition des activités */}
        <div className="bg-white border border-[#f1f1f1] rounded-xl p-4 w-[300px] flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-[#1c2e30]">
                Répartition des activités
              </h2>
            </div>
            <div className="h-px bg-[#f1f1f1]" />
          </div>

          <DonutChart data={activityData} total="567 activités" />
        </div>

        {/* Graphique à barres - Heures par collaborateur */}
        <div className="bg-white border border-[#f1f1f1] rounded-xl p-4 flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-[#1c2e30]">
                Heures par collaborateur (ce mois)
              </h2>
            </div>
            <div className="h-px bg-[#f1f1f1]" />
          </div>

          <div className="flex flex-col gap-1">
            {collaboratorData.map((collab, index) => (
              <HorizontalBar key={index} {...collab} />
            ))}
          </div>

          {/* Échelle horizontale */}
          <div className="flex justify-between text-xs text-[#131315] pl-[88px]">
            <span>0</span>
            <span>14</span>
            <span>28</span>
            <span>42</span>
            <span>56</span>
            <span>70</span>
            <span>84</span>
            <span>98</span>
            <span>112</span>
            <span>126</span>
            <span>140</span>
            <span>154</span>
          </div>
        </div>
      </div>

      {/* Section Export */}
      <div className="bg-[#203b55] border border-[#f1f1f1] rounded-xl p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          Exporter des données
        </h2>
        <Button
          variant="outline"
          className="border-white text-white hover:bg-white/10"
        >
          Générer
        </Button>
      </div>
    </div>
  )
}
