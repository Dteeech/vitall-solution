<!-- Instructions concises pour agents IA — projet vitall-solution -->

# 🧠 Objectif

- Rendre un agent IA immédiatement opérationnel sur le projet Vitall (Next.js + Tailwind + shadcn/ui).
- Implémenter les designs Figma composant par composant, fournis par l'utilisateur.

---

## 🧩 Contexte technique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript + React 19
- **Style** : TailwindCSS
- **UI Library** : shadcn/ui (exclusivement) mappée aux tokens Tailwind
- **Design system** : issu de Figma (implémentation composant par composant)
- **Structure principale** :

```
src/
├── app/          # Routes & layouts
├── components/   # UI (design system)
├── modules/      # Logique métier (recruitment, etc.)
├── lib/          # Clients externes (API, Supabase, etc.)
└── types/        # Types partagés
```

```bash
npm install             # Installer les dépendances
npm run dev             # Lancer le serveur de dev
npm run build           # Compiler pour la production
npm run start           # Lancer le build compilé
npm run lint            # Vérifier la qualité du code
```

## 🔐 Variables d'environnement

Déclarées dans `.env` ou `.env.local`.

Avant toute exécution :

```bash
cp .env.example .env
```

## 🧱 Conventions de structure

| Domaine             | Détails                                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **UI Components** | Utiliser exclusivement shadcn/ui. Composants dans `src/components/ui/` (générés par shadcn) et exportés via `index.ts`. |
| **Routing**         | Pages et API via App Router : `page.tsx`, `layout.tsx`, `route.ts`.                                                   |
| **Modules métiers** | Isolés dans `src/modules/<nom>`. Ne pas mélanger avec l'UI.                                                           |
| **Librairies**      | Clients externes dans `src/lib/` (Supabase, Figma SDK, etc.).                                                         |
| **Types globaux**   | Dans `src/types/`.                                                                                                    |
| **CSS global**      | Défini dans `src/app/globals.css`.                                                                                    |

---

## 🎨 Intégration Figma

Le processus d'intégration Figma se fera composant par composant. L'utilisateur fournira une instruction et le lien Figma spécifique pour chaque élément à implémenter.

**Exemple de demande :**
figma mcp Implement this design from Figma.
@https://www.figma.com/design/2IATBRhB5vCiuCt7e6vU8k/LEAN-START-UP---KIT-UI?node-id=1503-572&m=dev

---

### 🧩 Règles d'interprétation pour l'agent

1. **Composants identifiés via Figma (lien fourni)**
   - Extraire la structure (frames, calques, autolayouts, contraintes).
   - Mapper exclusivement vers un composant shadcn/ui existant (Button, Input, Card, Badge, Tabs, Dialog, DropdownMenu, Checkbox, Radio, Switch, Avatar, Progress, Separator, Tooltip, Table, Pagination, Sheet).
   - Si aucun équivalent direct n'existe, générer un wrapper Tailwind minimal dans `src/components/ui/<NomDuComposant>.tsx` et l'exporter.
2. **Design tokens**
   - Utiliser les tokens Tailwind ou variables CSS : `bg-primary`, `bg-primary-dark`, `bg-primary-light`, `text-neutral-900`, `bg-neutral-100`, `text-error`, `bg-success`.
   - Pour le secondaire (bleu) : préférer `text-secondary-900`, `bg-secondary-900`, `border-secondary-900`; fallback possible via classes arbitraires avec `var(--color-secondary-900)`.
   - ❌ Pas d'hex inline. Relier les variantes shadcn/ui aux tokens via `className`.
3. **Typographie et couleurs**
   - Polices : texte Inter/system-ui ; titres Abadi MT Pro (depuis `public/fonts`).
   - Couleurs synchronisées avec `tailwind.config.ts` et `globals.css`.
   - Éviter les styles inline ; utiliser Tailwind.
4. **Composants Figma détectés**
   - `Button`, `Input`, `Card`, `Sidebar`, `Header`, `LoginForm`, `Badge`, `Tabs`, `Dialog`, `Dropdown`, `Avatar`, `Checkbox`, `Progress`.
   - Utiliser exclusivement shadcn/ui ; créer un wrapper seulement si manquant (ex: Stepper spécifique).

---

## 📦 Installation shadcn/ui
```bash
npx shadcn@latest init

# Boutons, formulaires et layout de base
npx shadcn@latest add button input label textarea select checkbox radio switch

# Composants d'affichage
npx shadcn@latest add card badge avatar progress separator tooltip table pagination tabs

# Overlays et menus
npx shadcn@latest add dialog alert-dialog dropdown-menu sheet popover toaster
```

