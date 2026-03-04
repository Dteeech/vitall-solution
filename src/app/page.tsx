import { Metadata } from 'next'
import LandingPageClient from '@/components/landing/LandingPageClient'

export const metadata: Metadata = {
  title: 'Logiciel de gestion sur mesure : simplifier l’organisation des services d’intervention',
  description: 'Vitall est un logiciel de gestion sur mesure conçu pour les services d’intervention. Centralisez la gestion des équipes, du planning et des équipements. Parlons de vos besoins.',
}

export default function ReplicatedLandingPage() {
  return <LandingPageClient />
}
