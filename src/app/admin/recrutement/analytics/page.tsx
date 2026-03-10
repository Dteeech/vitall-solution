"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Users, FileText, Share } from 'lucide-react'
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
type StatusData = {
  label: string
  color: string
  percentage: number
}

// Type pour les données du graphique à barres
type AcceptanceData = {
  month: string
  rate: number
}

function KPICard({ value, label, bgColor, iconBgColor, Icon, loading }: KPICardData & { loading?: boolean }) {
  if (loading) {
    return <Skeleton className="h-[128px] w-full rounded-2xl flex-1" />
  }

  return (
    <div className={`${bgColor} flex items-start justify-between p-6 rounded-2xl flex-1 relative overflow-hidden group`}>
      <div className="flex flex-col gap-2 relative z-10">
        <p className="text-[64px] font-semibold text-neutral-900 leading-none">
          {value}
        </p>
        <p className="text-sm font-semibold text-neutral-900">
          {label}
        </p>
      </div>
      <div className={`${iconBgColor} w-10 h-10 rounded-lg flex items-center justify-center relative z-10 shrink-0`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {label === "Nouvelles candidatures" && (
        <Link className='absolute top-0 right-4 mt-6 inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary-500/20 group-hover:bg-primary-500 text-primary-900 group-hover:text-white font-semibold text-lg rounded-xl transition-colors duration-200 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto' href="/admin/recrutement/candidates">
          + Voir
        </Link>
      )}
    </div>
  )
}

function StatusLegend({ items }: { items: StatusData[] }) {
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

export default function AdminDashboardFirefighter() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const kpiData: KPICardData[] = [
    {
      value: "5",
      label: "Nouvelles candidatures",
      bgColor: "bg-primary-50",
      iconBgColor: "bg-[#EA8B49]",
      Icon: Users,
    },
    {
      value: "106",
      label: "Candidatures en cours",
      bgColor: "bg-secondary-50",
      iconBgColor: "bg-secondary-900",
      Icon: FileText,
    },
    {
      value: "1",
      label: "Demandes de transfert",
      bgColor: "bg-neutral-100",
      iconBgColor: "bg-neutral-600",
      Icon: Share,
    },
  ]

  const statusData: StatusData[] = [
    { label: "Nouvelle", color: "#EA8B49", percentage: 45 },
    { label: "Test sportif", color: "#7195AA", percentage: 25 },
    { label: "Visite médicale", color: "#C86B2F", percentage: 20 },
    { label: "Formation", color: "#B6B2AE", percentage: 10 },
  ]

  const acceptanceData: AcceptanceData[] = [
    { month: "Jan", rate: 0 },
    { month: "Fév", rate: 10 },
    { month: "Mars", rate: 25 },
    { month: "Avr", rate: 50 },
    { month: "Mai", rate: 75 },
    { month: "Juin", rate: 100 },
    { month: "Juil", rate: 125 },
    { month: "Août", rate: 150 },
    { month: "Sep", rate: 125 },
    { month: "Oct", rate: 100 },
    { month: "Nov", rate: 75 },
    { month: "Déc", rate: 50 },
  ]

  const chartConfig = {
    nouvelle: { label: "Nouvelle", color: "#EA8B49" },
    sport: { label: "Test sportif", color: "#7195AA" },
    medical: { label: "Visite médicale", color: "#C86B2F" },
    formation: { label: "Formation", color: "#B6B2AE" },
    rate: { label: "Taux", color: "var(--color-secondary-900)" },
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-4rem)] bg-white rounded-xl shadow-sm border border-gray-100/50 m-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-semibold text-neutral-900">
            Données analytiques
          </h1>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="flex gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} loading={isLoading} />
        ))}
      </div>

      {/* Graphiques */}
      <div className="flex gap-6">
        {/* Graphique circulaire - Répartition des statuts */}
        <Card className="flex flex-col w-[300px]">
          <CardHeader>
            <CardTitle>Répartition des statuts</CardTitle>
            <CardDescription>Total de candidatures : 218</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0 flex flex-col items-center justify-center min-h-[250px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                <Skeleton className="w-[160px] h-[160px] rounded-full" />
                <Skeleton className="w-[200px] h-[80px] rounded-lg" />
              </div>
            ) : (
              <>
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square h-full w-full max-h-[200px]"
                >
                  <PieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent nameKey="percentage" hideLabel />}
                    />
                    <Pie
                      data={statusData}
                      dataKey="percentage"
                      nameKey="label"
                      innerRadius={50}
                      strokeWidth={5}
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.label} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <StatusLegend items={statusData} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Graphique à barres - Taux d'acceptation */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Taux d'acceptation sur l'année civile</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="w-full flex items-end justify-between h-[250px] gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="w-[8%] rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%` }} />
                ))}
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart
                  accessibilityLayer
                  data={acceptanceData}
                  margin={{ left: -20, right: 10, top: 10 }}
                >
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="rate"
                    fill="var(--color-secondary-900)"
                    radius={[4, 4, 4, 4]}
                    barSize={12}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
