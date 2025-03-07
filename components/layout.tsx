"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MainSidebar } from "@/components/main-sidebar"
import { ClientCardWrapper } from "./client-card-wrapper"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ClinicSelector } from "./clinic-selector"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const showClientCard = !pathname?.startsWith("/clientes/")

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MainSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between relative z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-purple-600 hover:bg-purple-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex flex-col">
              <div className="text-xl font-semibold">LOGO</div>
              <div className="text-xs text-purple-600">
                {format(currentDateTime, "EEEE, d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </div>
            </div>
          </div>
          {showClientCard && (
            <div className="flex-1 flex justify-end items-center gap-4">
              <ClinicSelector />
              <div className="w-72">
                <ClientCardWrapper position="header" />
              </div>
            </div>
          )}
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

