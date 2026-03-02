/**
 * Types spécifiques au module Recrutement.
 */

export type CandidateStatus = "Nouvelle" | "Test sportif" | "Visite médicale"

export type Candidate = {
  id: number
  name: string
  status: CandidateStatus
  date: string
  location: string
  documents: number
  comments?: number
  description?: string
}

export type KanbanColumn = {
  id: CandidateStatus
  title: string
  color: string
}