Conventions : importer depuis `@/components/ui/<component>` ; ne pas modifier le code généré, sauf pour mapper nos classes Tailwind ; si un composant manque, créer `src/components/ui/<Nom>.tsx` et l'exporter via `index.ts`.

---

## 🧠 Logique d'analyse et de génération
1. Analyser la structure Figma (frames, groupes, autolayouts, contraintes) via le lien fourni.
2. Vérifier l'existence locale des composants (`src/components/ui/`) ; créer uniquement les manquants et les exporter.
3. Assembler la page ou le composant dans le répertoire approprié (`src/app/` ou `src/components/ui/`) : importer seulement les composants nécessaires, respecter la hiérarchie Figma, appliquer les classes Tailwind/tokens, gérer le responsive selon la maquette.
4. Ne jamais créer de composant fourre-tout ; séparer les sous-parties dans `/ui`.

---

## 🧠 Exemples d'usage
### Bouton shadcn/ui avec tokens
```tsx
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function ButtonPrimary({ label }: { label: string }) {
  return (
    <Button className="bg-primary hover:bg-primary-dark text-white font-semibold text-lg rounded-full px-6 py-2 gap-2">
      <Plus size={18} strokeWidth={3} />
      {label}
    </Button>
  )
}
```

### Ajout d'une route API
```
src/app/api/<endpoint>/route.ts
```
```tsx
export async function GET() {
  return Response.json({ status: "ok" })
}
```

### Exemple d'input wrapper
```tsx
export default function InputField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="flex flex-col gap-1 text-neutral-900">
      {label}
      <input
        placeholder={placeholder}
        className="border border-neutral-400 rounded-md px-3 py-2 focus:outline-none focus:focus:ring-2 focus:ring-primary"
      />
    </label>
  )
}
```

---

## 🏷️ Conventions de nommage
| Type                  | Exemple                                                                              | Règle                                                        |
| --------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| **Atomique**          | `ButtonPrimary`, `InputField`, `Checkbox` (shadcn/ui: `button`, `input`, `checkbox`) | PascalCase pour nos wrappers; import shadcn en PascalCase    |
| **Composé**           | `LoginForm`, `SidebarMenu`, `RecruitmentCard`                                        | Nom + rôle                                                   |
| **Spécifique métier** | `CandidateTable`, `RecruitmentStatsCard`                                             | Domaine + type                                               |
| **Hook React**        | `useRecruitmentData`, `useAuthSession`                                               | camelCase, commence par `use`                                |
| **Exports**           | via `src/components/ui/index.ts`                                                     | `export { default as ButtonPrimary } from "./ButtonPrimary"` |

---

## 🎨 Design Tokens
- Utiliser uniquement : `bg-primary`, `bg-primary-dark`, `bg-primary-light`, `text-neutral-900`, `bg-neutral-100`, `text-error`, `bg-success`.
- Palette secondaire (bleu) : `text-secondary-900`, `bg-secondary-900`, `border-secondary-900`; fallback possible via classes arbitraires avec `var(--color-secondary-900)`.
- ❌ Jamais de code couleur hex inline.

### Palette (globals.css)
- Primaire (orange) : `--color-primary-25` → `--color-primary-900`
- Secondaire (bleu) : `--color-secondary-25` → `--color-secondary-900`
- Polices : `--font-sans` (Inter), `--font-heading` (Abadi MT Pro)

---

## 🔗 shadcn (registry)
- Ajouter un composant manquant : `npx shadcn@latest add <component>`.
- Adapter via `className` pour mapper les tokens ; éviter les styles inline.

---

## 🧩 Workflow recommandé (exemple login)
1. Identifier dans Figma (via lien fourni) : `Logo`, `InputField`, `ButtonPrimary`, `LoginForm`.
2. Utiliser shadcn/ui (`Input`, `Button`).
3. Exporter tout nouveau wrapper via `src/components/ui/index.ts`.
4. Construire la page `src/app/login/page.tsx` en assemblant uniquement des composants importés, sans UI inline.

---

## 📋 Checklist avant PR
1. Chaque composant est indépendant.
2. Tous les composants sont exportés via `src/components/ui/index.ts`.
3. Aucun code UI inline dans les pages.
4. Lint et build passent : `npm run lint && npm run build`.
5. PR claire : titre ex. `feat(login): creation page + shadcn/ui inputs & buttons`.

## ✅ Résumé final
L'agent IA doit pouvoir :
- Interpréter la maquette Figma via un lien fourni par l'utilisateur.
- Identifier et nommer les composants.
- Vérifier leur existence locale et créer uniquement les manquants.
- Assembler les pages ou composants avec les éléments existants.
- Éviter tout composant monolithique.

<!-- Fin du fichier d'instructions -->
