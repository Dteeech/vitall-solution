/**
 * Données mock pour la page Caserne.
 * À remplacer par un vrai fetch Prisma quand le modèle existera.
 */

import type { Recruiter, CaserneDetails } from "@/types/candidature"

export const CASERNE_RECRUITER_INFO: Pick<
  Recruiter,
  "firstName" | "lastName" | "email" | "caserne" | "avatarSrc" | "initials"
> = {
  firstName: "Martin",
  lastName: "Delcourt",
  email: "martin.delcourt@gmail.com",
  caserne: "Caserne de saint-herblain",
  avatarSrc: "/assets/images/firefighter-avatar.png",
  initials: "DM",
}

export const CASERNE_DETAILS: CaserneDetails = {
  name: "Caserne de saint-herblain",
  label: "entrée caserne",
  city: "Saint-herblain - Nantes",
  distanceKm: 3.5,
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2709.766185694563!2d-1.5451864!3d47.2211571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4805ef99288bf609%3A0x437d3a67c7ba5fbb!2sCentre%20d&#39;Incendie%20et%20de%20Secours%20Nantes%20Gouzé!5e0!3m2!1sfr!2sfr!4v1772657067396!5m2!1sfr!2sfr",
  mapLabels: {
    top: ["Sautron", "La Chapelle-sur-Erdre"],
    watermark: "Nantes",
  },
}
