"use client"

import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Calendar, Users, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

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
}

// Composant pour une carte KPI
function KPICard({ value, label, bgColor, iconBgColor, Icon }: KPICardData) {
  return (
    <div className={`${bgColor} flex items-start justify-between p-6 rounded-2xl flex-1`}>
      <div className="flex flex-col gap-2">
        <p className="text-[64px] font-semibold text-neutral-900 leading-none">
          {value}
        </p>
        <p className="text-sm font-semibold text-neutral-900">
          {label}
        </p>
      </div>
      <div className={`${iconBgColor} w-10 h-10 rounded-lg flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  )
}

function ActivityLegend({ items }: { items: ActivityData[] }) {
  return (
    <div className="mt-4 grid w-full max-w-[280px] grid-cols-2 gap-x-3 gap-y-2 mx-auto">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color }}
            aria-hidden
          />
          <span className="text-sm font-medium text-neutral-900 leading-none">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function DonneesAnalytiquesPage() {
  // Données mock - À remplacer par des données réelles de votre API
  const kpiData: KPICardData[] = [
    {
      value: "24",
      label: "Interventions planifiées",
      bgColor: "bg-primary-50",
      iconBgColor: "bg-primary-700",
      Icon: Calendar,
    },
    {
      value: "32",
      label: "Collaborateurs actifs",
      bgColor: "bg-secondary-50",
      iconBgColor: "bg-secondary-900",
      Icon: Users,
    },
    {
      value: "1,842h",
      label: "Heures planifiées",
      bgColor: "bg-neutral-100",
      iconBgColor: "bg-secondary-700",
      Icon: Clock,
    },
  ]

  const activityData: ActivityData[] = [
    { label: "Astreintes", color: "var(--color-primary-700)", percentage: 30 },
    { label: "Interventions", color: "var(--color-secondary-700)", percentage: 25 },
    { label: "Formations", color: "var(--color-primary-300)", percentage: 20 },
    { label: "Ges.admin.", color: "var(--color-secondary-300)", percentage: 15 },
    { label: "Entretien", color: "var(--color-secondary-500)", percentage: 10 },
  ]

  const collaboratorData: CollaboratorHours[] = [
    { name: "Marin D.", hours: 125 },
    { name: "Sophie L.", hours: 125 },
    { name: "Jean M.", hours: 125 },
    { name: "Marie P.", hours: 25 },
    { name: "Claire B.", hours: 75 },
    { name: "Luc T.", hours: 100 },
    { name: "Emma D.", hours: 125 },
  ]

  const chartConfig = {
    heures: {
      label: "Heures",
      color: "var(--color-secondary-800)",
    },
    astreintes: { label: "Astreintes", color: "var(--color-primary-700)" },
    interventions: { label: "Interventions", color: "var(--color-secondary-700)" },
    formations: { label: "Formations", color: "var(--color-primary-300)" },
    gesadmin: { label: "Ges.admin.", color: "var(--color-secondary-300)" },
    entretien: { label: "Entretien", color: "var(--color-secondary-500)" },
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-semibold text-neutral-900">
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
        <Card className="flex flex-col w-[300px]">
          <CardHeader>
            <CardTitle>Répartition des activités</CardTitle>
            <CardDescription>Total : 567 activités</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0 flex flex-col items-center">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-full w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="percentage" hideLabel />}
                />
                <Pie
                  data={activityData}
                  dataKey="percentage"
                  nameKey="label"
                  innerRadius={30}
                  strokeWidth={5}
                >
                  {activityData.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <ActivityLegend items={activityData} />
          </CardContent>
        </Card>

        {/* Graphique à barres - Heures par collaborateur */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Heures par collaborateur (ce mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart
                accessibilityLayer
                data={collaboratorData}
                layout="vertical"
                margin={{ left: 10, right: 10 }}
              >
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 10)}
                />
                <XAxis dataKey="hours" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="hours" layout="vertical" radius={5} fill={chartConfig.heures.color} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Section Export */}
      <div className="bg-secondary-900 border border-neutral-200 rounded-xl p-4 flex items-center justify-between">
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
