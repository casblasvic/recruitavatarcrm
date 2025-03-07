"use client"

import { useState, useCallback, useEffect } from "react"
import DailyAgenda from "./daily-agenda"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lock,
  Printer,
  Settings,
  SkipBack,
  SkipForward,
  Check,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainSidebar } from "./components/main-sidebar"
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
  service: string
  date: Date
  roomId: string
  startTime: string
  duration: number
  color: string
  completed?: boolean
}

export default function WeeklyAgenda() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"week" | "day">("week")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const today = new Date()

  const handleViewChange = (newView: "week" | "day") => {
    if (newView === "day") {
      setSelectedDate(today)
    }
    setView(newView)
  }

  const changeWeek = useCallback((direction: "next" | "prev") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
      return newDate
    })
  }, [])

  const changeMonth = useCallback((direction: "next" | "prev") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
      return newDate
    })
  }, [])

  const serviceRooms: ServiceRoom[] = [
    { id: "lun", name: "Lundis", color: "bg-green-600", abbrev: "Lun" },
    { id: "for", name: "Forte/Bal", color: "bg-blue-200", abbrev: "For" },
    { id: "sp", name: "Sp", color: "bg-purple-600", abbrev: "Sp" },
    { id: "we", name: "WE", color: "bg-orange-500", abbrev: "WE" },
    { id: "ws", name: "WS", color: "bg-emerald-500", abbrev: "WS" },
    { id: "eme", name: "Emerald", color: "bg-teal-700", abbrev: "Eme" },
  ]

  const weekDays = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() - currentDate.getDay() + i + 1) // Start from Monday
    return {
      name: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][i],
      date: date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }),
      fullDate: date,
    }
  })

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(i / 4) + 10
    const minutes = (i % 4) * 15
    return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  })

  const appointments: Appointment[] = [
    {
      id: "1",
      name: "nadia anachad",
      service: "Verju Amincissement",
      date: new Date(2025, 1, 24),
      roomId: "ws",
      startTime: "10:00",
      duration: 4,
      color: "bg-emerald-500",
      completed: true,
    },
    {
      id: "2",
      name: "Maria Garcia",
      service: "Masaje",
      date: new Date(2025, 1, 24),
      roomId: "sp",
      startTime: "11:30",
      duration: 2,
      color: "bg-purple-600",
    },
    // Add more appointments as needed
  ]

  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const totalMinutes = (hours - 10) * 60 + minutes // 10 is the start hour
    return (totalMinutes / 15) * 4 // 4rem is the height of each 15-minute slot
  }

  if (view === "day" && selectedDate) {
    return (
      <div className="flex h-screen">
        <MainSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <DailyAgenda
          date={selectedDate}
          onViewChange={handleViewChange}
          isToday={selectedDate.toDateString() === today.toDateString()}
        />
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <MainSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex-1 flex flex-col bg-white">
        <header className="border-b p-4">
          <h1 className="text-2xl font-medium mb-4">Agenda semanal</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => changeMonth("prev")}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => changeWeek("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">Anterior</span>
            <Button variant="ghost" size="icon" onClick={() => handleViewChange("day")}>
              <Calendar className="h-4 w-4" />
            </Button>
            <span className="text-sm">Siguiente</span>
            <Button variant="ghost" size="icon" onClick={() => changeWeek("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => changeMonth("next")}>
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
          <div className="min-w-[1200px] relative">
            <div className="grid grid-cols-[auto_repeat(6,1fr)]">
              {/* Time column header */}
              <div className="sticky top-0 z-20 bg-white border-b p-4">
                <div className="text-sm text-gray-500">Hora</div>
              </div>

              {/* Day columns headers */}
              {weekDays.map((day) => (
                <div
                  key={day.name}
                  className={`sticky top-0 z-20 bg-white border-b ${
                    day.fullDate.toDateString() === today.toDateString()
                      ? "border-2 border-blue-300 bg-blue-50/50"
                      : "border-2 border-navy-800"
                  }`}
                  onClick={() => {
                    setSelectedDate(day.fullDate)
                    setView("day")
                  }}
                >
                  <div
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-2 ${
                      day.fullDate.toDateString() === today.toDateString()
                        ? "border-blue-300 bg-blue-50/50"
                        : "border-navy-800"
                    }`}
                  >
                    <div className="text-base font-medium">{day.name}</div>
                    <div
                      className={`text-sm ${
                        day.fullDate.toDateString() === today.toDateString()
                          ? "text-blue-600 font-bold"
                          : "text-gray-500"
                      }`}
                    >
                      {day.date}
                    </div>
                  </div>
                  <div className="grid grid-cols-6 border-t">
                    {serviceRooms.map((room) => (
                      <div key={room.id} className={`${room.color} text-white text-xs p-1 text-center`}>
                        {room.abbrev}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Time slots and appointments */}
              {timeSlots.map((time, timeIndex) => (
                <React.Fragment key={time}>
                  <div className="border-r border-b p-2 text-sm text-gray-500 sticky left-0 bg-white">{time}</div>
                  {weekDays.map((day, dayIndex) => (
                    <div key={`${day.name}-${time}`} className="border-r border-b">
                      <div
                        className={`h-full ${
                          day.fullDate.toDateString() === today.toDateString()
                            ? "border-x-2 border-blue-300 bg-blue-50/50"
                            : "border-x-2 border-navy-800"
                        }`}
                      >
                        <div className={`grid grid-cols-6 h-16 ${dayIndex % 2 === 0 ? "bg-purple-50" : "bg-white"}`}>
                          {serviceRooms.map((room) => (
                            <div key={`${day.name}-${room.id}-${time}`} className="border-r relative">
                              {appointments
                                .filter(
                                  (apt) =>
                                    apt.date.toDateString() === day.fullDate.toDateString() &&
                                    apt.startTime === time &&
                                    apt.roomId === room.id,
                                )
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
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            {/* Current time indicator */}
            {view === "week" && (
              <div
                className="absolute left-0 right-0 border-t-2 border-purple-500 z-30 pointer-events-none"
                style={{
                  top: `${getCurrentTimePosition()}rem`,
                }}
              />
            )}
          </div>
        </div>

        <div className="fixed bottom-4 right-4">
          <Button className="rounded-full bg-black text-white hover:bg-gray-800">Ayuda</Button>
        </div>
      </div>
    </div>
  )
}

