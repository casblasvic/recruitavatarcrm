"use client"
import { Draggable } from "react-beautiful-dnd"
import { Check } from "lucide-react"
import { AGENDA_CONFIG } from "@/config/agenda-config"

interface ResizableAppointmentProps {
  appointment: {
    id: string
    name: string
    service: string
    completed?: boolean
    color: string
    duration: number
  }
  index: number
  onResize: (id: string, newDuration: number) => void
  onClick: (appointment: any) => void
}

export interface Appointment {
  id: string
  name: string
  service: string
  completed?: boolean
  color: string
  duration: number
}

export function ResizableAppointment({
  appointment,
  index,
  onResize,
  onClick,
}: {
  appointment: Appointment
  index: number
  onResize: (id: string, newDuration: number) => void
  onClick: (appointment: Appointment) => void
}) {
  return (
    <Draggable draggableId={appointment.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`absolute left-0 right-0 ${appointment.color} rounded-sm text-white text-xs p-1 cursor-pointer`}
          style={{
            ...provided.draggableProps.style,
            height: `${appointment.duration * AGENDA_CONFIG.ROW_HEIGHT}px`,
            width: `${AGENDA_CONFIG.CELL_WIDTH}px`,
            zIndex: 10,
          }}
          onClick={() => onClick(appointment)}
        >
          <div className="truncate font-medium">{appointment.name}</div>
          <div className="truncate text-[10px] opacity-90">{appointment.service}</div>
          {appointment.completed && (
            <div className="absolute bottom-1 right-1">
              <Check className="h-3 w-3" />
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

