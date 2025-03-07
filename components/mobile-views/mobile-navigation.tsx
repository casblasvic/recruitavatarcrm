"use client"

import { Home, Calendar, Users, BarChart2 } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function MobileNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const items = [
    { icon: Home, label: "Inicio", href: "/" },
    { icon: Calendar, label: "Agenda", href: "/agenda" },
    { icon: Users, label: "Clientes", href: "/clientes" },
    { icon: BarChart2, label: "Estadísticas", href: "/estadisticas" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <button
            key={item.href}
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive ? "text-purple-600" : "text-gray-500"
            }`}
            onClick={() => router.push(item.href)}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

