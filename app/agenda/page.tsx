"use client"

import { useEffect, useState } from "react"
import WeeklyAgenda from "@/components/weekly-agenda"
import { MobileAgendaView } from "@/components/mobile-views/mobile-agenda-view"

export default function AgendaPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile ? <MobileAgendaView /> : <WeeklyAgenda />
}

