"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLastClient } from "@/contexts/last-client-context"
import { useClientCard } from "@/contexts/client-card-context"

interface Client {
  id: string
  name: string
  clientNumber: string
  phone: string
  email: string
  clinic: string
  avatar?: string
}

const tabs = [
  { label: "DATOS DEL CLIENTE", path: "" },
  { label: "HISTORIAL", path: "/historial" },
  { label: "CONSENTIMIENTOS", path: "/consentimientos" },
  { label: "APLAZADO", path: "/aplazado" },
  { label: "BONOS", path: "/bonos" },
  { label: "FOTOGRAFÍAS", path: "/fotografias" },
  { label: "AVISOS", path: "/avisos" },
]

export default function ClientLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const { setLastClient } = useLastClient()
  const { setHideMainCard } = useClientCard()
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHideMainCard(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => {
      setHideMainCard(false)
      window.removeEventListener("resize", checkMobile)
    }
  }, [setHideMainCard])

  useEffect(() => {
    const clientData = {
      id: params.id,
      name: "Lina Sadaoui Sadaoui",
      clientNumber: "6557",
      phone: "+212622742529",
      email: "linasadaoui@gmail.com",
      clinic: "Multilaser Californie",
      avatar: "/placeholder.svg",
    }
    setClient(clientData)
    setLastClient(clientData)
  }, [params.id, setLastClient])

  useEffect(() => {
    if (isMobile) {
      const currentTabsRef = tabsRef.current
      if (currentTabsRef) {
        const activeTab = currentTabsRef.querySelector('[aria-current="page"]')
        if (activeTab) {
          activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
        }
      }
    }
  }, [isMobile])

  if (!client) return null

  return (
    <div className="container mx-auto px-4 md:px-8 py-4 mt-16 mb-16 md:mb-0">
      {" "}
      {/* Añadido mt-16 para dar espacio debajo del header */}
      {/* Tabs */}
      <div className={`mb-6 border-b ${isMobile ? "sticky top-16 bg-white z-10" : ""}`}>
        {" "}
        {/* Cambiado top-0 a top-16 */}
        <div
          ref={tabsRef}
          className={`flex ${isMobile ? "overflow-x-auto scrollbar-hide" : "flex-wrap"} space-x-2 md:space-x-4 pb-2`}
        >
          {tabs.map((tab) => {
            const isActive = pathname === `/clientes/${client.id}${tab.path}`
            return (
              <Link
                key={tab.path}
                href={`/clientes/${client.id}${tab.path}`}
                className={`flex-shrink-0 px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  isActive ? "bg-purple-600 text-white" : "text-gray-500 hover:text-purple-600 hover:bg-purple-100"
                } ${isMobile ? "whitespace-nowrap" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>
      {/* Page content */}
      <div className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
        {children}
        {/* Los botones específicos de cada pestaña se renderizarán dentro de 'children' */}
      </div>
    </div>
  )
}

