"use client"

import { useState } from "react"
import { Plus, Calendar as CalendarIcon } from "lucide-react"
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

type AstreinteAssignment = {
  id: string
  name: string
  initials: string
  color: string
}

type CalendarDay = {
  date: number
  isCurrentMonth: boolean
  assignment?: AstreinteAssignment
}

export default function AstreintesPage() {
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false)
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  // Mock data for calendar
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const calendarDays: CalendarDay[] = [
    { date: 1, isCurrentMonth: false },
    { date: 2, isCurrentMonth: false },
    { date: 3, isCurrentMonth: true },
    { date: 4, isCurrentMonth: true },
    { date: 5, isCurrentMonth: true },
    { date: 6, isCurrentMonth: true, assignment: { id: "1", name: "Nicolas Petit", initials: "NP", color: "#203b55" } },
    { date: 7, isCurrentMonth: true, assignment: { id: "1", name: "Nicolas Petit", initials: "NP", color: "#203b55" } },
    { date: 8, isCurrentMonth: true, assignment: { id: "1", name: "Nicolas Petit", initials: "NP", color: "#203b55" } },
    { date: 9, isCurrentMonth: true, assignment: { id: "1", name: "Nicolas Petit", initials: "NP", color: "#203b55" } },
    { date: 10, isCurrentMonth: true, assignment: { id: "1", name: "Nicolas Petit", initials: "NP", color: "#203b55" } },
    { date: 11, isCurrentMonth: true, assignment: { id: "1", name: "Nicolas Petit", initials: "NP", color: "#203b55" } },
    { date: 12, isCurrentMonth: true, assignment: { id: "1", name: "Nicolas Petit", initials: "NP", color: "#203b55" } },
    { date: 13, isCurrentMonth: true },
    { date: 14, isCurrentMonth: true },
    { date: 15, isCurrentMonth: true },
    { date: 16, isCurrentMonth: true },
    { date: 17, isCurrentMonth: true },
    { date: 18, isCurrentMonth: true },
    { date: 19, isCurrentMonth: true },
    { date: 20, isCurrentMonth: true },
    { date: 21, isCurrentMonth: true },
    { date: 22, isCurrentMonth: true, assignment: { id: "2", name: "Léo Plongon", initials: "LP", color: "#9d4c1b" } },
    { date: 23, isCurrentMonth: true },
    { date: 24, isCurrentMonth: true },
    { date: 25, isCurrentMonth: true },
    { date: 26, isCurrentMonth: true },
    { date: 27, isCurrentMonth: true },
    { date: 28, isCurrentMonth: true },
    { date: 29, isCurrentMonth: true },
    { date: 30, isCurrentMonth: true },
    { date: 1, isCurrentMonth: false },
    { date: 2, isCurrentMonth: false },
  ]

  const handleDayClick = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      setSelectedDay(day.date)
      setIsDayModalOpen(true)
    }
  }

  const [selectedWeeks] = useState<string[]>(["Semaine 45"])
  const [selectedDays] = useState<string[]>(["L", "M", "M", "J", "V", "S", "D"])

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-semibold text-[#131315]">
          Gestion des astreintes
        </h1>
      </div>

      {/* Add Button */}
      <div>
        <Button
          onClick={() => setIsGlobalModalOpen(true)}
          className="bg-[#ea8b49] hover:bg-[#ea8b49]/90 text-white gap-2 px-4 py-2 rounded-lg"
        >
          <Plus className="h-4 w-4" />
          Ajouter une astreinte
        </Button>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl shadow-sm border border-[#f1f1f1] overflow-hidden">
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
              <span className={`text-[21px] font-medium ${day.isCurrentMonth ? "text-[#131315]" : "text-[#131315]"}`}>
                {day.date}
              </span>

              {day.assignment && (
                <div className="flex items-start mt-2">
                  <div
                    className="flex gap-1 items-center px-1 py-1 rounded"
                    style={{ backgroundColor: day.assignment.color }}
                  >
                    <div className="bg-white rounded-full w-[18px] h-[18px] flex items-center justify-center">
                      <span className="text-[8px] font-bold text-[#132e49]">
                        {day.assignment.initials}
                      </span>
                    </div>
                    <span className="text-white text-xs font-medium pr-1">
                      {day.assignment.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Global Add Modal */}
      <Dialog open={isGlobalModalOpen} onOpenChange={setIsGlobalModalOpen}>
        <DialogContent className="max-w-[408px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Ajouter une astreinte
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Weeks Section */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315]">
                Semaine(s) ciblée(s) <span className="text-[#d63737]">*</span>
              </Label>

              <div className="flex flex-col gap-2">
                {selectedWeeks.map((week, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-[#f1f1f1] rounded-lg bg-white">
                      <CalendarIcon className="h-6 w-6 text-[#0c0c0c]" />
                      <span className="text-sm text-[#555455]">{week}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                      <Plus className="h-6 w-6 text-[#132e49]" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="border-[#ea8b49] text-[#ea8b49] hover:bg-[#ea8b49]/10 w-fit"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>

            {/* Days Section */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315]">
                Jours concernés <span className="text-[#d63737]">*</span>
              </Label>

              <div className="flex flex-wrap gap-1">
                {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
                  <button
                    key={index}
                    className={`
                      px-2 py-1 rounded text-xs font-medium text-white
                      ${selectedDays.includes(day) ? "bg-[#ea8b49]" : "bg-gray-300"}
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Collaborator Section */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315]">
                Collaborateur <span className="text-[#d63737]">*</span>
              </Label>

              <Input
                placeholder="Nicolas Petit"
                className="border-[#969390]"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-6 justify-end pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setIsGlobalModalOpen(false)}
              className="text-[#ea8b49]"
            >
              Annuler
            </Button>
            <Button className="bg-[#ea8b49] hover:bg-[#ea8b49]/90 text-white">
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day-Specific Add Modal */}
      <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
        <DialogContent className="max-w-[408px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Ajouter une astreinte
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Target Day */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315]">
                Journée cible <span className="text-[#d63737]">*</span>
              </Label>

              <div className="flex items-center gap-2 px-4 py-2 bg-[#f1f1f1] rounded-lg">
                <span className="text-sm text-[#969390]">
                  {selectedDay}/01/2025
                </span>
                <CalendarIcon className="h-6 w-6 ml-auto text-[#010102]" />
              </div>
            </div>

            {/* Collaborator */}
            <div className="flex flex-col gap-2">
              <Label className="text-base font-semibold text-[#131315]">
                Collaborateur <span className="text-[#d63737]">*</span>
              </Label>

              <Input
                placeholder="Placeholder"
                className="border-[#f1f1f1]"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-6 justify-end pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setIsDayModalOpen(false)}
              className="text-[#ea8b49]"
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
