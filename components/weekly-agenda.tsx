"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClientSearchDialog } from "@/components/client-search-dialog"
import { AppointmentDialog } from "@/components/appointment-dialog"
import { NewClientDialog } from "@/components/new-client-dialog"
import { ResizableAppointment } from "./resizable-appointment"
import { MobileWeeklyAgenda } from "./mobile-weekly-agenda"
import React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { getTimeSlots, scrollToCurrentTime } from "@/config/agenda-config"
import { CurrentTimeIndicator } from "@/components/current-time-indicator"
import { AGENDA_CONFIG } from "@/config/agenda-config"
import { useClinic } from "@/contexts/clinic-context"

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

export default function WeeklyAgenda() {
  const [isMobile, setIsMobile] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"week" | "day">("week")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date
    time: string
    roomId: string
  } | null>(null)
  const [selectedClient, setSelectedClient] = useState<{
    name: string
    phone: string
  } | null>(null)
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false)

  const [appointments, setAppointments] = useState<Appointment[]>([
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
  ])

  const { activeClinic } = useClinic()
  const { openTime, closeTime, weekendOpenTime, weekendCloseTime, cabins } = activeClinic.config

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    scrollToCurrentTime(containerRef)
  }, [])

  const today = new Date()

  const handleViewChange = (newView: "week" | "day", newDate?: Date) => {
    if (newView === "day") {
      setSelectedDate(newDate || currentDate)
    } else {
      setCurrentDate(newDate || currentDate)
    }
    setView(newView)
  }

  const weekDays = React.useMemo(() => {
    // Get the Monday of the current week
    const monday = new Date(currentDate)
    monday.setDate(monday.getDate() - monday.getDay() + (monday.getDay() === 0 ? -6 : 1))

    const days = []

    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday)
      currentDay.setDate(monday.getDate() + i)

      // Check if we should include this day
      const dayOfWeek = currentDay.getDay()
      const isSaturday = dayOfWeek === 6
      const isSunday = dayOfWeek === 0

      // Include the day if:
      // 1. It's a weekday (Mon-Fri)
      // 2. It's Saturday and saturdayOpen is true
      // 3. It's Sunday and sundayOpen is true
      if (
        (!isSaturday && !isSunday) ||
        (isSaturday && activeClinic.config.saturdayOpen) ||
        (isSunday && activeClinic.config.sundayOpen)
      ) {
        days.push({
          name: format(currentDay, "EEE", { locale: es }),
          date: format(currentDay, "dd/MM"),
          fullDate: currentDay,
        })
      }
    }

    return days
  }, [currentDate, activeClinic.config.saturdayOpen, activeClinic.config.sundayOpen])

  const changeWeek = useCallback((direction: "next" | "prev") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
      return newDate
    })
  }, [])

  const handleCellClick = (date: Date, time: string, roomId: string) => {
    const cabin = cabins.find((c) => c.id.toString() === roomId)
    if (cabin && cabin.isActive) {
      setSelectedSlot({ date, time, roomId })
      setIsSearchDialogOpen(true)
    }
  }

  const handleClientSelect = (client: { name: string; phone: string }) => {
    setSelectedClient(client)
    setIsSearchDialogOpen(false)
    setIsAppointmentDialogOpen(true)
  }

  const handleDeleteAppointment = useCallback(() => {
    if (selectedSlot) {
      setAppointments((prev) =>
        prev.filter(
          (apt) =>
            !(
              apt.date.toDateString() === selectedSlot.date.toDateString() &&
              apt.startTime === selectedSlot.time &&
              apt.roomId === selectedSlot.roomId
            ),
        ),
      )
    }
  }, [selectedSlot])

  const handleSaveAppointment = useCallback(
    (appointmentData: {
      client: { name: string; phone: string }
      services: { id: string; name: string; category: string }[]
      time: string
      comment?: string
    }) => {
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
            duration: 2, // Default duration
            color: cabin.color, // Use cabin color
          }

          setAppointments((prev) => [...prev, newAppointment])
        }
      }
    },
    [selectedSlot, cabins],
  )

  const handleAppointmentResize = (id: string, newDuration: number) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((a) => (a.id === id ? { ...a, duration: newDuration } : a)),
    )
    setIsAppointmentDialogOpen(false)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const { source, destination } = result
    const updatedAppointments = Array.from(appointments)
    const [movedAppointment] = updatedAppointments.splice(source.index, 1)

    const [newDay, newRoom, newTime] = destination.droppableId.split("-")
    const newDate = weekDays[Number.parseInt(newDay)].fullDate

    const updatedAppointment = {
      ...movedAppointment,
      date: newDate,
      roomId: newRoom,
      startTime: newTime,
    }

    const endTime = new Date(newDate)
    endTime.setHours(23, 59, 59)
    const appointmentEndTime = new Date(newDate)
    appointmentEndTime.setHours(
      Number.parseInt(newTime.split(":")[0]),
      Number.parseInt(newTime.split(":")[1]) + updatedAppointment.duration * 15,
    )

    if (appointmentEndTime > endTime) {
      const availableMinutes = (endTime.getTime() - appointmentEndTime.getTime()) / (1000 * 60)
      updatedAppointment.duration = Math.floor(availableMinutes / 15)
    }

    const conflictingAppointments = updatedAppointments.filter(
      (apt) =>
        apt.date.toDateString() === updatedAppointment.date.toDateString() &&
        apt.roomId === updatedAppointment.roomId &&
        apt.startTime === updatedAppointment.startTime,
    )

    if (conflictingAppointments.length > 0) {
      const nextAvailableTime = new Date(newDate)
      nextAvailableTime.setHours(Number.parseInt(newTime.split(":")[0]), Number.parseInt(newTime.split(":")[1]))

      while (
        conflictingAppointments.some(
          (apt) =>
            apt.startTime ===
            nextAvailableTime.getHours().toString().padStart(2, "0") +
              ":" +
              nextAvailableTime.getMinutes().toString().padStart(2, "0"),
        )
      ) {
        nextAvailableTime.setMinutes(nextAvailableTime.getMinutes() + 15)
      }

      updatedAppointment.startTime =
        nextAvailableTime.getHours().toString().padStart(2, "0") +
        ":" +
        nextAvailableTime.getMinutes().toString().padStart(2, "0")
    }

    updatedAppointments.push(updatedAppointment)

    updatedAppointments.sort((a, b) => {
      if (a.date.getTime() !== b.date.getTime()) {
        return a.date.getTime() - b.date.getTime()
      }
      return a.startTime.localeCompare(b.startTime)
    })

    setAppointments(updatedAppointments)
    setIsAppointmentDialogOpen(false)
  }

  const activeCabins = cabins.filter((cabin) => cabin.isActive).sort((a, b) => a.order - b.order)

  if (isMobile) {
    return <MobileWeeklyAgenda cabins={activeCabins} />
  }

  // Use the clinic's configuration for time slots
  const timeSlots = getTimeSlots(openTime, closeTime)

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative z-0 flex h-screen">
        <div className="flex-1 flex flex-col bg-white">
          <header className="px-4 py-3 z-10 relative bg-white">
            <div className="px-4 py-3">
              <h1 className="text-2xl font-medium mb-4">Agenda semanal</h1>
            </div>
            <div className="flex items-center gap-3 border-b pb-3">
              <Button variant="ghost" size="icon" onClick={() => changeWeek("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                {weekDays.length > 0
                  ? `${weekDays[0].date} - ${weekDays[weekDays.length - 1].date}`
                  : "No hay días disponibles"}
              </span>
              <Button variant="ghost" size="icon" onClick={() => changeWeek("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleViewChange("day")} className="text-purple-600">
                <Calendar className="h-4 w-4" />
              </Button>
              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px] ml-2">
                  <SelectValue placeholder="(Todos)" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="todos">(Todos)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>
          <div ref={containerRef} className="flex-1 overflow-auto relative z-0" style={{ scrollBehavior: "smooth" }}>
            <div className="min-w-[1200px] relative">
              <div className={`grid grid-cols-[auto_repeat(${weekDays.length},1fr)]`}>
                {/* Time column header */}
                <div className="sticky top-0 z-20 bg-white border-b p-4 w-20">
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
                  >
                    <div
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        day.fullDate.toDateString() === today.toDateString() ? "bg-blue-50/50" : ""
                      }`}
                      onClick={() => {
                        setSelectedDate(day.fullDate)
                        setView("day")
                      }}
                    >
                      <div className="text-base font-medium capitalize">
                        {format(day.fullDate, "EEEE", { locale: es })}
                      </div>
                      <div
                        className={`text-sm ${
                          day.fullDate.toDateString() === today.toDateString()
                            ? "text-purple-600 font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {format(day.fullDate, "d/M/yyyy")}
                      </div>
                    </div>
                    <div
                      className="grid border-t border-gray-200"
                      style={{ gridTemplateColumns: `repeat(${activeCabins.length}, 1fr)` }}
                    >
                      {activeCabins.map((cabin) => (
                        <div
                          key={cabin.id}
                          className="text-white text-xs py-2 px-1 text-center font-medium"
                          style={{ backgroundColor: cabin.color }}
                        >
                          {cabin.code}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Time slots and appointments */}
                {timeSlots.map((time) => (
                  <React.Fragment key={time}>
                    <div className="border-r border-b p-2 text-sm text-purple-600 sticky left-0 bg-white font-medium w-20">
                      {time}
                    </div>
                    {weekDays.map((day, dayIndex) => (
                      <div key={`${day.name}-${time}`} className="border-r border-b border-gray-100">
                        <div
                          className={`h-full ${
                            day.fullDate.toDateString() === today.toDateString()
                              ? "border-x-2 border-blue-300 bg-blue-50/50"
                              : "border-x border-gray-200"
                          }`}
                        >
                          <div
                            className={`grid ${dayIndex % 2 === 0 ? "bg-purple-50/30" : "bg-white"}`}
                            style={{
                              height: `${AGENDA_CONFIG.ROW_HEIGHT}px`,
                              gridTemplateColumns: `repeat(${activeCabins.length}, 1fr)`,
                            }}
                          >
                            {activeCabins.map((cabin) => (
                              <Droppable
                                droppableId={`${dayIndex}-${cabin.id}-${time}`}
                                key={`${day.name}-${cabin.id}-${time}`}
                                type="appointment"
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="relative cursor-pointer hover:bg-purple-50 border-r last:border-r-0"
                                    style={{
                                      height: `${AGENDA_CONFIG.ROW_HEIGHT}px`,
                                      width: `${AGENDA_CONFIG.CELL_WIDTH}px`,
                                      backgroundColor: snapshot.isDraggingOver ? "rgba(167, 139, 250, 0.1)" : undefined,
                                    }}
                                    onClick={() => handleCellClick(day.fullDate, time, cabin.id.toString())}
                                  >
                                    {appointments
                                      .filter(
                                        (apt) =>
                                          apt.date.toDateString() === day.fullDate.toDateString() &&
                                          apt.startTime === time &&
                                          apt.roomId === cabin.id.toString(),
                                      )
                                      .map((apt, index) => (
                                        <ResizableAppointment
                                          key={apt.id}
                                          appointment={apt}
                                          index={index}
                                          onResize={handleAppointmentResize}
                                          onClick={(appointment) => {
                                            setSelectedClient({
                                              name: appointment.name,
                                              phone: appointment.phone || "",
                                            })
                                            setSelectedSlot({
                                              date: day.fullDate,
                                              time: appointment.startTime,
                                              roomId: appointment.roomId,
                                            })
                                            setIsAppointmentDialogOpen(true)
                                          }}
                                        />
                                      ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    <CurrentTimeIndicator isMobile={false} />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ClientSearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        onClientSelect={handleClientSelect}
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
        onDelete={handleDeleteAppointment}
        onSave={handleSaveAppointment}
      />

      <NewClientDialog isOpen={isNewClientDialogOpen} onClose={() => setIsNewClientDialogOpen(false)} />
    </DragDropContext>
  )
}

