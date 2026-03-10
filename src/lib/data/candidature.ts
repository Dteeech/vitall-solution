/**
 * Données mock pour le dashboard candidat.
 * À remplacer par un vrai fetch Prisma quand le modèle existera.
 */

import type { ApplicationStep, RecentDocument, Recruiter } from "@/types/candidature"

export const APPLICATION_STEPS: ApplicationStep[] = [
  { title: "Dossier d'inscription", date: "Complet", status: "completed" },
  { title: "Test sportif", date: "12 Octobre 2024", status: "completed" },
  { title: "Visite médicale", date: "En cours", status: "current" },
  { title: "Test théorique", date: "À venir", status: "upcoming" },
  { title: "Entretien de recrutement", date: "À venir", status: "upcoming" },
  { title: "Formation initiale", date: "À venir", status: "upcoming" },
]

export const RECENT_DOCUMENTS: RecentDocument[] = [
  { name: "Carte d'identité.pdf", size: "2.4 Mo", date: "12/09/2024" },
  { name: "Permis de conduire.pdf", size: "1.8 Mo", date: "12/09/2024" },
  { name: "Diplôme_Bac.pdf", size: "3.1 Mo", date: "10/09/2024" },
]

export const RECRUITER: Recruiter = {
  firstName: "Martin",
  lastName: "Delcourt",
  email: "m.delcourt@sdis75.fr",
  caserne: "Caserne de Chaligny",
  avatarSrc: "/assets/images/recruiter.png",
  initials: "DM",
  grade: "Adjudant-chef",
}
