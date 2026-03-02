/**
 * Core module barrel export.
 * Point d'entrée pour toute l'infrastructure partagée.
 */

export { prisma } from "@/lib/prisma"
export { getAuthUser } from "@/lib/auth"
export type { AuthUser } from "@/lib/auth"
export {
  MODULE_REGISTRY,
  getModuleDefinition,
  getAllModuleDefinitions,
  getModuleForApiPath,
} from "./config/module-registry"
export type { ModuleDefinition, ModuleRoute } from "./config/module-registry"
