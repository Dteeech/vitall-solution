"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/Sidebar"
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const router = useRouter()

  // Plus tard, décommenter pour activer la protection d'authentification :
  // useEffect(() => {
  //   const isAuthenticated = checkAuth() // votre logique d'auth
  //   if (!isAuthenticated) {
  //     router.push("/login")
  //   }
  // }, [router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b$ px-4">
          <SidebarTrigger className="-ml-1 text-white bg-secondary-900 hover:bg-secondary-900" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumb />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
