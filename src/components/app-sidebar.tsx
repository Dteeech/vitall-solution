"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  ChevronDown,
  ChevronRight,
  Bell,
  User,
  Settings,
  LucideIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
} from "./ui/Sidebar"

type SubMenuItem = {
  title: string
  href: string
  isActive?: boolean
}

type MenuItem = {
  title: string
  href?: string
  icon?: LucideIcon
  iconSrc?: string
  subItems?: SubMenuItem[]
  badge?: boolean
}

const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    title: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Recrutement",
    iconSrc: "/icons/recrutement.svg",
    subItems: [
      { title: "Candidatures", href: "/admin/modules/recruit-firefighter/candidates", isActive: true },
      { title: "Casernes", href: "/admin/casernes" },
      { title: "Transfert", href: "/admin/transfert" },
      { title: "Ma caserne", href: "/admin/ma-caserne" },
      { title: "Données analytiques", href: "/admin/analytics" },
    ],
  },
  {
    title: "Planning",
    iconSrc: "/icons/Planning.svg",
    subItems: [
     {title: "sous menu", href:"/"},  
     {title: "sous menu", href:"/"},  
     {title: "sous menu", href:"/"},  
     {title: "sous menu", href:"/"},  
     {title: "sous menu", href:"/"},  
    ],
  },
  {
    title: "Congés",
    icon: Users,
    subItems: [
     {title: "sous menu", href:"/"},  
     {title: "sous menu", href:"/"},  
     {title: "sous menu", href:"/"},  
     {title: "sous menu", href:"/"},  
     {title: "sous menu", href:"/"},  
    ],
  },
]

const FOOTER_MENU_ITEMS: MenuItem[] = [
  {
    title: "Notification",
    href: "/admin/notifications",
    icon: Bell,
    badge: true,
  },
  {
    title: "Profil",
    href: "/admin/profil",
    icon: User,
  },
  {
    title: "Paramètres",
    href: "/admin/parametres",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({
    Recrutement: true,
  })

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#132e49] border-none text-white"
      {...props}
    >
      <SidebarHeader className="pt-10 pb-6">
        <div className="flex justify-center px-4">
          <Image
            src="/Logo-Blanc-avec-texte.png"
            alt="Vitall"
            width={108}
            height={32}
            className="object-contain group-data-[collapsible=icon]:hidden"
          />
          <Image
            src="/icons/small-vitall-icon-sidebar-closed.svg"
            alt="Vitall"
            width={32}
            height={32}
            className="object-contain hidden group-data-[collapsible=icon]:block"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 group-data-[state=collapsed]:px-2">
        <SidebarMenu className="group-data-[state=collapsed]:items-center">
          {MAIN_MENU_ITEMS.map((item) => (
            <SidebarMenuItem
              key={item.title}
              className="group-data-[state=collapsed]:flex group-data-[state=collapsed]:justify-center"
            >
              <SidebarMenuButton
                asChild={!item.subItems || item.subItems.length === 0}
                onClick={
                  item.subItems && item.subItems.length > 0
                    ? () => toggleMenu(item.title)
                    : undefined
                }
                className="text-white hover:bg-secondary-700 font-semibold group-data-[state=collapsed]:justify-center"
              >
                {item.href ? (
                  <Link href={item.href}>
                    {item.icon && <item.icon className="size-5" />}
                    {item.iconSrc && (
                      <Image
                        src={item.iconSrc}
                        alt={item.title}
                        width={24}
                        height={24}
                      />
                    )}
                    <span className="group-data-[state=collapsed]:hidden">
                      {item.title}
                    </span>
                  </Link>
                ) : (
                  <>
                    {item.icon && <item.icon className="size-5" />}
                    {item.iconSrc && (
                      <Image
                        src={item.iconSrc}
                        alt={item.title}
                        width={24}
                        height={24}
                      />
                    )}
                    <span className="group-data-[state=collapsed]:hidden">
                      {item.title}
                    </span>
                    {item.subItems && item.subItems.length > 0 && (
                      <>
                        {openMenus[item.title] ? (
                          <ChevronDown className="ml-auto size-5 group-data-[state=collapsed]:hidden" />
                        ) : (
                          <ChevronRight className="ml-auto size-5 group-data-[state=collapsed]:hidden" />
                        )}
                      </>
                    )}
                  </>
                )}
              </SidebarMenuButton>
              {item.subItems && item.subItems.length > 0 && openMenus[item.title] && (
                <SidebarMenuSub className="border-l border-white/20 ml-3">
                  {item.subItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        className={`text-white hover:bg-secondary-700 font-medium ${subItem.isActive ? "bg-secondary-700" : ""
                          }`}
                      >
                        <Link href={subItem.href}>{subItem.title}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4 group-data-[state=collapsed]:px-2">
        <SidebarMenu className="group-data-[state=collapsed]:items-center">
          {FOOTER_MENU_ITEMS.map((item) => (
            <SidebarMenuItem
              key={item.title}
              className="group-data-[state=collapsed]:flex group-data-[state=collapsed]:justify-center"
            >
              <SidebarMenuButton
                asChild
                className="text-white hover:bg-secondary-700 font-semibold group-data-[state=collapsed]:justify-center"
              >
                <Link href={item.href!}>
                  {item.icon && (
                    <div className={item.badge ? "relative" : ""}>
                      <item.icon className="size-5" />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 size-2 bg-red-600 rounded-full" />
                      )}
                    </div>
                  )}
                  <span className="group-data-[state=collapsed]:hidden">
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
