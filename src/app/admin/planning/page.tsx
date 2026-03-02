"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown, Plus, Filter, LayoutList, LayoutGrid, Eye, Check, AlertTriangle, X } from "lucide-react"
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
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths, getDay, parseISO } from "date-fns"
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

interface PlanningAPI {
    id: string
    name: string
    shifts: ShiftAPI[]
}

// Types pour l'UI
type ActivityType = "interventions" | "formation" | "entretien" | "astreinte" | "reunion"

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
  interventions: "bg-[#e3f2fd] border-l-4 border-[#1565c0]", // Bleu materiel
  formation: "bg-[#f3e5f5] border-l-4 border-[#7b1fa2]",     // Violet
  entretien: "bg-[#fff3e0] border-l-4 border-[#ef6c00]",     // Orange
  astreinte: "bg-[#e8f5e9] border-l-4 border-[#2e7d32]",    // Vert
  reunion: "bg-[#f5f5f5] border-l-4 border-[#616161]"       // Gris
}

const activityLabels: Record<ActivityType, string> = {
  interventions: "Garde",
  formation: "Formation",
  entretien: "Entretien",
  astreinte: "Astreinte",
  reunion: "Réunion"
}

// Mapping API type -> UI type
const mapShiftTypeToActivityType = (type: ShiftTypeAPI): ActivityType => {
    switch (type) {
        case 'GARDE': return 'interventions';
        case 'ASTREINTE': return 'astreinte';
        case 'FORMATION': return 'formation';
        case 'REUNION': return 'reunion';
        default: return 'interventions';
    }
}

const mapActivityTypeToShiftType = (type: ActivityType): ShiftTypeAPI => {
    switch (type) {
        case 'interventions': return 'GARDE';
        case 'astreinte': return 'ASTREINTE';
        case 'formation': return 'FORMATION';
        case 'reunion': return 'REUNION';
        default: return 'GARDE';
    }
}


function ActivityTag({ type, label, time, onClick }: { type: ActivityType, label: string, time?: string, onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div 
        onClick={onClick}
        className={`${activityColors[type]} px-2 py-1.5 rounded-r-md text-xs font-medium text-[#131315] tracking-[0.12px] text-left overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex flex-col gap-0.5 shadow-sm`}
        title={`${activityLabels[type]} - ${label} (${time})`}
    >
      <div className="flex justify-between items-center w-full">
         <span className="font-bold uppercase text-[9px] opacity-70 leading-none truncate">{activityLabels[type]}</span>
         {time && <span className="text-[9px] opacity-60 leading-none whitespace-nowrap ml-1">{time}</span>}
      </div>
      <span className="truncate leading-tight font-medium">{label}</span>
    </div>
  )
}

