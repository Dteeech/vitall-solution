/**
 * Types spécifiques au module Planning.
 * Isolés ici pour respecter l'encapsulation modulaire.
 */

export type ActivityType = "interventions" | "formation" | "entretien" | "astreinte"

export type Activity = {
  id: string
  type: ActivityType
  label: string
  collaborator?: string
  time?: string
}

export type CalendarDay = {
  date: number
  isCurrentMonth: boolean
  activities: Activity[]
}

export type AstreinteAssignment = {
  id: string
  name: string
  initials: string
  colorClass: string
}

export type AstreinteCalendarDay = {
  date: number
  isCurrentMonth: boolean
  assignment?: AstreinteAssignment
}

export type KPICardData = {
  title: string
  value: string
  change: string
  changeType: "up" | "down" | "neutral"
}

export type ActivityData = {
  name: string
  value: number
  color: string
}

export type CollaboratorHours = {
  name: string
  hours: number
}
