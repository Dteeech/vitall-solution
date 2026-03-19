"use client"

import { Filter, LayoutGrid, List, FileText, MessageSquare, MoreVertical, UserPlus } from "lucide-react"
import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core"
import type { Candidate } from "@/modules/recrutement/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const initialCandidates: Candidate[] = [
  { id: 1, name: "Martin Léo", status: "Nouvelle", date: "05/12/2025", location: "Saint-Herblain", documents: 12, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
  { id: 2, name: "Dubois Thomas", status: "Nouvelle", date: "09/12/2025", location: "Orvault", documents: 10, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
  { id: 3, name: "Bernard Camille", status: "Nouvelle", date: "23/12/2025", location: "Rezé", documents: 12, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
  { id: 4, name: "Lefèvre Julien", status: "Test sportif", date: "03/10/2025", location: "Carquefou", documents: 12, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
  { id: 5, name: "Moreau Chloé", status: "Test sportif", date: "30/09/2025", location: "Saint-Herblain", documents: 12, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
  { id: 6, name: "Petit Lucas", status: "Test sportif", date: "24/10/2025", location: "Saint-Herblain", documents: 11, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
  { id: 7, name: "Robert Emma", status: "Test sportif", date: "02/11/2025", location: "Orvault", documents: 9, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
  { id: 8, name: "Richard Nathan", status: "Visite médicale", date: "11/10/2025", location: "Savenay", documents: 12, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
  { id: 9, name: "Laurent Sarah", status: "Visite médicale", date: "09/11/2025", location: "Orvault", documents: 12, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
  { id: 10, name: "Simon Hugo", status: "Visite médicale", date: "28/06/2025", location: "Rezé", documents: 11, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
  { id: 11, name: "Abeille Maya", status: "Test sportif", date: "02/11/2025", location: "Savenay", documents: 9, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
  { id: 12, name: "Nage Arthur", status: "Test sportif", date: "02/11/2025", location: "Carquefou", documents: 12, comments: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
]

const STATUSES: Candidate["status"][] = ["Nouvelle", "Test sportif", "Visite médicale"]

const getStatusColor = (status: Candidate["status"]) => {
  switch (status) {
    case "Nouvelle":
      return "#EA8B49"
    case "Test sportif":
      return "#7195AA"
    case "Visite médicale":
      return "#C86B2F"
  }
}

const getStatusBadgeColor = (status: Candidate["status"]) => {
  switch (status) {
    case "Nouvelle":
      return "bg-[#EA8B49] text-white"
    case "Test sportif":
      return "bg-[#7195AA] text-white"
    case "Visite médicale":
      return "bg-[#C86B2F] text-white"
  }
}

type AddUserForm = {
  firstName: string
  lastName: string
  email: string
  role: "USER" | "ADMIN"
  password: string
}

export default function CandidatesList() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [activeId, setActiveId] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const [form, setForm] = useState<AddUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    role: "USER",
    password: "",
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError(null)
    try {
      const res = await fetch("/api/organization/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setFormSuccess(true)
        setTimeout(() => {
          setDialogOpen(false)
          setFormSuccess(false)
          setForm({ firstName: "", lastName: "", email: "", role: "USER", password: "" })
        }, 1500)
      } else {
        const data = await res.json()
        setFormError(data.error || "Une erreur est survenue")
      }
    } catch {
      setFormError("Une erreur est survenue")
    } finally {
      setFormLoading(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const toggleCandidate = (id: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([])
    } else {
      setSelectedCandidates(candidates.map((c: Candidate) => c.id))
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const candidateId = active.id as number
    const newStatus = over.id as Candidate["status"]

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate
      )
    )
  }

  const getCandidatesByStatus = (status: Candidate["status"]) => {
    return candidates.filter((c) => c.status === status)
  }

  const activeCandidate = activeId ? candidates.find((c) => c.id === activeId) : null

  return (
    <main className="flex-1 p-8 bg-neutral-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 mb-1">Candidatures</h1>
        <p className="text-neutral-600 text-sm mb-4">{candidates.length} candidatures</p>

        <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-900 text-white rounded-md hover:bg-secondary-800 transition-colors">
              <Filter className="size-4" />
              Filtrer
            </button>
            <button
              onClick={() => { setDialogOpen(true); setFormError(null); setFormSuccess(false) }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-800 rounded-md hover:bg-neutral-50 transition-colors"
            >
              <UserPlus className="size-4" />
              Ajouter un utilisateur
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${viewMode === "list"
                ? "bg-secondary-900 text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-100"
                }`}
            >
              <List className="size-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${viewMode === "grid"
                ? "bg-secondary-900 text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-100"
                }`}
            >
              <LayoutGrid className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dialog ajout utilisateur */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
          </DialogHeader>
          {formSuccess ? (
            <div className="py-6 text-center text-green-600 font-medium">Utilisateur créé avec succès !</div>
          ) : (
            <form onSubmit={handleAddUser} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" name="firstName" value={form.firstName} onChange={handleFormChange} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" name="lastName" value={form.lastName} onChange={handleFormChange} required />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleFormChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" name="password" type="password" value={form.password} onChange={handleFormChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="role">Rôle</Label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                  className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary-900"
                >
                  <option value="USER">Utilisateur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Création..." : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {viewMode === "list" ? (
        /* Table View */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-neutral-50 border-b">
                <tr>
                  <th className="w-12 p-4">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.length === candidates.length}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-neutral-300"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-700">Candidat</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-700">Statut</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-700">Date de candidature</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-700">Localisation</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-700">Documents</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate: Candidate) => (
                  <tr key={candidate.id} className="border-b hover:bg-neutral-50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => toggleCandidate(candidate.id)}
                        className="w-4 h-4 rounded border-neutral-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-secondary-900 flex items-center justify-center text-white text-sm font-medium">
                          {candidate.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium text-neutral-900">{candidate.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-md text-xs font-medium ${getStatusBadgeColor(
                          candidate.status
                        )}`}
                      >
                        {candidate.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-neutral-700">{candidate.date}</td>
                    <td className="p-4 text-sm text-neutral-700">{candidate.location}</td>
                    <td className="p-4 text-sm text-neutral-700">{candidate.documents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban View */
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                candidates={getCandidatesByStatus(status)}
              />
            ))}
          </div>
          <DragOverlay>
            {activeCandidate ? <CandidateCard candidate={activeCandidate} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </main>
  )
}

// Kanban Column Component
function KanbanColumn({
  status,
  candidates,
}: {
  status: Candidate["status"]
  candidates: Candidate[]
}) {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className="bg-white rounded-lg p-4 min-h-[600px]"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: getStatusColor(status) }}
          />
          <h3 className="font-semibold text-neutral-900">{status}</h3>
          <span className="text-sm text-neutral-500">{candidates.length}</span>
        </div>
        <button className="text-neutral-400 hover:text-neutral-600">
          <MoreVertical className="size-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  )
}

// Candidate Card Component
function CandidateCard({
  candidate,
  isDragging = false,
}: {
  candidate: Candidate
  isDragging?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: candidate.id,
  })

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white border border-neutral-200 rounded-lg p-4 cursor-grab active:cursor-grabbing transition-shadow ${isDragging ? "shadow-xl opacity-50" : "hover:shadow-md"
        }`}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-2">
        <div className="size-10 rounded-full bg-secondary-900 flex items-center justify-center text-white text-sm font-medium">
          {candidate.name.split(" ").map((n: string) => n[0]).join("")}
        </div>
        <div>
          <p className="font-semibold text-neutral-900">{candidate.name}</p>
          <p className="text-xs text-neutral-500">{candidate.date}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
        {candidate.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-neutral-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FileText className="size-4" />
            <span className="text-xs">{candidate.documents}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="size-4" />
            <span className="text-xs">{candidate.comments}</span>
          </div>
        </div>
        <button className="text-neutral-400 hover:text-neutral-600">
          <MoreVertical className="size-4" />
        </button>
      </div>
    </div>
  )
}
