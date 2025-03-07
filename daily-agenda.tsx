"use client"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  Printer,
  Settings,
  SkipBack,
  SkipForward,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from "react"

interface ServiceRoom {
  id: string
  name: string
  color: string
  abbrev: string
}

interface Appointment {
  id: string
  name: string
  phone: string
  service: string
  status?: string
  completed?: boolean
  color: string
  roomId: string
  startTime: string
  duration: number
}

interface DailyAgendaProps {
  date: Date
  onViewChange?: (view: "week" | "day") => void
  isToday?: boolean
}

export default function DailyAgenda({ date, onViewChange, isToday = false }: DailyAgendaProps) {
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(i / 4) + 10
    const minutes = (i % 4) * 15
    return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  })

  const serviceRooms: ServiceRoom[] = [
    { id: "lun", name: "Lundis", color: "bg-green-600", abbrev: "Lun" },
    { id: "for", name: "Forte/Bal", color: "bg-blue-200", abbrev: "For" },
    { id: "sp", name: "Sp", color: "bg-purple-600", abbrev: "Sp" },
    { id: "we", name: "WE", color: "bg-orange-500", abbrev: "WE" },
    { id: "ws", name: "WS", color: "bg-emerald-500", abbrev: "WS" },
    { id: "eme", name: "Emerald", color: "bg-teal-700", abbrev: "Eme" },
  ]

  const appointments: Appointment[] = [
    {
      id: "1",
      name: "nadia anachad",
      phone: "+212668138929",
      service: "Verju Amincissement",
      color: "bg-emerald-500",
      roomId: "ws",
      startTime: "10:00",
      duration: 4,
      completed: true,
    },
    // Add more appointments as needed
  ]

  const handleViewChange = () => {
    if (onViewChange) {
      onViewChange("week")
    }
  }

  const dayName = date.toLocaleDateString("es-ES", { weekday: "long" })
  const formattedDate = date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="border-b p-4">
        <h1 className="text-2xl font-medium mb-4">Agenda diaria</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Anterior</span>
          <Button variant="ghost" size="icon" onClick={handleViewChange}>
            <Calendar className="h-4 w-4" />
          </Button>
          <span className="text-sm">Siguiente</span>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Lock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Select defaultValue="todos">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="(Todos)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">(Todos)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-[auto_1fr]">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b p-4">
              <div className="text-sm text-gray-500">Hora</div>
            </div>
            <div className="sticky top-0 z-20 bg-white border-b p-4">
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl capitalize">{dayName}</h2>
                <button onClick={handleViewChange} className="text-green-600 text-sm hover:underline">
                  (Ver semana completa)
                </button>
              </div>
              <div className="text-gray-500">{formattedDate}</div>
              <div className="grid grid-cols-6 mt-2">
                {serviceRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`h-6 ${room.color} text-white text-xs flex items-center justify-center`}
                  >
                    {room.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Time slots */}
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="border-r border-b p-2 text-sm text-gray-500">{time}</div>
                <div className="border-b">
                  <div className="grid grid-cols-6 h-16">
                    {serviceRooms.map((room) => (
                      <div key={`${room.id}-${time}`} className="border-r relative bg-gray-50/50">
                        {appointments
                          .filter((apt) => apt.startTime === time && apt.roomId === room.id)
                          .map((apt) => (
                            <div
                              key={apt.id}
                              className={`absolute inset-0 ${apt.color} text-white p-1 text-xs`}
                              style={{
                                height: `${apt.duration * 4}rem`,
                                zIndex: 10,
                              }}
                            >
                              <div className="font-medium truncate">{apt.service}</div>
                              <div className="truncate">{apt.name}</div>
                              {apt.completed && (
                                <div className="absolute top-1 right-1">
                                  <Check className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <Button className="rounded-full bg-black text-white hover:bg-gray-800">Ayuda</Button>
      </div>
    </div>
  )
}

