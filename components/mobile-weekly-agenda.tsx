"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Users, Search, Settings, Menu } from "lucide-react"
import { ClientSearchDialog } from "@/components/client-search-dialog"
import { AppointmentDialog } from "@/components/appointment-dialog"
import { NewClientDialog } from "@/components/new-client-dialog"
import { MobileWeekView } from "./mobile-week-view"
import { MobileAppointmentList } from "./mobile-appointment-list"
import { MobileDrawerMenu } from "./mobile-drawer-menu"
import { useRouter } from "next/navigation"
import { AGENDA_CONFIG, getTimeSlots, scrollToCurrentTime } from "@/config/agenda-config"
import { CurrentTimeIndicator } from "./current-time-indicator"

interface Cabin {
  id: number
  code: string
  name: string
  color: string
  isActive: boolean
  order: number
}

interface Appointment {
  id: string
  name: string
  service: string
  date: Date
  roomId: string
  startTime: string
  duration: number
  color: string
  completed?: boolean
  phone?: string
}

interface MobileWeeklyAgendaProps {
  cabins: Cabin[]
}

export function MobileWeeklyAgenda({ cabins }: MobileWeeklyAgendaProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date
    time: string
    roomId: string
  } | null>(null)
  const [selectedClient, setSelectedClient] = useState<{
    name: string
    phone: string
  } | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      name: "Juan Pérez",
      service: "Consulta General",
      date: new Date(2023, 5, 15),
      roomId: "1",
      startTime: "10:00",
      duration: 2,
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "María García",
      service: "Limpieza Dental",
      date: new Date(2023, 5, 16),
      roomId: "2",
      startTime: "11:30",
      duration: 3,
      color: "bg-green-500",
    },
  ])

  const router = useRouter()
  const timeSlots = getTimeSlots()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to current time on mount
    scrollToCurrentTime(containerRef)
  }, [])

  const changeWeek = useCallback((direction: "next" | "prev") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
      return newDate
    })
  }, [])

  const handleAppointmentClick = (appointment: Appointment) => {
    const cabin = cabins.find((c) => c.id.toString() === appointment.roomId)
    if (cabin && cabin.isActive) {
      setSelectedClient({ name: appointment.name, phone: appointment.phone || "" })
      setSelectedSlot({ date: appointment.date, time: appointment.startTime, roomId: appointment.roomId })
      setIsAppointmentDialogOpen(true)
    }
  }

  const handleCellClick = (date: Date, time: string, roomId: string) => {
    const cabin = cabins.find((c) => c.id.toString() === roomId)
    if (cabin && cabin.isActive) {
      setSelectedSlot({ date, time, roomId })
      setIsSearchDialogOpen(true)
    }
  }

  const mobileMenuItems = [
    { label: "Agenda", icon: <Calendar className="h-5 w-5" />, href: "/agenda" },
    { label: "Clientes", icon: <Users className="h-5 w-5" />, href: "/clientes" },
    { label: "Buscar", icon: <Search className="h-5 w-5" />, href: "/buscar" },
    { label: "Ajustes", icon: <Settings className="h-5 w-5" />, href: "/ajustes" },
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="text-xl font-semibold text-purple-600">LOGO</div>
        <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      <main
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 pb-20 relative"
        style={{
          scrollBehavior: "smooth",
          height: "calc(100vh - 64px - 64px)", // Restamos altura del header y nav
          overflowY: "auto",
          WebkitOverflowScrolling: "touch", // Mejora el scroll en iOS
        }}
      >
        <h1 className="text-xl font-bold mb-4">Agenda Semanal</h1>
        <MobileWeekView currentDate={currentDate} onChangeWeek={changeWeek} />
        <div className="relative" style={{ minHeight: `${AGENDA_CONFIG.ROW_HEIGHT * timeSlots.length}px` }}>
          <div className="divide-y relative">
            {timeSlots.map((time) => (
              <div key={time} className="flex items-center" style={{ height: `${AGENDA_CONFIG.ROW_HEIGHT}px` }}>
                <div className="w-16 text-sm text-purple-600 font-medium">{time}</div>
                <div className="flex-1 h-full grid" style={{ gridTemplateColumns: `repeat(${cabins.length}, 1fr)` }}>
                  {cabins.map((cabin) => (
                    <div
                      key={cabin.id}
                      className={`border-r last:border-r-0 relative ${
                        cabin.isActive ? "" : "bg-gray-200 cursor-not-allowed"
                      }`}
                      onClick={() => handleCellClick(currentDate, time, cabin.id.toString())}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <MobileAppointmentList
            appointments={appointments}
            currentDate={currentDate}
            onAppointmentClick={handleAppointmentClick}
            cabins={cabins}
          />
          {/* Current time indicator */}
          <CurrentTimeIndicator isMobile={true} />
        </div>
      </main>

      <Button
        className="fixed bottom-20 right-4 rounded-full shadow-lg bg-purple-600 text-white"
        size="icon"
        onClick={() => setIsSearchDialogOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <ClientSearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        onClientSelect={(client) => {
          setSelectedClient(client)
          setIsSearchDialogOpen(false)
          setIsAppointmentDialogOpen(true)
        }}
        selectedTime={selectedSlot?.time}
      />

      <AppointmentDialog
        isOpen={isAppointmentDialogOpen}
        onClose={() => setIsAppointmentDialogOpen(false)}
        client={selectedClient}
        selectedTime={selectedSlot?.time}
        onSearchClick={() => {
          setIsAppointmentDialogOpen(false)
          setIsSearchDialogOpen(true)
        }}
        onNewClientClick={() => {
          setIsAppointmentDialogOpen(false)
          setIsNewClientDialogOpen(true)
        }}
        onDelete={() => {
          setAppointments(appointments.filter((apt) => apt.id !== selectedSlot?.roomId))
          setIsAppointmentDialogOpen(false)
        }}
        onSave={(appointmentData) => {
          if (selectedSlot) {
            const cabin = cabins.find((c) => c.id.toString() === selectedSlot.roomId)
            if (cabin && cabin.isActive) {
              const newAppointment: Appointment = {
                id: Math.random().toString(36).substr(2, 9),
                name: appointmentData.client.name,
                service: appointmentData.services.map((s) => s.name).join(", "),
                date: selectedSlot.date,
                roomId: selectedSlot.roomId,
                startTime: appointmentData.time,
                duration: 2,
                color: cabin.color,
                phone: appointmentData.client.phone,
              }
              setAppointments([...appointments, newAppointment])
            }
          }
          setIsAppointmentDialogOpen(false)
        }}
      />

      <NewClientDialog isOpen={isNewClientDialogOpen} onClose={() => setIsNewClientDialogOpen(false)} />

      <MobileDrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-50">
        {mobileMenuItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="flex flex-col items-center justify-center h-full w-full"
            onClick={() => router.push(item.href)}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Button>
        ))}
      </nav>
    </div>
  )
}

