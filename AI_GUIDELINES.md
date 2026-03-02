# AI / Developer Guidelines for ViteAll Project

This document serves as a cheat-sheet for the project structure, design system, and development guidelines. It is intended to help AI assistants and developers maintain consistency.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix Primitives) + Lucide Icons
- **Database**: PostgreSQL (via Docker) + Prisma ORM
- **State Management**: React Context + Hooks
- **Icons**: Lucide React

## Design System & Colors
Based on the provided screenshots and codebase analysis:
- **Primary Brand Color**: Orange (`#ea8b49`) used for primary buttons, active states, and highlights.
- **Secondary/Accents**: Blue (`#1565c0` / `#e3f2fd`), Purple (`#7b1fa2` / `#f3e5f5`), Green (`#2e7d32` / `#e8f5e9`).
- **Backgrounds**: White (`#ffffff`), Gray-50 (`#f9fafb`) for main dashboard areas.
- **Typography**: Sans-serif, clean, modern (Inter or system font).

### Activity Colors Mapping
| Type | Tailwind Classes | Hex (Approx) |
| :--- | :--- | :--- |
| **Garde / Interventions** | `bg-[#e3f2fd] border-[#1565c0]` | Blue |
| **Formation** | `bg-[#f3e5f5] border-[#7b1fa2]` | Violet |
| **Entretien** | `bg-[#fff3e0] border-[#ef6c00]` | Orange |
| **Astreinte** | `bg-[#e8f5e9] border-[#2e7d32]` | Green |
| **Réunion** | `bg-[#f5f5f5] border-[#616161]` | Gray |

## Project Structure
- `src/app`: App Router pages.
  - `admin/`: Admin dashboard routes.
  - `api/`: Backend API routes.
- `src/components`:
  - `ui/`: Reusable primitives (buttons, inputs, etc. - often Shadcn).
  - `admin/`: Admin-specific components.
- `prisma/`: Database schema and seeds.

## Common Issues & Fixes
- **Docker**: DB runs in Docker. If connection fails (`ECONNREFUSED`), verify Docker Desktop is running.
- **Git/Merge**: Conflicts often occur in `planning` pages. Always check for preserved logic vs incoming changes.
- **Select Component**: Imported from `@/components/ui/select`. Ensure `@radix-ui/react-select` is installed.

## Workflow
1. **Planning**: Check `src/app/admin/planning`.
2. **Astreintes**: Logic in `src/app/admin/planning/astreintes`.
3. **Seed Data**: `prisma/seed.ts` contains test users (Admin, Manager, User).

---
*Created automatically to assist development context.*
