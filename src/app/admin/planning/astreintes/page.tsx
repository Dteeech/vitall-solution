"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown, Plus, LayoutList, LayoutGrid, Eye, Trash2, Check, AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay,
  addMonths, subMonths, parseISO,
  getISOWeek, setISOWeek, startOfISOWeek, addDays
} from "date-fns"
import { fr } from "date-fns/locale"

// ─── Types API ───────────────────────────────────────────
type ShiftTypeAPI = "GARDE" | "ASTREINTE" | "FORMATION" | "REUNION"

interface ShiftAPI {
  id: string
  startTime: string
  endTime: string
  type: ShiftTypeAPI
  user?: {
    id: string
    firstName: string
    lastName: string
  }
}

interface UserAPI {
  id: string
  firstName: string
  lastName: string
  email: string
}

// ─── Types UI ────────────────────────────────────────────
type Activity = {
  id: string
  label: string
  collaborator?: string
  time?: string
}

type CalendarDay = {
  date: Date
  isCurrentMonth: boolean
  activities: Activity[]
}

// ─── Composant ActivityTag ───────────────────────────────
function ActivityTag({ label, time, onClick }: { label: string; time?: string; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#e8f5e9] border-l-4 border-[#2e7d32] px-2 py-1.5 rounded-r-md text-xs font-medium text-[#131315] tracking-[0.12px] text-left overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex flex-col gap-0.5 shadow-sm"
      title={`Astreinte - ${label} (${time})`}
    >
      <div className="flex justify-between items-center w-full">
        <span className="font-bold uppercase text-[9px] opacity-70 leading-none truncate">Astreinte</span>
        {time && <span className="text-[9px] opacity-60 leading-none whitespace-nowrap ml-1">{time}</span>}
      </div>
      <span className="truncate leading-tight font-medium">{label}</span>
    </div>
  )
}

const dayLabels = ["L", "M", "M", "J", "V", "S", "D"]

