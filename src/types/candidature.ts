/**
 * Types partagés pour le domaine Candidature (espace utilisateur).
 */

export type StepStatus = "completed" | "current" | "upcoming"

export type ApplicationStep = {
  title: string
  date: string
  status: StepStatus
}

export type RecentDocument = {
  name: string
  size: string
  date: string
}

export type Recruiter = {
  firstName: string
  lastName: string
  email: string
  caserne: string
  /** Chemin vers l'image avatar (relatif à /public) */
  avatarSrc?: string
  /** Initiales affichées en fallback */
  initials: string
  /** Titre/grade du recruteur */
  grade?: string
}

export type CaserneDetails = {
  name: string
  /** Label court affiché sous le nom (ex: "entrée caserne") */
  label: string
  city: string
  /** Distance calculée par rapport au candidat */
  distanceKm: number
  /** URL Google Maps embed */
  mapEmbedUrl: string
  /** Overlays de noms de quartiers pour la carte */
  mapLabels?: { top?: string[]; watermark?: string }
}
