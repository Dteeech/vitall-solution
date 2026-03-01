/**
 * Module Registry — Point central de configuration des modules activables.
 *
 * Chaque module métier (Planning, Recrutement, etc.) est déclaré ici avec :
 *  - ses métadonnées UI (icône, couleur, description)
 *  - ses routes associées (pages + API)
 *  - ses dépendances éventuelles
 *
 * Ce registre est consommé par :
 *  - La sidebar (filtrage dynamique des menus)
 *  - Le guard API (vérification module actif avant exécution)
 *  - La page admin/modules (affichage des modules disponibles)
 */

export interface ModuleRoute {
  title: string
  href: string
}

export interface ModuleDefinition {
  /** Nom technique — doit correspondre au `Module.name` en base */
  name: string
  /** Nom affiché dans l'UI */
  displayName: string
  /** Catégorie métier */
  category: "RH" | "Communication" | "Gestion"
  /** Icône (chemin vers l'asset SVG) */
  icon: string
  /** Description courte */
  description: string
  /** Routes frontend exposées dans la sidebar admin */
  adminRoutes: ModuleRoute[]
  /** Routes frontend exposées dans la sidebar utilisateur */
  userRoutes: ModuleRoute[]
  /** Chemins d'API protégés par ce module (préfixes) */
  apiPrefixes: string[]
  /** Modules dont celui-ci dépend */
  dependencies: string[]
  /** Version sémantique */
  version: string
}

/**
 * Registre statique de tous les modules connus du système.
 * L'activation se fait en base (table SubscriptionModule).
 */
export const MODULE_REGISTRY: Record<string, ModuleDefinition> = {
  Planning: {
    name: "Planning",
    displayName: "Planning",
    category: "RH",
    icon: "/assets/icons/Planning.svg",
    description:
      "Gérez les plannings de vos équipes, suivez les astreintes et analysez les données de performance opérationnelle en temps réel.",
    adminRoutes: [
      { title: "Planning", href: "/admin/planning" },
      { title: "Astreintes", href: "/admin/planning/astreintes" },
      { title: "Données analytiques", href: "/admin/planning/donnees-analytiques" },
    ],
    userRoutes: [],
    apiPrefixes: ["/api/planning"],
    dependencies: [],
    version: "1.0.0",
  },

  Recrutement: {
    name: "Recrutement",
    displayName: "Recrutement",
    category: "RH",
    icon: "/assets/icons/recrutement.svg",
    description:
      "Optimisez vos processus de recrutement, du sourcing à l'onboarding, avec une interface intuitive et collaborative.",
    adminRoutes: [
      { title: "Candidatures", href: "/admin/modules/recruit-firefighter/candidates" },
      { title: "Casernes", href: "/admin/casernes" },
      { title: "Transfert", href: "/admin/transfert" },
      { title: "Ma caserne", href: "/admin/ma-caserne" },
      { title: "Données analytiques", href: "/admin/analytics" },
    ],
    userRoutes: [
      { title: "Dossier", href: "/dashboard/candidature/dossier" },
      { title: "Caserne", href: "/dashboard/candidature/caserne" },
    ],
    apiPrefixes: ["/api/recrutement"],
    dependencies: [],
    version: "1.0.0",
  },

  Congés: {
    name: "Congés",
    displayName: "Congés",
    category: "RH",
    icon: "/assets/icons/recrutement.svg",
    description: "Gérez les demandes de congés de vos équipes avec un calendrier partagé et un workflow de validation.",
    adminRoutes: [
      { title: "Demandes", href: "/admin/modules/conges/demandes" },
      { title: "Calendrier", href: "/admin/modules/conges/calendrier" },
    ],
    userRoutes: [],
    apiPrefixes: ["/api/conges"],
    dependencies: [],
    version: "1.0.0",
  },

  Formation: {
    name: "Formation",
    displayName: "Formation",
    category: "RH",
    icon: "/assets/icons/iconFormation.svg",
    description: "Gérez le catalogue de formations, suivez les sessions et les montées en compétences de vos collaborateurs.",
    adminRoutes: [
      { title: "Catalogue", href: "/admin/modules/formation/catalogue" },
      { title: "Mes sessions", href: "/admin/modules/formation/sessions" },
    ],
    userRoutes: [],
    apiPrefixes: ["/api/formation"],
    dependencies: [],
    version: "1.0.0",
  },

  Paie: {
    name: "Paie",
    displayName: "Paie",
    category: "RH",
    icon: "/assets/icons/Planning.svg",
    description: "Automatisez la génération et la distribution de vos fiches de paie. Conforme aux dernières normes en vigueur.",
    adminRoutes: [],
    userRoutes: [],
    apiPrefixes: ["/api/paie"],
    dependencies: [],
    version: "1.0.0",
  },

  Flottes: {
    name: "Flottes",
    displayName: "Flottes",
    category: "Gestion",
    icon: "/assets/icons/iconFlotte.svg",
    description: "Gérez l'ensemble de votre parc automobile en quelques clics. Suivez les entretiens, les consommations et les attributions.",
    adminRoutes: [],
    userRoutes: [],
    apiPrefixes: ["/api/flottes"],
    dependencies: [],
    version: "1.0.0",
  },

  "Chat interne": {
    name: "Chat interne",
    displayName: "Chat interne",
    category: "Communication",
    icon: "/assets/icons/iconChat.svg",
    description: "Facilitez la communication entre vos collaborateurs avec notre outil de messagerie instantanée sécurisé.",
    adminRoutes: [],
    userRoutes: [],
    apiPrefixes: ["/api/chat"],
    dependencies: [],
    version: "1.0.0",
  },

  Compta: {
    name: "Compta",
    displayName: "Compta",
    category: "Gestion",
    icon: "/assets/icons/iconGestionBulletinPaye.svg",
    description: "Module de comptabilité pour gérer vos factures et dépenses.",
    adminRoutes: [
      { title: "Factures", href: "/admin/modules/compta/factures" },
      { title: "Trésorerie", href: "/admin/modules/compta/tresorerie" },
    ],
    userRoutes: [],
    apiPrefixes: ["/api/compta"],
    dependencies: [],
    version: "1.0.0",
  },

  Matériel: {
    name: "Matériel",
    displayName: "Matériel",
    category: "Gestion",
    icon: "/assets/icons/Planning.svg",
    description: "Gérez l'inventaire et le suivi de votre matériel.",
    adminRoutes: [
      { title: "Inventaire", href: "/admin/modules/materiel/inventaire" },
    ],
    userRoutes: [],
    apiPrefixes: ["/api/materiel"],
    dependencies: [],
    version: "1.0.0",
  },
}

/** Récupère la définition d'un module par son nom */
export function getModuleDefinition(name: string): ModuleDefinition | undefined {
  return MODULE_REGISTRY[name]
}

/** Liste tous les modules enregistrés */
export function getAllModuleDefinitions(): ModuleDefinition[] {
  return Object.values(MODULE_REGISTRY)
}

/** Vérifie si un chemin d'API est couvert par un module donné */
export function getModuleForApiPath(pathname: string): ModuleDefinition | undefined {
  return Object.values(MODULE_REGISTRY).find((mod) =>
    mod.apiPrefixes.some((prefix) => pathname.startsWith(prefix))
  )
}
