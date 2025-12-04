"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

type ActivityType = "interventions" | "formation" | "entretien" | "astreinte"

type Activity = {
  id: string
  type: ActivityType
  label: string
  collaborator?: string
  time?: string
}

type CalendarDay = {
  date: number
  isCurrentMonth: boolean
  activities: Activity[]
}

const activityColors: Record<ActivityType, string> = {
  interventions: "bg-[#d3e1eb]",
  formation: "bg-[#f1f1f1]",
  entretien: "bg-[#ffe3cf]",
  astreinte: "bg-[#b8cdd9]",
}

const activityLabels: Record<ActivityType, string> = {
  interventions: "Interventions",
  formation: "Formation",
  entretien: "Entretien",
  astreinte: "Astreinte",
}

function ActivityTag({ type }: { type: ActivityType }) {
  return (
    <div className={`${activityColors[type]} px-1 py-1 rounded text-xs font-medium text-[#131315] tracking-[0.12px] text-center`}>
      {activityLabels[type]}
    </div>
  )
}

export default function PlanningPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [specifyTime, setSpecifyTime] = useState(false)

  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  // Mock calendar data - jour 9 a 3 activités comme dans le design
  const calendarDays: CalendarDay[] = [
    // Semaine 1
    { date: 29, isCurrentMonth: false, activities: [] },
    { date: 30, isCurrentMonth: false, activities: [] },
    { date: 1, isCurrentMonth: true, activities: [] },
    { date: 2, isCurrentMonth: true, activities: [] },
    { date: 3, isCurrentMonth: true, activities: [] },
    { date: 4, isCurrentMonth: true, activities: [] },
    { date: 5, isCurrentMonth: true, activities: [] },
    // Semaine 2
    { date: 6, isCurrentMonth: true, activities: [] },
    { date: 7, isCurrentMonth: true, activities: [] },
    { date: 8, isCurrentMonth: true, activities: [] },
    {
      date: 9,
      isCurrentMonth: true,
      activities: [
        { id: "1", type: "interventions", label: "Interventions" },
        { id: "2", type: "entretien", label: "Entretien" },
        { id: "3", type: "formation", label: "Formation" },
      ]
    },
    {
      date: 10,
      isCurrentMonth: true,
      activities: [
        { id: "4", type: "interventions", label: "Interventions" }
      ]
    },
    { date: 11, isCurrentMonth: true, activities: [] },
    { date: 12, isCurrentMonth: true, activities: [] },
    // Semaine 3
    { date: 13, isCurrentMonth: true, activities: [] },
    { date: 14, isCurrentMonth: true, activities: [] },
    { date: 15, isCurrentMonth: true, activities: [] },
    { date: 16, isCurrentMonth: true, activities: [] },
    { date: 17, isCurrentMonth: true, activities: [] },
    { date: 18, isCurrentMonth: true, activities: [] },
    { date: 19, isCurrentMonth: true, activities: [] },
    // Semaine 4
    { date: 20, isCurrentMonth: true, activities: [] },
    { date: 21, isCurrentMonth: true, activities: [] },
    { date: 22, isCurrentMonth: true, activities: [] },
    { date: 23, isCurrentMonth: true, activities: [] },
    { date: 24, isCurrentMonth: true, activities: [] },
    { date: 25, isCurrentMonth: true, activities: [] },
    { date: 26, isCurrentMonth: true, activities: [] },
    // Semaine 5
    { date: 27, isCurrentMonth: true, activities: [] },
    { date: 28, isCurrentMonth: true, activities: [] },
    { date: 29, isCurrentMonth: true, activities: [] },
    { date: 30, isCurrentMonth: true, activities: [] },
    { date: 31, isCurrentMonth: true, activities: [] },
    { date: 1, isCurrentMonth: false, activities: [] },
    { date: 2, isCurrentMonth: false, activities: [] },
  ]

  const handleDayClick = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      setSelectedDay(day.date)
      setIsModalOpen(true)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-semibold text-[#131315]">
          Planning
        </h1>
      </div>

      {/* Planning Header with filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-[#131315]">
          Équipe de Martin Delcourt
        </h2>

        <div className="flex flex-wrap gap-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
            >
              <ChevronLeft className="h-5 w-5 text-[#132e49]" />
            </Button>

            <div className="w-[250px] flex items-center gap-2 px-4 py-2 border border-[#f1f1f1] rounded-lg bg-white h-10">
              <span className="text-base text-[#465b5e] font-normal">
                Octobre 2025
              </span>
              <CalendarIcon className="h-6 w-6 ml-auto text-[#131315]" />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
            >
              <ChevronRight className="h-5 w-5 text-[#132e49]" />
            </Button>
          </div>

          {/* Collaborator Select */}
          <div className="w-[250px] flex items-center gap-2 px-4 py-2 border border-[#f1f1f1] rounded-lg bg-white h-10">
            <span className="text-sm text-[#969390] tracking-[0.14px]">
              Olivier Poluchon
            </span>
            <ChevronDown className="h-6 w-6 ml-auto text-[#131315]" />
          </div>

          {/* View Type Select */}
          <div className="flex items-center gap-2 px-4 py-2 border border-[#f1f1f1] rounded-lg bg-white h-10">
            <span className="text-sm text-[#969390] tracking-[0.14px]">
              Mois
            </span>
            <ChevronDown className="h-6 w-6 text-[#131315]" />
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl shadow-[0px_1px_1px_0px_rgba(0,0,0,0.12)] border border-[#f1f1f1] overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 bg-white">
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className={`
                p-2 border border-[#f1f1f1] h-12 flex items-start
                ${index === 0 ? "rounded-tl-2xl" : ""}
                ${index === 6 ? "rounded-tr-2xl" : ""}
              `}
            >
              <span className="text-[#969390] text-base">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              className={`
                min-h-[153px] p-4 border border-[#f1f1f1] flex flex-col justify-between
                ${day.isCurrentMonth ? "bg-white cursor-pointer hover:bg-gray-50" : "bg-[#f4f4f4]"}
                ${!day.isCurrentMonth ? "opacity-40" : ""}
                ${index === calendarDays.length - 7 ? "rounded-bl-2xl" : ""}
                ${index === calendarDays.length - 1 ? "rounded-br-2xl" : ""}
              `}
            >
              <span className="text-[21px] font-medium text-[#131315] tracking-[0.21px]">
                {day.date}
              </span>

              {day.activities.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {day.activities.map((activity) => (
                    <ActivityTag key={activity.id} type={activity.type} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[408px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#131315]">
              Assigner une activité
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Activity */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315] tracking-[0.12px]">
                Activité <span className="text-[#d63737]">*</span>
              </Label>
              <div className="flex items-center gap-2 px-4 py-2 border border-[#969390] rounded-lg bg-white h-10">
                <span className="text-sm text-[#969390] tracking-[0.14px]">
                  [Activité]
                </span>
                <ChevronDown className="h-6 w-6 ml-auto text-[#969390]" />
              </div>
            </div>

            {/* Target Day */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315] tracking-[0.12px]">
                Journée cible <span className="text-[#d63737]">*</span>
              </Label>
              <div className="flex items-center gap-2 px-4 py-2 border border-[#f1f1f1] rounded-lg bg-white h-10">
                <span className="text-sm text-[#969390] tracking-[0.14px]">
                  {selectedDay ? `${selectedDay.toString().padStart(2, '0')}/01/2025` : "01/01/2025"}
                </span>
                <CalendarIcon className="h-6 w-6 ml-auto text-[#131315]" />
              </div>
            </div>

            {/* Specify Time Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="specify-time"
                checked={specifyTime}
                onCheckedChange={(checked) => setSpecifyTime(checked === true)}
                className="border-[#131315]"
              />
              <Label
                htmlFor="specify-time"
                className="text-sm text-[#131315] tracking-[0.14px] cursor-pointer"
              >
                Préciser l&apos;heure
              </Label>
            </div>

            {/* Time Range - shown if specifyTime is true */}
            {specifyTime && (
              <div className="flex items-center gap-4">
                <Input
                  type="time"
                  defaultValue="16:00"
                  className="border-[#f1f1f1] h-10 text-sm text-[#969390] tracking-[0.14px]"
                />
                <span className="text-sm text-[#131315] tracking-[0.14px]">-</span>
                <Input
                  type="time"
                  defaultValue="17:00"
                  className="border-[#f1f1f1] h-10 text-sm text-[#969390] tracking-[0.14px]"
                />
              </div>
            )}

            {/* Collaborator */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315] tracking-[0.12px]">
                Collaborateur <span className="text-[#d63737]">*</span>
              </Label>
              <div className="flex items-center gap-2 px-4 py-2 border border-[#969390] rounded-lg bg-white h-10">
                <span className="text-sm text-[#969390] tracking-[0.14px]">
                  [Collaborateur]
                </span>
                <ChevronDown className="h-6 w-6 ml-auto text-[#969390]" />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#f1f1f1] -mx-6" />

          <DialogFooter className="flex gap-6 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="text-[#ea8b49] border-[#ea8b49] hover:bg-[#ea8b49]/10"
            >
              Annuler
            </Button>
            <Button className="bg-[#ea8b49] hover:bg-[#ea8b49]/90 text-white">
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
