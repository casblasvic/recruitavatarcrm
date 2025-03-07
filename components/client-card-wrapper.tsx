"use client"

import { useState } from "react"
import { useLastClient } from "@/contexts/last-client-context"
import { useClientCard } from "@/contexts/client-card-context"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Share2, Bell, User, LogOut, Settings, FileText } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"

const quickActions = [
  { label: "Historial", path: "/historial" },
  { label: "Consentimientos", path: "/consentimientos" },
  { label: "Aplazado", path: "/aplazado" },
  { label: "Bonos", path: "/bonos" },
  { label: "Fotografías", path: "/fotografias" },
  { label: "Avisos", path: "/avisos" },
]

export function ClientCardWrapper() {
  const { lastClient } = useLastClient()
  const { hideMainCard } = useClientCard()
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()

  // Don't show the wrapper on the search page
  if (pathname === "/clientes/busqueda") return null

  return (
    <div className="flex items-center gap-4">
      {/* Client Card */}
      {lastClient && !hideMainCard && (
        <div
          className="relative"
          onMouseEnter={() => setShowQuickActions(true)}
          onMouseLeave={() => setShowQuickActions(false)}
        >
          <Card className="w-72 transition-all duration-300 hover:shadow-lg border-0">
            <div className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={lastClient.avatar} alt={lastClient.name} />
                    <AvatarFallback>
                      {lastClient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h2 className="text-sm font-medium text-purple-600 truncate">{lastClient.name}</h2>
                    <p className="text-xs text-gray-500 truncate">Nº: {lastClient.clientNumber}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <RefreshCcw className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {showQuickActions && (
            <div
              className="absolute top-full right-0 z-50 mt-1 w-64 rounded-lg border bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {quickActions.map((action) => (
                <Link
                  key={action.path}
                  href={`/clientes/${lastClient.id}${action.path}`}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-600"
                  onClick={() => setShowQuickActions(false)}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-medium">Notificaciones</span>
            <Button variant="ghost" size="sm" className="text-xs">
              Marcar todo como leído
            </Button>
          </div>
          <div className="py-2">
            <div className="px-4 py-2 text-sm text-gray-500">No hay notificaciones nuevas</div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* System User Menu */}
      <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full p-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback>RA</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <div className="flex items-center gap-3 p-3 border-b">
            <Avatar className="h-10 w-10">
              <AvatarFallback>RA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Squad Chafiki</span>
              <span className="text-xs text-muted-foreground">usuario@example.com</span>
            </div>
          </div>
          <DropdownMenuItem asChild>
            <Link href="/perfil/datos-personales">
              <User className="mr-2 h-4 w-4" />
              <span>Editar datos personales</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/perfil/suscripcion">
              <Settings className="mr-2 h-4 w-4" />
              <span>Mi suscripción</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/perfil/facturacion">
              <FileText className="mr-2 h-4 w-4" />
              <span>Datos de facturación</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/perfil/servicios">
              <Settings className="mr-2 h-4 w-4" />
              <span>Servicios contratados</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/perfil/facturas">
              <FileText className="mr-2 h-4 w-4" />
              <span>Facturas</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Desconectar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