export default function PlanningPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [specifyTime, setSpecifyTime] = useState(false)
  const [startDateEditable, setStartDateEditable] = useState(false)
  const [startDateStr, setStartDateStr] = useState('')

  // Toast & confirmation states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setToast({ message, type })
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3500)
  }
  
  // View State (Mois / Jour)
  const [viewMode, setViewMode] = useState<"month" | "day">("day")
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const [shifts, setShifts] = useState<ShiftAPI[]>([])

  // Fonction de navigation
  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
        setCurrentDate(curr => direction === 'prev' ? subMonths(curr, 1) : addMonths(curr, 1))
    } else {
        // En mode jour, on change de jour
        const newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1))
        setCurrentDate(newDate)
    }
  }

  // Fonctions spécifiques à la vue Jour
  const getHoursPoints = () => Array.from({ length: 24 }, (_, i) => i)

  const getShiftStyle = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    // Calcul de la position (startHour * 60 + startMin)
    const startMinutes = s.getHours() * 60 + s.getMinutes()
    const durationMinutes = (e.getTime() - s.getTime()) / (1000 * 60)
    
    // On suppose une largeur totale fixe ou relative. 
    // Si la timeline fait 100%, 24h = 1440min.
    const leftPercent = (startMinutes / 1440) * 100
    const widthPercent = (durationMinutes / 1440) * 100
    
    return {
        left: `${leftPercent}%`,
        width: `${widthPercent}%`
    }
  }

  // Filtrage des shifts pour la vue Jour
  const getDayShifts = (userId: string) => {
    return shifts.filter(s => {
        const shiftDate = new Date(s.startTime)
        return isSameDay(shiftDate, currentDate) && s.user?.id === userId
    })
  }

  // Tous les shifts du jour courant (tous collaborateurs) pour la vue jour
  const getAllDayShifts = () => {
    return shifts.filter(s => isSameDay(new Date(s.startTime), currentDate))
  }

  // Calcul des swim lanes pour les shifts qui se chevauchent
  const computeSwimLanes = (userShifts: ShiftAPI[]): Map<string, { lane: number; totalLanes: number }> => {
    const laneMap = new Map<string, { lane: number; totalLanes: number }>()
    if (userShifts.length === 0) return laneMap

    // Trier par heure de début
    const sorted = [...userShifts].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    // Identifier les groupes de shifts qui se chevauchent
    const groups: ShiftAPI[][] = []
    let currentGroup: ShiftAPI[] = [sorted[0]]
    let groupEnd = new Date(sorted[0].endTime).getTime()

    for (let i = 1; i < sorted.length; i++) {
      const shiftStart = new Date(sorted[i].startTime).getTime()
      if (shiftStart < groupEnd) {
        // Ce shift chevauche le groupe
        currentGroup.push(sorted[i])
        groupEnd = Math.max(groupEnd, new Date(sorted[i].endTime).getTime())
      } else {
        groups.push(currentGroup)
        currentGroup = [sorted[i]]
        groupEnd = new Date(sorted[i].endTime).getTime()
      }
    }
    groups.push(currentGroup)

    // Assigner les lanes par groupe
    for (const group of groups) {
      for (let lane = 0; lane < group.length; lane++) {
        laneMap.set(group[lane].id, { lane, totalLanes: group.length })
      }
    }

    return laneMap
  }

  const [users, setUsers] = useState<UserAPI[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Form states
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('interventions')
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [endDate, setEndDate] = useState<string>("") // Pour plage de dates

  // Filter states
  const [selectedCollaboratorFilter, setSelectedCollaboratorFilter] = useState<string>('')

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<ShiftAPI | null>(null)
  
  // États pour le formulaire d'édition
  const [editActivity, setEditActivity] = useState<ActivityType>('interventions')
  const [editUserId, setEditUserId] = useState<string>('')
  const [editStartTime, setEditStartTime] = useState("09:00")
  const [editEndTime, setEditEndTime] = useState("17:00")
  const [editDate, setEditDate] = useState<string>("")
  const [isDeleting, setIsDeleting] = useState(false)
  const datePickerRef = useRef<HTMLInputElement>(null)

  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  // Fetch planning data
  const fetchPlanning = async () => {
    setIsLoading(true);
    try {
        const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }).toISOString();
        const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }).toISOString();

        const res = await fetch(`/api/planning?start=${startDate}&end=${endDate}`);
        if (res.ok) {
            const data: PlanningAPI[] = await res.json();
            // Aplatir tous les shifts de tous les plannings pour l'instant
            const allShifts = data.flatMap(p => p.shifts);
            setShifts(allShifts);
        }
    } catch (error) {
        console.error("Failed to fetch planning", error);
    } finally {
        setIsLoading(false);
    }
}

  useEffect(() => {
    fetchPlanning();
  }, [currentDate]);

  // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/organization/users');
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        }
        fetchUsers();
    }, []);

  // Generate calendar days
  const calendarDays: CalendarDay[] = (() => {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(monthStart);
      const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
      const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

      const dayInterval = eachDayOfInterval({ start: startDate, end: endDate });

      return dayInterval.map(day => {
          // Find shifts for this day
          let dayShifts = shifts.filter(s => isSameDay(parseISO(s.startTime), day));

          // Apply collaborator filter
          if (selectedCollaboratorFilter) {
               // Filtrer les shifts assignés au collaborateur sélectionné
               dayShifts = dayShifts.filter(s => s.user?.id === selectedCollaboratorFilter);
          }

          const activities: Activity[] = dayShifts.map(s => ({
              id: s.id,
              type: mapShiftTypeToActivityType(s.type),
              label: s.user ? `${s.user.firstName} ${s.user.lastName}` : 'Dispo', // Affiche le nom ou "Dispo"
              collaborator: s.user ? `${s.user.firstName} ${s.user.lastName}` : undefined,
              time: `${format(parseISO(s.startTime), 'HH:mm')} - ${format(parseISO(s.endTime), 'HH:mm')}`
          }));

          return {
              date: day,
              isCurrentMonth: isSameMonth(day, monthStart),
              activities
          };
      });
  })();

  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false)
  const [dayDetailShifts, setDayDetailShifts] = useState<ShiftAPI[]>([])

  const handleDayClick = (day: CalendarDay) => {
    // Si pas le mois courant, on ne fait rien (ou on navigue ?)
    if (!day.isCurrentMonth) return;

    // Récupérer les shifts du jour (format local pour éviter le décalage UTC)
    const dayFormatted = format(day.date, 'yyyy-MM-dd');
    const dayShifts = shifts.filter(s => format(parseISO(s.startTime), 'yyyy-MM-dd') === dayFormatted);

    setSelectedDay(day.date);
    // Par défaut, date fin = date début
    setEndDate(format(day.date, 'yyyy-MM-dd'));

    if (dayShifts.length > 0) {
        // Si activités existantes : Ouvrir le détail
        setDayDetailShifts(dayShifts);
        setIsDayDetailModalOpen(true);
    } else {
        // Sinon : Création directe (date verrouillée sur le jour cliqué)
        setStartDateEditable(false);
        setStartDateStr(format(day.date, 'yyyy-MM-dd'));
        setSpecifyTime(false);
        setIsModalOpen(true);
    }
  }

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleShiftClick = (shift: ShiftAPI) => {
      setEditingShift(shift);
      setEditActivity(mapShiftTypeToActivityType(shift.type));
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
              type: mapActivityTypeToShiftType(editActivity),
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
              setTimeout(() => showToast('Activité modifiée avec succès'), 300);
          }
      } catch (error) {
          console.error("Error updating shift", error);
          showToast('Erreur lors de la modification', 'error');
      } finally {
          setIsSubmitting(false);
      }
  }

  const handleDeleteShift = async () => {
      if (!editingShift) return;

      setIsDeleting(true);
      try {
          const res = await fetch(`/api/planning?id=${editingShift.id}`, {
              method: 'DELETE'
          });

          if (res.ok) {
              setDeleteConfirmOpen(false);
              setIsEditModalOpen(false);
              fetchPlanning();
              setTimeout(() => showToast('Activité supprimée'), 300);
          }
      } catch (error) {
          console.error("Error deleting shift", error);
          showToast('Erreur lors de la suppression', 'error');
      } finally {
          setIsDeleting(false);
      }
  }
  
  const handleCreateShift = async () => {
      // Utiliser startDateStr (qui est toujours à jour, qu'on soit en mode libre ou verrouillé)
      if (!startDateStr) return;

      setIsSubmitting(true);
      try {
          const startDayStr = startDateStr;
          const endDayStr = endDate ? endDate : startDayStr;

          // Générer un tableau de jours entre start et end (bornes incluses)
          // parseISO('yyyy-MM-dd') renvoie minuit heure locale
          const daysToCreate = eachDayOfInterval({ 
            start: parseISO(startDayStr), 
            end: parseISO(endDayStr) 
          });

          // Créer un shift pour CHAQUE jour de l'intervalle
          const createPromises = daysToCreate.map(day => {
                const currentStart = new Date(day);
                const currentEnd = new Date(day);

                if (specifyTime) {
                    const [startHour, startMinute] = startTime.split(':').map(Number);
                    currentStart.setHours(startHour, startMinute, 0, 0);

                    const [endHour, endMinute] = endTime.split(':').map(Number);
                    currentEnd.setHours(endHour, endMinute, 0, 0);
                    
                    // Si l'heure de fin est inférieure à l'heure de début (ex: nuit), on ajoute 1 jour
                    if (currentEnd < currentStart) {
                        currentEnd.setDate(currentEnd.getDate() + 1);
                    }
                } else {
                    // Journée entière : 00:00 -> 23:59
                    currentStart.setHours(0, 0, 0, 0);
                    currentEnd.setHours(23, 59, 59, 999);
                }

                const payload = {
                    startTime: currentStart.toISOString(),
                    endTime: currentEnd.toISOString(),
                    type: mapActivityTypeToShiftType(selectedActivity),
                    userId: selectedUserId || undefined // undefined si vide
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
          setTimeout(() => showToast('Activité créée avec succès'), 300);
          
          // Reset relevant fields
          setSelectedUserId('');
          setSelectedActivity('interventions');

      } catch (error) {
          console.error("Error creating shift", error);
          showToast('Erreur lors de la création', 'error');
      } finally {
          setIsSubmitting(false);
      }
  }

  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-xl shadow-sm border border-gray-100/50">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Planning</h1>
        
        <div className="flex items-center gap-3">
          {/* Navigation Date */}
          <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigateDate('prev')}
                className="h-8 w-8 hover:bg-white hover:shadow-sm transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </Button>
            
            <div 
              className="flex items-center gap-2 px-3 min-w-[140px] justify-center text-sm font-medium text-gray-700 capitalize cursor-pointer hover:text-orange-600 transition-colors relative"
              onClick={() => datePickerRef.current?.showPicker()}
            >
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              {viewMode === 'month' 
                ? format(currentDate, "MMMM yyyy", { locale: fr })
                : format(currentDate, "d MMMM yyyy", { locale: fr })
              }
              <input 
                ref={datePickerRef}
                type="date" 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                value={format(currentDate, 'yyyy-MM-dd')}
                onChange={(e) => {
                  if (e.target.value) {
                    setCurrentDate(parseISO(e.target.value));
                    if (viewMode === 'month') setViewMode('day');
                  }
                }}
              />
            </div>

            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigateDate('next')}
                className="h-8 w-8 hover:bg-white hover:shadow-sm transition-all"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          {/* Filtre Employés */}
          <Select 
            value={selectedCollaboratorFilter} 
            onValueChange={setSelectedCollaboratorFilter}
          >
            <SelectTrigger className="w-[180px] h-10 bg-gray-50 border-gray-100">
              <SelectValue placeholder="Tous les employés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              {users.map(u => (
                <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sélecteur de Vue */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 bg-gray-50 border-gray-100">
                    {viewMode === 'month' ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
                    {viewMode === 'month' ? 'Mois' : 'Jour'}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setViewMode('day')}>
                    Vue Jour
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode('month')}>
                    Vue Mois
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={() => {
              // Bouton + : date de début libre (modifiable)
              setSelectedDay(null);
              setStartDateEditable(true);
              setStartDateStr(format(currentDate, 'yyyy-MM-dd'));
              setEndDate(format(currentDate, 'yyyy-MM-dd'));
              setSpecifyTime(viewMode === 'day');
              setIsModalOpen(true);
            }} 
            className="h-10 bg-[#ea8b49] text-white hover:bg-[#ea8b49]/90 gap-2 px-4 shadow-lg shadow-orange-900/10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'month' ? (
        // VUE MOIS
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
                    const dayFormatted = format(day.date, 'yyyy-MM-dd');
                    const dayShifts = shifts.filter(s => format(parseISO(s.startTime), 'yyyy-MM-dd') === dayFormatted);
                    
                    return (
                        <div
                        key={index}
                        onClick={() => handleDayClick(day)}
                        className={`
                            min-h-[100px] p-2 border-b border-r border-gray-50 relative group transition-all hover:bg-gray-50/30 cursor-pointer flex flex-col gap-1
                            ${!day.isCurrentMonth ? "bg-gray-50/50 text-gray-300" : "bg-white"}
                            ${isSameDay(day.date, new Date()) ? "bg-orange-50/30" : ""}
                        `}
                        >
                        <div className={`
                            text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full shrink-0
                            ${isSameDay(day.date, new Date()) ? "bg-[#ea8b49] text-white shadow-md shadow-orange-200" : "text-gray-700"}
                        `}>
                            {format(day.date, "d")}
                        </div>
                        
                        <div className="flex-1 max-h-[120px] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            {dayShifts.map((shift) => {
                                const type = mapShiftTypeToActivityType(shift.type);
                                const label = shift.user ? `${shift.user.firstName} ${shift.user.lastName}` : "Non assigné";
                                return (
                                    <ActivityTag 
                                        key={shift.id} 
                                        type={type} 
                                        label={label}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShiftClick(shift);
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
        // VUE JOUR (TIMELINE)
        <div className="flex-1 overflow-auto border border-gray-100 rounded-lg bg-white relative">
             {/* Header des heures */}
             <div className="flex border-b border-gray-100 sticky top-0 bg-white z-10 min-w-[1400px]">
                <div className="w-60 shrink-0 p-3 border-r border-gray-100 bg-gray-50/50 font-semibold text-gray-500 text-sm flex items-center">
                    Collaborateurs
                </div>
                <div className="flex-1 relative h-10">
                    {getHoursPoints().map(hour => (
                        <div key={hour} className="absolute top-0 bottom-0 text-xs text-gray-400 border-l border-gray-100 pl-1 flex items-center" style={{ left: `${(hour / 24) * 100}%` }}>
                            {hour.toString().padStart(2, '0')}:00
                        </div>
                    ))}
                </div>
             </div>

             {/* Corps du planning */}
             <div className="min-w-[1400px] relative">
                  {/* Ligne orange "Maintenant" */}
                  {isSameDay(currentDate, new Date()) && (() => {
                      const now = new Date();
                      const localMinutes = now.getHours() * 60 + now.getMinutes();
                      const leftPct = (localMinutes / 1440) * 100;
                      // Le calcul utilise la largeur de la colonne users (240px) + % de la zone timeline
                      return (
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-orange-500 z-20 pointer-events-none"
                          style={{ left: `calc(240px + (100% - 240px) * ${leftPct / 100})` }}
                        >
                           <div className="w-2.5 h-2.5 bg-orange-500 rounded-full -ml-[4px] -mt-1 shadow-sm shadow-orange-300"></div>
                        </div>
                      );
                  })()}

                  {users.filter(u => (selectedCollaboratorFilter && selectedCollaboratorFilter !== 'all') ? u.id === selectedCollaboratorFilter : true).map(user => {
                      const userShifts = getDayShifts(user.id);
                      const swimLanes = computeSwimLanes(userShifts);
                      const maxLanes = userShifts.length > 0 ? Math.max(...Array.from(swimLanes.values()).map(v => v.totalLanes)) : 1;
                      // Check pseudo astreinte tag (if user has any astreinte shift today)
                      const hasAstreinte = userShifts.some(s => s.type === 'ASTREINTE');

                      return (
                        <div key={user.id} className="flex border-b border-gray-50 hover:bg-gray-50/20 transition-colors" style={{ height: `${Math.max(64, maxLanes * 36 + 8)}px` }}>
                             {/* Colonne user */}
                            <div className="w-60 shrink-0 p-3 border-r border-gray-100 flex items-center gap-2 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                <div className="h-8 w-8 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold border border-gray-200">
                                    {user.firstName[0]}{user.lastName[0]}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-gray-700 truncate">{user.firstName} {user.lastName}</span>
                                    {hasAstreinte && (
                                        <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded w-fit font-medium">Astreinte</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Zone de timeline */}
                            <div 
                                className="flex-1 relative h-full bg-[linear-gradient(90deg,transparent_0%,transparent_98%,#f8fafc_98%,#f8fafc_100%)] bg-[size:4.166%_100%] cursor-pointer"
                                onClick={(e) => {
                                    // Calculate clicked hour from mouse position
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const pct = x / rect.width;
                                    const totalMinutes = Math.floor(pct * 1440);
                                    const clickedHour = Math.floor(totalMinutes / 60);
                                    const clickedMin = Math.floor(totalMinutes / 30) * 30 % 60; // Snap to 30min
                                    const startH = `${clickedHour.toString().padStart(2, '0')}:${clickedMin.toString().padStart(2, '0')}`;
                                    const endH = `${Math.min(clickedHour + 1, 23).toString().padStart(2, '0')}:${clickedMin.toString().padStart(2, '0')}`;

                                    setSelectedDay(null);
                                    setStartDateEditable(false);
                                    setStartDateStr(format(currentDate, 'yyyy-MM-dd'));
                                    setEndDate(format(currentDate, 'yyyy-MM-dd'));
                                    setSpecifyTime(true);
                                    setStartTime(startH);
                                    setEndTime(endH);
                                    setSelectedUserId(user.id);
                                    setIsModalOpen(true);
                                }}
                            >
                                {/* Grille de fond via background-image ou divs */}
                                {getHoursPoints().map(hour => (
                                    <div key={hour} className="absolute top-0 bottom-0 border-l border-gray-100/50 h-full pointer-events-none" style={{ left: `${(hour / 24) * 100}%` }}></div>
                                ))}

                                {/* Shifts */}
                                {userShifts.map(shift => {
                                    const type = mapShiftTypeToActivityType(shift.type)
                                    const posStyle = getShiftStyle(shift.startTime, shift.endTime)
                                    const laneInfo = swimLanes.get(shift.id) || { lane: 0, totalLanes: 1 }
                                    const laneHeight = 100 / laneInfo.totalLanes
                                    const topPct = laneInfo.lane * laneHeight
                                    return (
                                        <div 
                                            key={shift.id}
                                            onClick={(e) => { e.stopPropagation(); handleShiftClick(shift); }}
                                            className={`absolute rounded px-2 text-xs flex items-center gap-1 cursor-pointer hover:brightness-95 shadow-sm overflow-hidden whitespace-nowrap z-10 border-l-4 transition-all
                                                ${type === 'interventions' ? 'bg-[#e3f2fd] border-[#1565c0] text-[#0d47a1]' : ''}
                                                ${type === 'formation' ? 'bg-[#f3e5f5] border-[#7b1fa2] text-[#4a148c]' : ''}
                                                ${type === 'entretien' ? 'bg-[#fff3e0] border-[#ef6c00] text-[#e65100]' : ''}
                                                ${type === 'astreinte' ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20]' : ''}
                                                ${type === 'reunion' ? 'bg-[#f5f5f5] border-[#616161] text-[#424242]' : ''}
                                            `}
                                            style={{ ...posStyle, top: `calc(${topPct}% + 4px)`, height: `calc(${laneHeight}% - 8px)` }}
                                            title={`${format(parseISO(shift.startTime), 'HH:mm')} - ${format(parseISO(shift.endTime), 'HH:mm')} : ${activityLabels[type]}`}
                                        >
                                            <span className="font-semibold truncate">{activityLabels[type]}</span>
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

      {/* MODAL CREATION (Reused) */}
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
              <div className="relative">
                <select
                    className="w-full appearance-none px-4 py-2 border border-[#969390] rounded-lg bg-white h-10 text-sm text-[#969390] tracking-[0.14px] focus:outline-none focus:ring-2 focus:ring-[#ea8b49]"
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value as ActivityType)}
                >
                    <option value="interventions">Garde</option>
                    <option value="formation">Formation</option>
                    <option value="entretien">Entretien</option>
                    <option value="astreinte">Astreinte</option>
                    <option value="reunion">Réunion</option>
                </select>
                <ChevronDown className="h-6 w-6 absolute right-2 top-2 pointer-events-none text-[#969390]" />
              </div>
            </div>

            {/* Target Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                <Label className="text-xs text-[#131315] tracking-[0.12px]">
                    Date début <span className="text-[#d63737]">*</span>
                </Label>
                {startDateEditable ? (
                  <div className="flex items-center gap-2 px-2 py-2 border border-[#969390] rounded-lg bg-white h-10">
                    <Input 
                        type="date"
                        className="border-0 p-0 h-auto text-sm text-[#131315] focus-visible:ring-0"
                        value={startDateStr}
                        onChange={(e) => {
                          setStartDateStr(e.target.value);
                          setSelectedDay(e.target.value ? parseISO(e.target.value) : null);
                          // Mettre à jour la date fin si elle est avant la date début
                          if (e.target.value && (!endDate || e.target.value > endDate)) {
                            setEndDate(e.target.value);
                          }
                        }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 border border-[#f1f1f1] rounded-lg bg-gray-50 h-10 cursor-not-allowed">
                    <span className="text-sm text-[#969390] tracking-[0.14px]">
                    {selectedDay ? format(selectedDay, 'dd/MM/yyyy') : format(currentDate, 'dd/MM/yyyy')}
                    </span>
                    <CalendarIcon className="h-4 w-4 ml-auto text-[#131315]" />
                  </div>
                )}
                </div>

                <div className="flex flex-col gap-2">
                <Label className="text-xs text-[#131315] tracking-[0.12px]">
                    Date fin
                </Label>
                <div className="flex items-center gap-2 px-2 py-2 border border-[#969390] rounded-lg bg-white h-10">
                    <Input 
                        type="date"
                        className="border-0 p-0 h-auto text-sm text-[#131315] focus-visible:ring-0"
                        value={endDate}
                        min={startDateStr || format(currentDate, 'yyyy-MM-dd')}
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
              <Label className="text-xs text-[#131315] tracking-[0.12px]">
                Collaborateur
              </Label>
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

          <div className="h-[1px] bg-[#f1f1f1] -mx-6" />

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
                onClick={() => setConfirmAction({
                    title: 'Confirmer l\'ajout',
                    message: 'Êtes-vous sûr de vouloir ajouter cette activité ?',
                    onConfirm: handleCreateShift
                })}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Création..." : "Valider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Detail Modal (Reused) */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[408px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#131315]">
              Modifier l&apos;activité
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Activity Type */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#131315] tracking-[0.12px]">Type</Label>
              <div className="relative">
                <select
                    className="w-full appearance-none px-4 py-2 border border-[#969390] rounded-lg bg-white h-10 text-sm text-[#969390] tracking-[0.14px] focus:outline-none focus:ring-2 focus:ring-[#ea8b49]"
                    value={editActivity}
                    onChange={(e) => setEditActivity(e.target.value as ActivityType)}
                >
                    <option value="interventions">Garde</option>
                    <option value="formation">Formation</option>
                    <option value="entretien">Entretien</option>
                    <option value="astreinte">Astreinte</option>
                    <option value="reunion">Réunion</option>
                </select>
                <ChevronDown className="h-6 w-6 absolute right-2 top-2 pointer-events-none text-[#969390]" />
              </div>
            </div>

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
                <div className="relative">
                  <select
                      className="w-full appearance-none px-4 py-2 border border-[#969390] rounded-lg bg-white h-10 text-sm text-[#969390] tracking-[0.14px] focus:outline-none focus:ring-2 focus:ring-[#ea8b49]"
                      value={editUserId}
                      onChange={(e) => setEditUserId(e.target.value)}
                  >
                      <option value="">(Non assigné)</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                  </select>
                  <ChevronDown className="h-6 w-6 absolute right-2 top-2 pointer-events-none text-[#969390]" />
                </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 justify-end mt-4">
             <Button 
                variant="destructive"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={isDeleting}
            >
                {isDeleting ? "..." : "Supprimer"}
            </Button>
            <Button 
                className="bg-[#ea8b49] hover:bg-[#ea8b49]/90 text-white"
                onClick={() => setConfirmAction({
                    title: 'Confirmer la modification',
                    message: 'Êtes-vous sûr de vouloir modifier cette activité ?',
                    onConfirm: handleUpdateShift
                })}
                disabled={isSubmitting}
            >
                {isSubmitting ? "..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day Detail Modal */}
      <Dialog open={isDayDetailModalOpen} onOpenChange={setIsDayDetailModalOpen}>
        <DialogContent className="max-w-[420px] rounded-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl border-0">
             {/* En-tête avec date */}
            <div className="p-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 tracking-tight">
                    <div className="h-10 w-10 btn-ghost rounded-full flex items-center justify-center bg-orange-50 text-orange-600">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                    <span className="capitalize">
                        {selectedDay ? format(selectedDay, 'EEEE d MMMM', { locale: fr }) : "Détails"}
                    </span>
                </DialogTitle>
            </div>
            
            {/* Liste des shifts */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50/50">
                {dayDetailShifts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                             <CalendarIcon className="h-8 w-8 text-gray-400 opacity-50" />
                        </div>
                        <p className="text-gray-500 font-medium">Aucune activité prévue pour ce jour.</p>
                    </div>
                ) : (
                    dayDetailShifts.sort((a,b) => a.startTime.localeCompare(b.startTime)).map((shift, i) => {
                        const type = mapShiftTypeToActivityType(shift.type);
                        const label = shift.user ? `${shift.user.firstName} ${shift.user.lastName}` : "Non assigné";
                        return (
                            <div 
                                key={shift.id}
                                onClick={() => {
                                    setIsDayDetailModalOpen(false); // Close details
                                    setTimeout(() => {
                                        handleShiftClick(shift); // Pre-fill edit form
                                    }, 150);
                                }}
                                className="group relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer flex items-start gap-4"
                            > 
                                {/* Indicateur de couleur vertical */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                                    type === 'interventions' ? 'bg-blue-500' : 
                                    type === 'astreinte' ? 'bg-green-500' :
                                    type === 'formation' ? 'bg-purple-500' : 
                                    type === 'entretien' ? 'bg-orange-500' : 'bg-gray-500'
                                }`} />

                                <div className="flex-1 pl-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                            type === 'interventions' ? 'bg-blue-50 text-blue-600' : 
                                            type === 'astreinte' ? 'bg-green-50 text-green-600' :
                                            type === 'formation' ? 'bg-purple-50 text-purple-600' : 
                                            type === 'entretien' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-500'
                                        }`}>
                                            {activityLabels[type]}
                                        </span>
                                        <span className="text-xs font-semibold text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-md">
                                            {format(parseISO(shift.startTime), 'HH:mm')} - {format(parseISO(shift.endTime), 'HH:mm')}
                                        </span>
                                    </div>
                                    
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{label}</h4>
                                    
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                                        <span>Modifiable</span>
                                    </div>
                                </div>
                                
                                <ChevronRight className="h-5 w-5 text-gray-300 self-center group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                            </div>
                        )
                    })
                )}
            </div>

            {/* Footer avec Boutons */}
            <div className="p-5 border-t border-gray-100 bg-white space-y-2">
                <Button 
                    className="w-full bg-[#ea8b49] hover:bg-[#eb965d] active:bg-[#e07f3c] text-white gap-2 h-11 rounded-xl shadow-lg shadow-orange-900/10 font-medium transition-all hover:-translate-y-0.5"
                    onClick={() => {
                        setIsDayDetailModalOpen(false);
                        setStartDateEditable(false);
                        setStartDateStr(selectedDay ? format(selectedDay, 'yyyy-MM-dd') : format(currentDate, 'yyyy-MM-dd'));
                        setSpecifyTime(false);
                        setIsModalOpen(true);
                    }}
                >
                    <Plus className="h-4 w-4" />
                    Ajouter une activité
                </Button>
                <Button 
                    variant="outline"
                    className="w-full gap-2 h-11 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
                    onClick={() => {
                        if (selectedDay) {
                            setCurrentDate(selectedDay);
                            setViewMode('day');
                        }
                        setIsDayDetailModalOpen(false);
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
              Voulez-vous vraiment supprimer cette activité ?<br/>Cette action est irréversible.
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
