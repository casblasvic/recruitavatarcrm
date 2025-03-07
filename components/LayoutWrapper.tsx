"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MainSidebar } from "@/components/main-sidebar"
import { Button } from "@/components/ui/button"
import { Menu, Home, Calendar, Users, BarChart2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ClientCardWrapper } from "@/components/client-card-wrapper"
import { MobileDrawerMenu } from "@/components/mobile-views/mobile-drawer-menu"
import { useRouter } from "next/navigation"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 md:flex-row">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(true)} className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex flex-col">
              <div className="text-xl font-semibold">LOGO</div>
              <div className="text-xs text-purple-600">
                {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ClientCardWrapper />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileDrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Sidebar for desktop */}
      {!isMobile && (
        <div className="fixed left-0 top-16 bottom-0 z-40">
          <MainSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isMobile ? "mt-16 pb-16" : isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Contenido scrolleable */}
        <div className="relative h-full overflow-auto">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t z-50 grid grid-cols-4">
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-full"
            onClick={() => router.push("/")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Inicio</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-full"
            onClick={() => router.push("/agenda")}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Agenda</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-full"
            onClick={() => router.push("/clientes")}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs">Clientes</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-full"
            onClick={() => router.push("/estadisticas")}
          >
            <BarChart2 className="h-5 w-5" />
            <span className="text-xs">Estadísticas</span>
          </Button>
        </nav>
      )}
    </div>
  )
}