// ═════════════════════════════════════════════════════════
// PAGE ASTREINTES
// ═════════════════════════════════════════════════════════
export default function AstreintesPage() {
  // ─── View ──────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<"month" | "day">("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const datePickerRef = useRef<HTMLInputElement>(null)

  // ─── Data ──────────────────────────────────────────────
  const [shifts, setShifts] = useState<ShiftAPI[]>([])
  const [users, setUsers] = useState<UserAPI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ─── Toast & confirmation ─────────────────────────────
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setToast({ message, type })
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3500)
  }

  // ─── Calendar click creation ───────────────────────────
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [calendarSpecifyTime, setCalendarSpecifyTime] = useState(false)
  const [calendarStartTime, setCalendarStartTime] = useState("09:00")
  const [calendarEndTime, setCalendarEndTime] = useState("17:00")
  const [calendarEndDate, setCalendarEndDate] = useState("")
  const [calendarUserId, setCalendarUserId] = useState("")

  // ─── Week-based creation (+ button) ────────────────────
  const [isWeekModalOpen, setIsWeekModalOpen] = useState(false)
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([getISOWeek(new Date())])
  const [selectedDayIndexes, setSelectedDayIndexes] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
  const [weekModalUserId, setWeekModalUserId] = useState("")

  // ─── Filter ────────────────────────────────────────────
  const [selectedCollaboratorFilter, setSelectedCollaboratorFilter] = useState<string>("")

  // ─── Edit ──────────────────────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<ShiftAPI | null>(null)
  const [editUserId, setEditUserId] = useState("")
  const [editStartTime, setEditStartTime] = useState("09:00")
  const [editEndTime, setEditEndTime] = useState("17:00")
  const [editDate, setEditDate] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // ─── Day detail modal ─────────────────────────────────
  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false)
  const [dayDetailShifts, setDayDetailShifts] = useState<ShiftAPI[]>([])

  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  // ─── Navigation ────────────────────────────────────────
  const navigateDate = (direction: "prev" | "next") => {
    if (viewMode === "month") {
      setCurrentDate((curr) => (direction === "prev" ? subMonths(curr, 1) : addMonths(curr, 1)))
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + (direction === "prev" ? -1 : 1))
      setCurrentDate(newDate)
    }
  }

  // ─── Timeline helpers ─────────────────────────────────
  const getHoursPoints = () => Array.from({ length: 24 }, (_, i) => i)

  const getShiftStyle = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    const startMinutes = s.getHours() * 60 + s.getMinutes()
    const durationMinutes = (e.getTime() - s.getTime()) / (1000 * 60)
    const leftPercent = (startMinutes / 1440) * 100
    const widthPercent = (durationMinutes / 1440) * 100
    return { left: `${leftPercent}%`, width: `${widthPercent}%` }
  }

  const getDayShifts = (userId: string) => {
    return shifts.filter((s) => {
      const shiftDate = new Date(s.startTime)
      return isSameDay(shiftDate, currentDate) && s.user?.id === userId
    })
  }

  // Calcul des swim lanes pour les shifts qui se chevauchent
  const computeSwimLanes = (userShifts: ShiftAPI[]): Map<string, { lane: number; totalLanes: number }> => {
    const laneMap = new Map<string, { lane: number; totalLanes: number }>()
    if (userShifts.length === 0) return laneMap

    const sorted = [...userShifts].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    const groups: ShiftAPI[][] = []
    let currentGroup: ShiftAPI[] = [sorted[0]]
    let groupEnd = new Date(sorted[0].endTime).getTime()

    for (let i = 1; i < sorted.length; i++) {
      const shiftStart = new Date(sorted[i].startTime).getTime()
      if (shiftStart < groupEnd) {
        currentGroup.push(sorted[i])
        groupEnd = Math.max(groupEnd, new Date(sorted[i].endTime).getTime())
      } else {
        groups.push(currentGroup)
        currentGroup = [sorted[i]]
        groupEnd = new Date(sorted[i].endTime).getTime()
      }
    }
    groups.push(currentGroup)

    for (const group of groups) {
      for (let lane = 0; lane < group.length; lane++) {
        laneMap.set(group[lane].id, { lane, totalLanes: group.length })
      }
    }

    return laneMap
  }

  // ─── Fetch users ──────────────────────────────────────
  useEffect(() => {
    fetch("/api/organization/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
  }, [])

  // ─── Fetch planning (ASTREINTE only) ──────────────────
  const fetchPlanning = () => {
    setIsLoading(true)
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }).toISOString()
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }).toISOString()

    fetch(`/api/planning?start=${start}&end=${end}`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const allShifts = data.flatMap((p: any) => p.shifts || [])
        setShifts(allShifts.filter((s: ShiftAPI) => s.type === "ASTREINTE"))
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchPlanning()
  }, [currentDate])

  // ─── Calendar days ────────────────────────────────────
  const calendarDays: CalendarDay[] = (() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDateCal = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: startDate, end: endDateCal })

    return days.map((day) => {
      const dayFormatted = format(day, "yyyy-MM-dd")
      let dayShifts = shifts.filter((s) => format(parseISO(s.startTime), "yyyy-MM-dd") === dayFormatted)

      if (selectedCollaboratorFilter && selectedCollaboratorFilter !== "all") {
        dayShifts = dayShifts.filter((s) => s.user?.id === selectedCollaboratorFilter)
      }

      const activities: Activity[] = dayShifts.map((s) => ({
        id: s.id,
        label: s.user ? `${s.user.firstName} ${s.user.lastName}` : "Non assigné",
        collaborator: s.user?.firstName,
        time: format(parseISO(s.startTime), "HH:mm") + " - " + format(parseISO(s.endTime), "HH:mm"),
      }))

      return { date: day, isCurrentMonth: isSameMonth(day, monthStart), activities }
    })
  })()

  // ─── Day click ────────────────────────────────────────
  const handleDayClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return

    const dayFormatted = format(day.date, "yyyy-MM-dd")
    const dayShifts = shifts.filter((s) => format(parseISO(s.startTime), "yyyy-MM-dd") === dayFormatted)

    setSelectedDay(day.date)
    setCalendarEndDate(format(day.date, "yyyy-MM-dd"))

    if (dayShifts.length > 0) {
      setDayDetailShifts(dayShifts)
      setIsDayDetailModalOpen(true)
    } else {
      setCalendarSpecifyTime(false)
      setCalendarUserId("")
      setIsCalendarModalOpen(true)
    }
  }

  // ─── Shift click → edit ───────────────────────────────
  const handleShiftClick = (shift: ShiftAPI) => {
    setEditingShift(shift)
    setEditUserId(shift.user?.id || "")
    setEditDate(format(parseISO(shift.startTime), "yyyy-MM-dd"))
    setEditStartTime(format(parseISO(shift.startTime), "HH:mm"))
    setEditEndTime(format(parseISO(shift.endTime), "HH:mm"))
    setIsEditModalOpen(true)
  }

  // ─── Overlap check helper ─────────────────────────────
  const hasAstreinteOverlap = (userId: string, startTime: Date, endTime: Date, excludeShiftId?: string): boolean => {
    if (!userId) return false
    return shifts.some((s) => {
      if (excludeShiftId && s.id === excludeShiftId) return false
      if (s.user?.id !== userId) return false
      const sStart = new Date(s.startTime)
      const sEnd = new Date(s.endTime)
      // Two intervals overlap if start < otherEnd AND end > otherStart
      return startTime < sEnd && endTime > sStart
    })
  }

  // ─── Create from calendar click ───────────────────────
  const handleCreateFromCalendar = async () => {
    if (!selectedDay) return
    setIsSubmitting(true)
    try {
      const startDayStr = format(selectedDay, "yyyy-MM-dd")
      const endDayStr = calendarEndDate || startDayStr
      const daysToCreate = eachDayOfInterval({ start: parseISO(startDayStr), end: parseISO(endDayStr) })

      // Check overlap before creating
      if (calendarUserId) {
        for (const day of daysToCreate) {
          const checkStart = new Date(day)
          const checkEnd = new Date(day)
          if (calendarSpecifyTime) {
            const [sh, sm] = calendarStartTime.split(":").map(Number)
            checkStart.setHours(sh, sm, 0, 0)
            const [eh, em] = calendarEndTime.split(":").map(Number)
            checkEnd.setHours(eh, em, 0, 0)
            if (checkEnd < checkStart) checkEnd.setDate(checkEnd.getDate() + 1)
          } else {
            checkStart.setHours(0, 0, 0, 0)
            checkEnd.setHours(23, 59, 59, 999)
          }
          if (hasAstreinteOverlap(calendarUserId, checkStart, checkEnd)) {
            showToast(`Ce collaborateur a déjà une astreinte le ${format(day, 'dd/MM/yyyy')} sur ce créneau`, 'error')
            setIsSubmitting(false)
            return
          }
        }
      }

      const createPromises = daysToCreate.map((day) => {
        const currentStart = new Date(day)
        const currentEnd = new Date(day)

        if (calendarSpecifyTime) {
          const [sh, sm] = calendarStartTime.split(":").map(Number)
          currentStart.setHours(sh, sm, 0, 0)
          const [eh, em] = calendarEndTime.split(":").map(Number)
          currentEnd.setHours(eh, em, 0, 0)
          if (currentEnd < currentStart) currentEnd.setDate(currentEnd.getDate() + 1)
        } else {
          currentStart.setHours(0, 0, 0, 0)
          currentEnd.setHours(23, 59, 59, 999)
        }

        return fetch("/api/planning", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startTime: currentStart.toISOString(),
            endTime: currentEnd.toISOString(),
            type: "ASTREINTE",
            userId: calendarUserId || undefined,
          }),
        })
      })

      await Promise.all(createPromises)
      setIsCalendarModalOpen(false)
      fetchPlanning()
      setTimeout(() => showToast('Astreinte créée avec succès'), 300)
      setCalendarUserId("")
    } catch (error) {
      console.error(error)
      showToast('Erreur lors de la création', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Create from week modal (+ button) ────────────────
  const handleCreateFromWeeks = async () => {
    if (selectedWeeks.length === 0 || selectedDayIndexes.length === 0) return
    setIsSubmitting(true)
    try {
      const year = currentDate.getFullYear()
      const refDate = new Date(year, 0, 4) // Jan 4 is always in ISO week 1

      // Check overlap before creating
      if (weekModalUserId) {
        for (const weekNum of selectedWeeks) {
          const weekStart = startOfISOWeek(setISOWeek(refDate, weekNum))
          for (const dayIdx of selectedDayIndexes) {
            const targetDate = addDays(weekStart, dayIdx)
            const checkStart = new Date(targetDate)
            const checkEnd = new Date(targetDate)
            checkStart.setHours(0, 0, 0, 0)
            checkEnd.setHours(23, 59, 59, 999)
            if (hasAstreinteOverlap(weekModalUserId, checkStart, checkEnd)) {
              showToast(`Ce collaborateur a déjà une astreinte le ${format(targetDate, 'dd/MM/yyyy')}`, 'error')
              setIsSubmitting(false)
              return
            }
          }
        }
      }

      const createPromises: Promise<Response>[] = []

      for (const weekNum of selectedWeeks) {
        const weekStart = startOfISOWeek(setISOWeek(refDate, weekNum))
        for (const dayIdx of selectedDayIndexes) {
          const targetDate = addDays(weekStart, dayIdx)
          const currentStart = new Date(targetDate)
          const currentEnd = new Date(targetDate)
          currentStart.setHours(0, 0, 0, 0)
          currentEnd.setHours(23, 59, 59, 999)

          createPromises.push(
            fetch("/api/planning", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                startTime: currentStart.toISOString(),
                endTime: currentEnd.toISOString(),
                type: "ASTREINTE",
                userId: weekModalUserId || undefined,
              }),
            })
          )
        }
      }

      await Promise.all(createPromises)
      setIsWeekModalOpen(false)
      fetchPlanning()
      setTimeout(() => showToast('Astreintes créées avec succès'), 300)
      setSelectedWeeks([getISOWeek(new Date())])
      setSelectedDayIndexes([0, 1, 2, 3, 4, 5, 6])
      setWeekModalUserId("")
    } catch (error) {
      console.error(error)
      showToast('Erreur lors de la création', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Update ───────────────────────────────────────────
  const handleUpdateShift = async () => {
    if (!editingShift) return
    setIsSubmitting(true)
    try {
      const startDateTime = parseISO(editDate)
      const [sh, sm] = editStartTime.split(":").map(Number)
      startDateTime.setHours(sh, sm)

      const endDateTime = parseISO(editDate)
      const [eh, em] = editEndTime.split(":").map(Number)
      endDateTime.setHours(eh, em)
      if (endDateTime < startDateTime) endDateTime.setDate(endDateTime.getDate() + 1)

      // Check overlap (exclude current shift being edited)
      if (editUserId && hasAstreinteOverlap(editUserId, startDateTime, endDateTime, editingShift.id)) {
        showToast('Ce collaborateur a déjà une astreinte sur ce créneau', 'error')
        setIsSubmitting(false)
        return
      }

      const res = await fetch("/api/planning", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingShift.id,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          type: "ASTREINTE",
          userId: editUserId || undefined,
        }),
      })

      if (res.ok) {
        setIsEditModalOpen(false)
        fetchPlanning()
        setTimeout(() => showToast('Astreinte modifiée avec succès'), 300)
      }
    } catch (error) {
      console.error(error)
      showToast('Erreur lors de la modification', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Delete ───────────────────────────────────────────
  const handleDeleteShift = async () => {
    if (!editingShift) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/planning?id=${editingShift.id}`, { method: "DELETE" })
      if (res.ok) {
        setDeleteConfirmOpen(false)
        setIsEditModalOpen(false)
        fetchPlanning()
        setTimeout(() => showToast('Astreinte supprimée'), 300)
      }
    } catch (error) {
      console.error(error)
      showToast('Erreur lors de la suppression', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // ─── Week modal helpers ───────────────────────────────
  const toggleDayIndex = (idx: number) => {
    setSelectedDayIndexes((prev) => (prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx].sort()))
  }

  const addWeek = () => {
    const maxWeek = selectedWeeks.length > 0 ? Math.max(...selectedWeeks) : getISOWeek(new Date())
    const nextWeek = maxWeek < 53 ? maxWeek + 1 : 1
    setSelectedWeeks((prev) => [...prev, nextWeek])
  }

  const removeWeek = (idx: number) => {
    setSelectedWeeks((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateWeek = (idx: number, value: number) => {
    setSelectedWeeks((prev) => prev.map((w, i) => (i === idx ? value : w)))
  }

  // ═════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-xl shadow-sm border border-gray-100/50">
      {/* ─── Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Astreintes</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des périodes d&apos;astreinte</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Navigation */}
          <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
            <Button variant="ghost" size="icon" onClick={() => navigateDate("prev")} className="h-8 w-8 hover:bg-white hover:shadow-sm transition-all">
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </Button>

            <div
              className="flex items-center gap-2 px-3 min-w-[140px] justify-center text-sm font-medium text-gray-700 capitalize cursor-pointer hover:text-orange-600 transition-colors relative"
              onClick={() => datePickerRef.current?.showPicker()}
            >
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              {viewMode === "month" ? format(currentDate, "MMMM yyyy", { locale: fr }) : format(currentDate, "d MMMM yyyy", { locale: fr })}
              <input
                ref={datePickerRef}
                type="date"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                value={format(currentDate, "yyyy-MM-dd")}
                onChange={(e) => {
                  if (e.target.value) {
                    setCurrentDate(parseISO(e.target.value))
                    if (viewMode === "month") setViewMode("day")
                  }
                }}
              />
            </div>

            <Button variant="ghost" size="icon" onClick={() => navigateDate("next")} className="h-8 w-8 hover:bg-white hover:shadow-sm transition-all">
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          {/* Collaborator Filter */}
          <Select value={selectedCollaboratorFilter} onValueChange={setSelectedCollaboratorFilter}>
            <SelectTrigger className="w-[180px] h-10 bg-gray-50 border-gray-100">
              <SelectValue placeholder="Tous les employés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 bg-gray-50 border-gray-100">
                {viewMode === "month" ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
                {viewMode === "month" ? "Mois" : "Jour"}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode("day")}>Vue Jour</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("month")}>Vue Mois</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* + Button → Week Modal */}
          <Button
            onClick={() => {
              setSelectedWeeks([getISOWeek(currentDate)])
              setSelectedDayIndexes([0, 1, 2, 3, 4, 5, 6])
              setWeekModalUserId("")
              setIsWeekModalOpen(true)
            }}
            className="h-10 bg-[#ea8b49] text-white hover:bg-[#ea8b49]/90 gap-2 px-4 shadow-lg shadow-orange-900/10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ─── CONTENT ──────────────────────────────────── */}
      {viewMode === "month" ? (
        /* ════════════ VUE MOIS ════════════ */
        <div className="flex-1 bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col">
          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
            {isLoading ? (
              <div className="col-span-7 row-span-6 flex justify-center items-center">Chargement...</div>
            ) : (
              calendarDays.map((day, index) => {
                const dayFormatted = format(day.date, "yyyy-MM-dd")
                const dayShifts = shifts.filter((s) => format(parseISO(s.startTime), "yyyy-MM-dd") === dayFormatted)

                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`
                      min-h-[100px] p-2 border-b border-r border-gray-50 relative group transition-all hover:bg-gray-50/30 cursor-pointer flex flex-col gap-1
                      ${!day.isCurrentMonth ? "bg-gray-50/50 text-gray-300" : "bg-white"}
                      ${isSameDay(day.date, new Date()) ? "bg-green-50/30" : ""}
                    `}
                  >
                    <div
                      className={`
                        text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full shrink-0
                        ${isSameDay(day.date, new Date()) ? "bg-[#2e7d32] text-white shadow-md shadow-green-200" : "text-gray-700"}
                      `}
                    >
                      {format(day.date, "d")}
                    </div>

                    <div className="flex-1 max-h-[120px] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                      {dayShifts.map((shift) => {
                        const label = shift.user ? `${shift.user.firstName} ${shift.user.lastName}` : "Non assigné"
                        return (
                          <ActivityTag
                            key={shift.id}
                            label={label}
                            time={format(parseISO(shift.startTime), "HH:mm") + " - " + format(parseISO(shift.endTime), "HH:mm")}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShiftClick(shift)
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      ) : (
        /* ════════════ VUE JOUR (TIMELINE) ════════════ */
        <div className="flex-1 overflow-auto border border-gray-100 rounded-lg bg-white relative">
          {/* En-tête des heures */}
          <div className="flex border-b border-gray-100 sticky top-0 bg-white z-10 min-w-[1400px]">
            <div className="w-60 shrink-0 p-3 border-r border-gray-100 bg-gray-50/50 font-semibold text-gray-500 text-sm flex items-center">
              Collaborateurs
            </div>
            <div className="flex-1 relative h-10">
              {getHoursPoints().map((hour) => (
                <div
                  key={hour}
                  className="absolute top-0 bottom-0 text-xs text-gray-400 border-l border-gray-100 pl-1 flex items-center"
                  style={{ left: `${(hour / 24) * 100}%` }}
                >
                  {hour.toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>
          </div>

          {/* Corps du planning */}
          <div className="min-w-[1400px] relative">
            {/* Ligne "Maintenant" */}
            {isSameDay(currentDate, new Date()) &&
              (() => {
                const now = new Date()
                const localMinutes = now.getHours() * 60 + now.getMinutes()
                const leftPct = (localMinutes / 1440) * 100
                return (
                  <div className="absolute top-0 bottom-0 w-0.5 bg-green-600 z-20 pointer-events-none" style={{ left: `calc(240px + (100% - 240px) * ${leftPct / 100})` }}>
                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full -ml-[4px] -mt-1 shadow-sm shadow-green-300"></div>
                  </div>
                )
              })()}

            {users
              .filter((u) => (selectedCollaboratorFilter && selectedCollaboratorFilter !== "all" ? u.id === selectedCollaboratorFilter : true))
              .map((user) => {
                const userShifts = getDayShifts(user.id)
                const swimLanes = computeSwimLanes(userShifts)
                const maxLanes = userShifts.length > 0 ? Math.max(...Array.from(swimLanes.values()).map(v => v.totalLanes)) : 1

                return (
                  <div key={user.id} className="flex border-b border-gray-50 hover:bg-gray-50/20 transition-colors" style={{ height: `${Math.max(64, maxLanes * 36 + 8)}px` }}>
                    {/* Colonne user */}
                    <div className="w-60 shrink-0 p-3 border-r border-gray-100 flex items-center gap-2 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      <div className="h-8 w-8 rounded-md bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold border border-green-200">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {user.firstName} {user.lastName}
                        </span>
                        {userShifts.length > 0 && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded w-fit font-medium">Astreinte</span>}
                      </div>
                    </div>

                    {/* Zone timeline */}
                    <div
                      className="flex-1 relative h-full bg-[linear-gradient(90deg,transparent_0%,transparent_98%,#f8fafc_98%,#f8fafc_100%)] bg-[size:4.166%_100%] cursor-pointer"
                      onClick={(e) => {
                        // Calculate clicked hour from mouse position
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const pct = x / rect.width;
                        const totalMinutes = Math.floor(pct * 1440);
                        const clickedHour = Math.floor(totalMinutes / 60);
                        const clickedMin = Math.floor(totalMinutes / 30) * 30 % 60;
                        const startH = `${clickedHour.toString().padStart(2, '0')}:${clickedMin.toString().padStart(2, '0')}`;
                        const endH = `${Math.min(clickedHour + 1, 23).toString().padStart(2, '0')}:${clickedMin.toString().padStart(2, '0')}`;

                        setSelectedDay(currentDate);
                        setCalendarEndDate(format(currentDate, 'yyyy-MM-dd'));
                        setCalendarSpecifyTime(true);
                        setCalendarStartTime(startH);
                        setCalendarEndTime(endH);
                        setCalendarUserId(user.id);
                        setIsCalendarModalOpen(true);
                      }}
                    >
                      {getHoursPoints().map((hour) => (
                        <div key={hour} className="absolute top-0 bottom-0 border-l border-gray-100/50 h-full pointer-events-none" style={{ left: `${(hour / 24) * 100}%` }}></div>
                      ))}

                      {userShifts.map((shift) => {
                        const posStyle = getShiftStyle(shift.startTime, shift.endTime)
                        const laneInfo = swimLanes.get(shift.id) || { lane: 0, totalLanes: 1 }
                        const laneHeight = 100 / laneInfo.totalLanes
                        const topPct = laneInfo.lane * laneHeight
                        return (
                          <div
                            key={shift.id}
                            onClick={(e) => { e.stopPropagation(); handleShiftClick(shift); }}
                            className="absolute rounded px-2 text-xs flex items-center gap-1 cursor-pointer hover:brightness-95 shadow-sm overflow-hidden whitespace-nowrap z-10 border-l-4 transition-all bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20]"
                            style={{ ...posStyle, top: `calc(${topPct}% + 4px)`, height: `calc(${laneHeight}% - 8px)` }}
                            title={`${format(parseISO(shift.startTime), "HH:mm")} - ${format(parseISO(shift.endTime), "HH:mm")} : Astreinte`}
                          >
                            <span className="font-semibold truncate">Astreinte</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════ */}
      {/* MODAL 1 : Création par semaines (bouton +)       */}
      {/* ═════════════════════════════════════════════════ */}
      <Dialog open={isWeekModalOpen} onOpenChange={setIsWeekModalOpen}>
        <DialogContent className="max-w-[408px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#131315]">Ajouter une astreinte</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            {/* Semaine(s) ciblée(s) */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-[#131315]">
                Semaine(s) ciblée(s) <span className="text-[#d63737]">*</span>
              </Label>
              <div className="flex flex-col gap-2">
                {selectedWeeks.map((week, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-[#f1f1f1] rounded-lg bg-white h-10">
                      <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-[#131315]">Semaine</span>
                      <input
                        type="number"
                        min={1}
                        max={53}
                        value={week}
                        onChange={(e) => updateWeek(idx, parseInt(e.target.value) || 1)}
                        className="w-12 text-sm text-[#131315] border-0 bg-transparent focus:outline-none text-center font-medium"
                      />
                    </div>
                    <button
                      onClick={() => removeWeek(idx)}
                      className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={selectedWeeks.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addWeek} className="flex items-center gap-1 text-sm font-medium text-[#ea8b49] hover:text-[#d47a3d] transition-colors w-fit px-2 py-1 rounded-md hover:bg-orange-50">
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>

            {/* Jours concernés */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-[#131315]">
                Jours concernés <span className="text-[#d63737]">*</span>
              </Label>
              <div className="flex gap-2">
                {dayLabels.map((label, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleDayIndex(idx)}
                    className={`h-9 w-9 rounded-full text-sm font-semibold transition-all ${
                      selectedDayIndexes.includes(idx) ? "bg-[#ea8b49] text-white shadow-md shadow-orange-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Collaborateur */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-[#131315]">
                Collaborateur <span className="text-[#d63737]">*</span>
              </Label>
              <div className="relative">
                <select
                  className="w-full appearance-none px-4 py-2 border border-[#969390] rounded-lg bg-white h-10 text-sm text-[#969390] tracking-[0.14px] focus:outline-none focus:ring-2 focus:ring-[#ea8b49]"
                  value={weekModalUserId}
                  onChange={(e) => setWeekModalUserId(e.target.value)}
                >
                  <option value="">Sélectionner un collaborateur</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-6 w-6 absolute right-2 top-2 pointer-events-none text-[#969390]" />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#f1f1f1] -mx-6 mt-2" />

          <DialogFooter className="flex gap-6 justify-end">
            <Button variant="outline" onClick={() => setIsWeekModalOpen(false)} className="border-[#ea8b49] text-[#ea8b49] hover:bg-[#ea8b49]/10">
              Annuler
            </Button>
            <Button
              className="bg-[#ea8b49] hover:bg-[#ea8b49]/90 text-white"
              onClick={() => setConfirmAction({
                title: 'Confirmer l\'ajout',
                message: 'Êtes-vous sûr de vouloir ajouter ces astreintes ?',
                onConfirm: handleCreateFromWeeks
              })}
              disabled={isSubmitting || selectedWeeks.length === 0 || selectedDayIndexes.length === 0}
            >
              {isSubmitting ? "Création..." : "Valider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═════════════════════════════════════════════════ */}
      {/* MODAL 2 : Création au clic calendrier             */}
      {/* ═════════════════════════════════════════════════ */}
      <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
        <DialogContent className="max-w-[408px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#131315]">Ajouter une astreinte</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs text-[#131315] tracking-[0.12px]">Date début</Label>
                <div className="flex items-center gap-2 px-4 py-2 border border-[#f1f1f1] rounded-lg bg-gray-50 h-10 cursor-not-allowed">
                  <span className="text-sm text-[#969390] tracking-[0.14px]">{selectedDay ? format(selectedDay, "dd/MM/yyyy") : ""}</span>
                  <CalendarIcon className="h-4 w-4 ml-auto text-[#131315]" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs text-[#131315] tracking-[0.12px]">Date fin</Label>
                <div className="flex items-center gap-2 px-2 py-2 border border-[#969390] rounded-lg bg-white h-10">
                  <Input
                    type="date"
                    className="border-0 p-0 h-auto text-sm text-[#131315] focus-visible:ring-0"
                    value={calendarEndDate}
                    min={selectedDay ? format(selectedDay, "yyyy-MM-dd") : undefined}
                    onChange={(e) => setCalendarEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Specify Time */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="cal-specify-time"
                checked={calendarSpecifyTime}
                onCheckedChange={(checked) => setCalendarSpecifyTime(checked === true)}
                className="border-[#131315]"
              />
              <Label htmlFor="cal-specify-time" className="text-sm text-[#131315] tracking-[0.14px] cursor-pointer">
                Préciser les horaires (par défaut toute la journée)
              </Label>
            </div>

            {calendarSpecifyTime && (
              <div className="flex items-center gap-4">
                <Input type="time" value={calendarStartTime} onChange={(e) => setCalendarStartTime(e.target.value)} className="border-[#f1f1f1] h-10 text-sm text-[#969390]" />
                <span className="text-sm text-[#131315]">-</span>
                <Input type="time" value={calendarEndTime} onChange={(e) => setCalendarEndTime(e.target.value)} className="border-[#f1f1f1] h-10 text-sm text-[#969390]" />
              </div>
            )}

            {/* Collaborateur */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315] tracking-[0.12px]">Collaborateur</Label>
              <div className="relative">
                <select
                  className="w-full appearance-none px-4 py-2 border border-[#969390] rounded-lg bg-white h-10 text-sm text-[#969390] tracking-[0.14px] focus:outline-none focus:ring-2 focus:ring-[#ea8b49]"
                  value={calendarUserId}
                  onChange={(e) => setCalendarUserId(e.target.value)}
                >
                  <option value="">Sélectionner un collaborateur (optionnel)</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-6 w-6 absolute right-2 top-2 pointer-events-none text-[#969390]" />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#f1f1f1] -mx-6" />

          <DialogFooter className="flex gap-6 justify-end">
            <Button variant="outline" onClick={() => setIsCalendarModalOpen(false)} className="border-[#ea8b49] text-[#ea8b49] hover:bg-[#ea8b49]/10">
              Annuler
            </Button>
            <Button className="bg-[#ea8b49] hover:bg-[#ea8b49]/90 text-white" onClick={() => setConfirmAction({
              title: 'Confirmer l\'ajout',
              message: 'Êtes-vous sûr de vouloir ajouter cette astreinte ?',
              onConfirm: handleCreateFromCalendar
            })} disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Valider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═════════════════════════════════════════════════ */}
      {/* MODAL 3 : Édition                                */}
      {/* ═════════════════════════════════════════════════ */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[408px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#131315]">Modifier l&apos;astreinte</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315] tracking-[0.12px]">Date</Label>
              <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="border border-[#969390]" />
            </div>
            <div className="flex items-center gap-4">
              <Input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} className="border-[#f1f1f1] h-10 text-sm" />
              <span>-</span>
              <Input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} className="border-[#f1f1f1] h-10 text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315] tracking-[0.12px]">Collaborateur</Label>
              <div className="relative">
                <select className="w-full appearance-none px-4 py-2 border border-[#969390] rounded-lg bg-white h-10 text-sm text-[#969390] tracking-[0.14px] focus:outline-none focus:ring-2 focus:ring-[#ea8b49]" value={editUserId} onChange={(e) => setEditUserId(e.target.value)}>
                  <option value="">(Non assigné)</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-6 w-6 absolute right-2 top-2 pointer-events-none text-[#969390]" />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button variant="destructive" onClick={() => setDeleteConfirmOpen(true)} disabled={isDeleting}>
              {isDeleting ? "..." : "Supprimer"}
            </Button>
            <Button className="bg-[#ea8b49] hover:bg-[#ea8b49]/90 text-white" onClick={() => setConfirmAction({
              title: 'Confirmer la modification',
              message: 'Êtes-vous sûr de vouloir modifier cette astreinte ?',
              onConfirm: handleUpdateShift
            })} disabled={isSubmitting}>
              {isSubmitting ? "..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═════════════════════════════════════════════════ */}
      {/* MODAL 4 : Détail du jour                         */}
      {/* ═════════════════════════════════════════════════ */}
      <Dialog open={isDayDetailModalOpen} onOpenChange={setIsDayDetailModalOpen}>
        <DialogContent className="max-w-[420px] rounded-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl border-0">
          {/* En-tête */}
          <div className="p-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 tracking-tight">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-50 text-green-600">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <span className="capitalize">{selectedDay ? format(selectedDay, "EEEE d MMMM", { locale: fr }) : "Détails"}</span>
            </DialogTitle>
          </div>

          {/* Liste des shifts */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50/50">
            {dayDetailShifts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <CalendarIcon className="h-8 w-8 text-gray-400 opacity-50" />
                </div>
                <p className="text-gray-500 font-medium">Aucune astreinte prévue pour ce jour.</p>
              </div>
            ) : (
              dayDetailShifts
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((shift) => {
                  const label = shift.user ? `${shift.user.firstName} ${shift.user.lastName}` : "Non assigné"
                  return (
                    <div
                      key={shift.id}
                      onClick={() => {
                        setIsDayDetailModalOpen(false)
                        setTimeout(() => handleShiftClick(shift), 150)
                      }}
                      className="group relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer flex items-start gap-4"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-green-500" />
                      <div className="flex-1 pl-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-50 text-green-600">Astreinte</span>
                          <span className="text-xs font-semibold text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-md">
                            {format(parseISO(shift.startTime), "HH:mm")} - {format(parseISO(shift.endTime), "HH:mm")}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{label}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                          <span>Modifiable</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 self-center group-hover:text-green-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  )
                })
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 bg-white space-y-2">
            <Button
              className="w-full bg-[#ea8b49] hover:bg-[#eb965d] active:bg-[#e07f3c] text-white gap-2 h-11 rounded-xl shadow-lg shadow-orange-900/10 font-medium transition-all hover:-translate-y-0.5"
              onClick={() => {
                setIsDayDetailModalOpen(false)
                setCalendarSpecifyTime(false)
                setCalendarUserId("")
                setCalendarEndDate(selectedDay ? format(selectedDay, "yyyy-MM-dd") : "")
                setIsCalendarModalOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              Ajouter une astreinte
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 h-11 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
              onClick={() => {
                if (selectedDay) {
                  setCurrentDate(selectedDay)
                  setViewMode("day")
                }
                setIsDayDetailModalOpen(false)
              }}
            >
              <Eye className="h-4 w-4" />
              Voir le jour en détail
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ MODAL CONFIRMATION SUPPRESSION ═══ */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-[380px] rounded-2xl p-0 overflow-hidden">
          <div className="flex flex-col items-center text-center p-6 pt-8">
            <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900 mb-2">Confirmer la suppression</DialogTitle>
            <p className="text-sm text-gray-500 leading-relaxed">
              Voulez-vous vraiment supprimer cette astreinte ?<br/>Cette action est irréversible.
            </p>
          </div>
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="flex-1 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100"
            >
              Annuler
            </button>
            <button
              onClick={handleDeleteShift}
              disabled={isDeleting}
              className="flex-1 py-3.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ MODAL CONFIRMATION ACTION (Ajout / Modification) ═══ */}
      <Dialog open={!!confirmAction} onOpenChange={(open) => { if (!open) setConfirmAction(null) }}>
        <DialogContent className="max-w-[380px] rounded-2xl p-0 overflow-hidden">
          <div className="flex flex-col items-center text-center p-6 pt-8">
            <div className="h-14 w-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
              <AlertTriangle className="h-7 w-7 text-[#ea8b49]" />
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900 mb-2">{confirmAction?.title}</DialogTitle>
            <p className="text-sm text-gray-500 leading-relaxed">{confirmAction?.message}</p>
          </div>
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => setConfirmAction(null)}
              className="flex-1 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                confirmAction?.onConfirm();
                setConfirmAction(null);
              }}
              disabled={isSubmitting}
              className="flex-1 py-3.5 text-sm font-semibold text-[#ea8b49] hover:bg-orange-50 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'En cours...' : 'Confirmer'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ TOAST NOTIFICATION (bas à droite) ═══ */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-sm ${
            toast.type === 'success'
              ? 'bg-white border-green-200 text-green-800'
              : 'bg-white border-red-200 text-red-800'
          }`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {toast.type === 'success' 
                ? <Check className="h-4 w-4 text-green-600" />
                : <AlertTriangle className="h-4 w-4 text-red-500" />
              }
            </div>
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
