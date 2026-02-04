"use client"

import * as React from "react"
import { LayoutDashboard, Users, Bell, Settings, LogOut, ChevronDown, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import logoBlanc from "../../public/assets/images/Logo-Blanc-avec-texte.png"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "../components/ui/Sidebar"

type SubMenuItem = {
  title: string
  href: string
}

type MenuItem = {
  title: string
  href?: string
  icon: React.ElementType
  subItems?: SubMenuItem[]
}

const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Ma candidature",
    icon: Users,
    subItems: [
      { title: "Dossier", href: "/dashboard/candidature/dossier" },
      { title: "Caserne", href: "/dashboard/candidature/caserne" },
    ],
  },
]

const FOOTER_MENU_ITEMS: MenuItem[] = [
  {
    title: "Notification",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Paramètres",
    href: "/dashboard/parametres",
    icon: Settings,
  },
]

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    MAIN_MENU_ITEMS.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        const hasActive = item.subItems.some(
          (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`)
        )
        initial[item.title] = hasActive
      }
    })
    return initial
  })

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      className="bg-secondary-900 text-white border-r-0"
      {...props}
    >
      <SidebarHeader className="px-4 py-6 group-data-[state=collapsed]:px-2">
        <div className="flex items-center justify-center group-data-[state=collapsed]:justify-center">
          <Image
            src={logoBlanc}
            alt="Vitall"
            width={120}
            height={40}
            className="group-data-[state=collapsed]:hidden"
          />
          <div className="hidden group-data-[state=collapsed]:block">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-secondary-900 font-bold text-sm">V</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarMenu>
          {MAIN_MENU_ITEMS.map((item) => {
            // Vérifier si l'item a des sous-menus
            if (item.subItems && item.subItems.length > 0) {
              const isOpen = openMenus[item.title] || false
              const hasActiveSubItem = item.subItems.some(
                (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`)
              )

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => toggleMenu(item.title)}
                    className="text-white hover:bg-secondary-700 font-semibold group-data-[state=collapsed]:justify-center"
                  >
                    <item.icon className="size-5" />
                    <span className="group-data-[state=collapsed]:hidden">
                      {item.title}
                    </span>
                    <div className="ml-auto group-data-[state=collapsed]:hidden">
                      {isOpen ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </div>
                  </SidebarMenuButton>

                  {isOpen && (
                    <SidebarMenuSub className="group-data-[state=collapsed]:hidden">
                      {item.subItems.map((subItem) => {
                        const subActive =
                          pathname === subItem.href ||
                          pathname.startsWith(`${subItem.href}/`)

                        return (
                          <SidebarMenuSubItem key={subItem.href}>
                            <SidebarMenuSubButton
                              asChild
                              className={`text-white hover:bg-secondary-700 ${
                                subActive ? "bg-secondary-700" : ""
                              }`}
                            >
                              <Link href={subItem.href}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )
            }

            // Item simple sans sous-menu
            const active = pathname === item.href
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`text-white hover:bg-secondary-700 font-semibold group-data-[state=collapsed]:justify-center ${
                    active ? "bg-secondary-700" : ""
                  }`}
                >
                  <Link href={item.href!}>
                    <item.icon className="size-5" />
                    <span className="group-data-[state=collapsed]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4 group-data-[state=collapsed]:px-2">
        <SidebarMenu className="group-data-[state=collapsed]:items-center">
          {FOOTER_MENU_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <SidebarMenuItem
                key={item.title}
                className="group-data-[state=collapsed]:flex group-data-[state=collapsed]:justify-center"
              >
                <SidebarMenuButton
                  asChild
                  className={`text-white hover:bg-secondary-700 font-semibold group-data-[state=collapsed]:justify-center ${
                    active ? "bg-secondary-700" : ""
                  }`}
                >
                  <Link href={item.href!}>
                    <item.icon className="size-5" />
                    <span className="group-data-[state=collapsed]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
          
          {/* Bouton de déconnexion */}
          <SidebarMenuItem className="group-data-[state=collapsed]:flex group-data-[state=collapsed]:justify-center">
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-white hover:bg-error/20 hover:text-error font-semibold group-data-[state=collapsed]:justify-center cursor-pointer"
            >
              <LogOut className="size-5" />
              <span className="group-data-[state=collapsed]:hidden">
                Déconnexion
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
