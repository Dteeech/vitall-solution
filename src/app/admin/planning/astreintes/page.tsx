"use client"

import { useState, useEffect } from "react"
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
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

// Types pour l'API
type ShiftTypeAPI = "GARDE" | "ASTREINTE" | "FORMATION" | "REUNION"

interface ShiftAPI {
  id: string
  startTime: string // ISO date string
  endTime: string   // ISO date string
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

// Types pour l'UI - Seulement Astreinte
type ActivityType = "astreinte"

type Activity = {
  id: string
  type: ActivityType
  label: string
  collaborator?: string
  time?: string
}

type CalendarDay = {
  date: Date
  isCurrentMonth: boolean
  activities: Activity[]
}

const activityColors: Record<ActivityType, string> = {
  astreinte: "bg-[#e8f5e9] border-l-4 border-[#2e7d32]",    // Vert
}

const activityLabels: Record<ActivityType, string> = {
  astreinte: "Astreinte",
}

export default function AstreintesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [specifyTime, setSpecifyTime] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const [shifts, setShifts] = useState<ShiftAPI[]>([])
  const [users, setUsers] = useState<UserAPI[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Form states
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [endDate, setEndDate] = useState<string>("") // Pour plage de dates

  // Filter states
  const [selectedCollaboratorFilter, setSelectedCollaboratorFilter] = useState<string>('')

  // Edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<ShiftAPI | null>(null)
  const [editUserId, setEditUserId] = useState<string>('')
  const [editStartTime, setEditStartTime] = useState("09:00")
  const [editEndTime, setEditEndTime] = useState("17:00")
  const [editDate, setEditDate] = useState<string>("")
  const [isDeleting, setIsDeleting] = useState(false)

  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  // Fetch users
  useEffect(() => {
      fetch('/api/organization/users')
          .then(res => res.json())
          .then(data => setUsers(data))
          .catch(err => console.error(err));
  }, []);

  // Fetch planning
  const fetchPlanning = () => {
    setIsLoading(true);
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }).toISOString();
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }).toISOString();

    fetch(`/api/planning?start=${start}&end=${end}`)
        .then(res => res.json())
        .then((data: any[]) => {
            // Flatten shifts from all plannings
            const allShifts = data.flatMap((p: any) => p.shifts || []);
            // Filtrer seulement les astreintes
            const astreinteShifts = allShifts.filter((s: ShiftAPI) => s.type === 'ASTREINTE');
            setShifts(astreinteShifts);
        })
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
  };

  useEffect(() => {
      fetchPlanning();
  }, [currentDate]);

  // Generate calendar days
  const calendarDays = (() => {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(monthStart);
      const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
      const endDateCalendar = endOfWeek(monthEnd, { weekStartsOn: 1 });

      const days = eachDayOfInterval({ start: startDate, end: endDateCalendar });

      return days.map(day => {
          // Filter shifts for this day and potentially filter by collaborator
          const dayShifts = shifts.filter(shift => {
              const shiftDate = parseISO(shift.startTime);
              const matchesDate = isSameDay(shiftDate, day);
              
              if (!matchesDate) return false;
              if (selectedCollaboratorFilter && shift.user?.id !== selectedCollaboratorFilter) return false;
              
              return true;
          });

          const activities: Activity[] = dayShifts.map(shift => ({
              id: shift.id,
              type: 'astreinte',
              label: shift.user ? `${shift.user.firstName} ${shift.user.lastName}` : "Non assigné",
              collaborator: shift.user?.firstName,
              time: format(parseISO(shift.startTime), 'HH:mm') + ' - ' + format(parseISO(shift.endTime), 'HH:mm')
          }));

          return {
              date: day,
              isCurrentMonth: isSameMonth(day, monthStart),
              activities
          };
      });
  })();

  const handleDayClick = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      setSelectedDay(day.date)
      setEndDate(format(day.date, 'yyyy-MM-dd'))
      setIsModalOpen(true)
    }
  }

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleCreateShift = async () => {
      if (!selectedDay) return;

      setIsSubmitting(true);
      try {
          const startDateTime = new Date(selectedDay);
          
          let endDateObj: Date;
          if (endDate) {
              endDateObj = parseISO(endDate);
          } else {
              endDateObj = new Date(selectedDay);
          }

          if (specifyTime) {
            const [startHour, startMinute] = startTime.split(':').map(Number);
            startDateTime.setHours(startHour, startMinute);
            
            const [endHour, endMinute] = endTime.split(':').map(Number);
            endDateObj.setHours(endHour, endMinute);
          } else {
             startDateTime.setHours(0, 0, 0);
             endDateObj.setHours(23, 59, 59);
          }

          // Generate shifts for each day in range
          const daysToCreate = eachDayOfInterval({ start: startDateTime, end: endDateObj });
          
          const createPromises = daysToCreate.map(day => {
                const currentStart = new Date(day);
                const currentEnd = new Date(day);
                
                if (specifyTime) {
                    const [startHour, startMinute] = startTime.split(':').map(Number);
                    currentStart.setHours(startHour, startMinute);
                    const [endHour, endMinute] = endTime.split(':').map(Number);
                    currentEnd.setHours(endHour, endMinute);
                } else {
                    currentStart.setHours(0, 0, 0);
                    currentEnd.setHours(23, 59, 59);
                }

                const payload = {
                    startTime: currentStart.toISOString(),
                    endTime: currentEnd.toISOString(),
                    type: 'ASTREINTE',
                    userId: selectedUserId || undefined
                };
    
                return fetch('/api/planning', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
          });

          await Promise.all(createPromises);

          setIsModalOpen(false);
          fetchPlanning(); 
          
          setSelectedUserId('');
      } catch (error) {
          console.error("Error creating shift", error);
      } finally {
          setIsSubmitting(false);
      }
  }

  const handleShiftClick = (shift: ShiftAPI) => {
      setEditingShift(shift);
      setEditUserId(shift.user?.id || "");
      setEditDate(format(parseISO(shift.startTime), 'yyyy-MM-dd'));
      setEditStartTime(format(parseISO(shift.startTime), 'HH:mm'));
      setEditEndTime(format(parseISO(shift.endTime), 'HH:mm'));
      setIsEditModalOpen(true);
  }

  const handleUpdateShift = async () => {
      if (!editingShift) return;
      setIsSubmitting(true);
      try {
          const startDateTime = parseISO(editDate);
          const [startHour, startMinute] = editStartTime.split(':').map(Number);
          startDateTime.setHours(startHour, startMinute);

          const endDateTime = parseISO(editDate);
          const [endHour, endMinute] = editEndTime.split(':').map(Number);
          endDateTime.setHours(endHour, endMinute);

          if (endDateTime < startDateTime) {
             endDateTime.setDate(endDateTime.getDate() + 1);
          }

          const payload = {
              id: editingShift.id,
              startTime: startDateTime.toISOString(),
              endTime: endDateTime.toISOString(),
              type: 'ASTREINTE',
              userId: editUserId || undefined
          };

          const res = await fetch('/api/planning', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (res.ok) {
              setIsEditModalOpen(false);
              fetchPlanning();
          }
      } catch (error) {
          console.error("Error updating shift", error);
      } finally {
          setIsSubmitting(false);
      }
  }

  const handleDeleteShift = async () => {
      if (!editingShift) return;
      if (!confirm("Voulez-vous vraiment supprimer cette astreinte ?")) return;

      setIsDeleting(true);
      try {
          const res = await fetch(`/api/planning?id=${editingShift.id}`, {
              method: 'DELETE'
          });

          if (res.ok) {
              setIsEditModalOpen(false);
              fetchPlanning();
          }
      } catch (error) {
          console.error("Error deleting shift", error);
      } finally {
          setIsDeleting(false);
      }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-semibold text-[#131315]">
          Astreintes
        </h1>
        <p className="text-gray-500">Gestion des périodes d&apos;astreinte</p>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-[#131315]">
          Planning des astreintes
        </h2>

        <div className="flex flex-wrap gap-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handlePrevMonth}>
              <ChevronLeft className="h-5 w-5 text-[#132e49]" />
            </Button>

            <div className="min-w-[200px] flex items-center justify-center gap-2 px-4 py-2 border border-[#f1f1f1] rounded-lg bg-white h-10">
              <span className="text-base text-[#465b5e] font-normal capitalize">
                {format(currentDate, 'MMMM yyyy', { locale: fr })}
              </span>
              <CalendarIcon className="h-5 w-5 ml-auto text-[#131315]" />
            </div>

            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleNextMonth}>
              <ChevronRight className="h-5 w-5 text-[#132e49]" />
            </Button>
          </div>

          {/* Collaborator Filter */}
          <div className="w-[250px] relative">
             <select
                 className="w-full appearance-none px-4 py-2 border border-[#f1f1f1] rounded-lg bg-white h-10 text-sm text-[#969390] tracking-[0.14px] focus:outline-none focus:ring-2 focus:ring-[#ea8b49]"
                 value={selectedCollaboratorFilter}
                 onChange={(e) => setSelectedCollaboratorFilter(e.target.value)}
             >
                 <option value="">Tous les collaborateurs</option>
                 {users.map(user => (
                     <option key={user.id} value={user.id}>
                         {user.firstName} {user.lastName}
                     </option>
                 ))}
             </select>
             <ChevronDown className="h-6 w-6 absolute right-2 top-2 pointer-events-none text-[#131315]" />
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl shadow-[0px_1px_1px_0px_rgba(0,0,0,0.12)] border border-[#f1f1f1] overflow-hidden bg-white">
        <div className="grid grid-cols-7 border-b border-[#f1f1f1]">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 h-12 flex items-center justify-center border-r border-[#f1f1f1] last:border-r-0">
              <span className="text-[#969390] text-base font-medium">{day}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-fr">
           {isLoading ? (
               <div className="col-span-7 flex justify-center items-center h-64">Chargement...</div>
           ) : (
             calendarDays.map((day, index) => (
                <div
                key={day.date.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`
                    min-h-[140px] p-2 border-b border-r border-[#f1f1f1] flex flex-col gap-1 transition-colors
                    ${(index + 1) % 7 === 0 ? "border-r-0" : ""}
                    ${day.isCurrentMonth ? "bg-white cursor-pointer hover:bg-gray-50" : "bg-[#f9f9f9] text-gray-400"}
                `}
                >
                <span className={`
                    text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                    ${isSameDay(day.date, new Date()) ? "bg-[#ea8b49] text-white" : "text-[#131315]"}
                `}>
                    {format(day.date, 'd')}
                </span>

                <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[100px] scrollbar-hide">
                    {day.activities.map((activity) => (
                    <div 
                        key={activity.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            const shift = shifts.find(s => s.id === activity.id);
                            if (shift) handleShiftClick(shift);
                        }}
                        className={`${activityColors[activity.type]} px-2 py-1.5 rounded-r-md text-xs font-medium text-[#131315] tracking-[0.12px] text-left overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex flex-col gap-0.5 shadow-sm`}
                    >
                        <div className="flex justify-between items-center w-full">
                            <span className="font-bold uppercase text-[9px] opacity-70 leading-none truncate">{activityLabels[activity.type]}</span>
                            <span className="text-[9px] opacity-60 leading-none whitespace-nowrap ml-1">{activity.time}</span>
                        </div>
                        <span className="truncate leading-tight font-medium">{activity.label}</span>
                    </div>
                    ))}
                </div>
                </div>
            ))
           )}
        </div>
      </div>

      {/* Creation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[408px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#131315]">
              Ajouter une astreinte
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            
            {/* Target Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                <Label className="text-xs text-[#131315] tracking-[0.12px]">Date début</Label>
                <div className="flex items-center gap-2 px-4 py-2 border border-[#f1f1f1] rounded-lg bg-gray-50 h-10 cursor-not-allowed">
                    <span className="text-sm text-[#969390] tracking-[0.14px]">
                    {selectedDay ? format(selectedDay, 'dd/MM/yyyy') : ""}
                    </span>
                    <CalendarIcon className="h-4 w-4 ml-auto text-[#131315]" />
                </div>
                </div>

                <div className="flex flex-col gap-2">
                <Label className="text-xs text-[#131315] tracking-[0.12px]">Date fin</Label>
                <div className="flex items-center gap-2 px-2 py-2 border border-[#969390] rounded-lg bg-white h-10">
                    <Input 
                        type="date"
                        className="border-0 p-0 h-auto text-sm text-[#131315] focus-visible:ring-0"
                        value={endDate}
                        min={selectedDay ? format(selectedDay, 'yyyy-MM-dd') : undefined}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
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
              <Label htmlFor="specify-time" className="text-sm text-[#131315] tracking-[0.14px] cursor-pointer">
                Préciser les horaires (par défaut toute la journée)
              </Label>
            </div>

            {/* Time Range */}
            {specifyTime && (
              <div className="flex items-center gap-4">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-[#f1f1f1] h-10 text-sm text-[#969390] tracking-[0.14px]"
                />
                <span className="text-sm text-[#131315] tracking-[0.14px]">-</span>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-[#f1f1f1] h-10 text-sm text-[#969390] tracking-[0.14px]"
                />
              </div>
            )}

            {/* Collaborator */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315] tracking-[0.12px]">Collaborateur</Label>
              <div className="relative">
                 <select
                    className="w-full appearance-none px-4 py-2 border border-[#969390] rounded-lg bg-white h-10 text-sm text-[#969390] tracking-[0.14px] focus:outline-none focus:ring-2 focus:ring-[#ea8b49]"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="">Sélectionner un collaborateur (optionnel)</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                        </option>
                    ))}
                </select>
                <ChevronDown className="h-6 w-6 absolute right-2 top-2 pointer-events-none text-[#969390]" />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-6 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-[#ea8b49] text-[#ea8b49] hover:bg-[#ea8b49]/10"
            >
              Annuler
            </Button>
            <Button 
                className="bg-[#ea8b49] hover:bg-[#ea8b49]/90 text-white"
                onClick={handleCreateShift}
                disabled={isSubmitting}
            >
              {isSubmitting ? "Création..." : "Valider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[408px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#131315]">
              Modifier l&apos;astreinte
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Date */}
            <div className="flex flex-col gap-2">
                <Label className="text-xs text-[#131315] tracking-[0.12px]">Date</Label>
                <Input 
                    type="date" 
                    value={editDate} 
                    onChange={(e) => setEditDate(e.target.value)}
                    className="border border-[#969390]"
                />
            </div>

            {/* Time */}
            <div className="flex items-center gap-4">
                <Input
                  type="time"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                  className="border-[#f1f1f1] h-10 text-sm"
                />
                <span>-</span>
                <Input
                  type="time"
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                  className="border-[#f1f1f1] h-10 text-sm"
                />
            </div>

            {/* User */}
            <div className="flex flex-col gap-2">
                <Label className="text-xs text-[#131315] tracking-[0.12px]">Collaborateur</Label>
                <select
                    className="w-full appearance-none px-4 py-2 border border-[#969390] rounded-lg bg-white h-10 text-sm"
                    value={editUserId}
                    onChange={(e) => setEditUserId(e.target.value)}
                >
                    <option value="">(Non assigné)</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                </select>
            </div>
          </div>

          <DialogFooter className="flex gap-2 justify-end mt-4">
             <Button 
                variant="destructive"
                onClick={handleDeleteShift}
                disabled={isDeleting}
            >
                {isDeleting ? "..." : "Supprimer"}
            </Button>
            <Button 
                className="bg-[#ea8b49] hover:bg-[#ea8b49]/90 text-white"
                onClick={handleUpdateShift}
                disabled={isSubmitting}
            >
                {isSubmitting ? "..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
