"use client"

import { Filter, LayoutGrid, List } from "lucide-react"
import { useState } from "react"

type Candidate = {
  id: number
  name: string
  status: "Nouvelle" | "Test sportif" | "Visite médicale"
  date: string
  location: string
  documents: number
}

const candidates: Candidate[] = [
  { id: 1, name: "Martin Léo", status: "Nouvelle", date: "05/12/2025", location: "Saint-Herblain", documents: 12 },
  { id: 2, name: "Dubois Thomas", status: "Nouvelle", date: "09/12/2025", location: "Orvault", documents: 10 },
  { id: 3, name: "Bernard Camille", status: "Nouvelle", date: "23/12/2025", location: "Rezé", documents: 12 },
  { id: 4, name: "Lefèvre Julien", status: "Test sportif", date: "03/10/2025", location: "Carquefou", documents: 12 },
  { id: 5, name: "Moreau Chloé", status: "Test sportif", date: "30/09/2025", location: "Saint-Herblain", documents: 12 },
  { id: 6, name: "Petit Lucas", status: "Test sportif", date: "24/10/2025", location: "Saint-Herblain", documents: 11 },
  { id: 7, name: "Robert Emma", status: "Test sportif", date: "02/11/2025", location: "Orvault", documents: 9 },
  { id: 8, name: "Richard Nathan", status: "Visite médicale", date: "11/10/2025", location: "Savenay", documents: 12 },
  { id: 9, name: "Laurent Sarah", status: "Visite médicale", date: "09/11/2025", location: "Orvault", documents: 12 },
  { id: 10, name: "Simon Hugo", status: "Visite médicale", date: "28/06/2025", location: "Rezé", documents: 11 },
  { id: 11, name: "Abeille Maya", status: "Test sportif", date: "02/11/2025", location: "Savenay", documents: 9 },
  { id: 12, name: "Nage Arthur", status: "Test sportif", date: "02/11/2025", location: "Carquefou", documents: 12 },
]

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

export default function CandidatesList() {
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const toggleCandidate = (id: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([])
    } else {
      setSelectedCandidates(candidates.map((c) => c.id))
    }
  }

  return (
    <main className="flex-1 p-8 bg-neutral-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 mb-1">Candidatures</h1>
        <p className="text-neutral-600 text-sm mb-4">{candidates.length} candidatures</p>
        
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-900 text-white rounded-md hover:bg-secondary-800 transition-colors">
            <Filter className="size-4" />
            Filtrer
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-secondary-900 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <List className="size-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-secondary-900 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <LayoutGrid className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
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
            {candidates.map((candidate) => (
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
                      {candidate.name.split(" ").map((n) => n[0]).join("")}
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
    </main>
  )
}
