"use client"

import * as React from "react"
import { Clock, Plus, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WeekSchedule, DaySchedule, TimeRange } from "@/types/schedule"
import { useTemplates } from "@/hooks/use-templates"

interface ScheduleConfigProps {
  value: WeekSchedule
  onChange: (schedule: WeekSchedule) => void
  showTemplateSelector?: boolean
}

const DAYS = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
} as const

export function ScheduleConfig({ value, onChange, showTemplateSelector = false }: ScheduleConfigProps) {
  const { templates } = useTemplates()
  const [expandedDays, setExpandedDays] = React.useState<string[]>([])

  const toggleDay = (day: string) => {
    setExpandedDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    )
  }

  const updateDaySchedule = (day: keyof WeekSchedule, schedule: DaySchedule) => {
    onChange({
      ...value,
      [day]: schedule,
    })
  }

  const copySchedule = (fromDay: keyof WeekSchedule, toDay: keyof WeekSchedule) => {
    onChange({
      ...value,
      [toDay]: { ...value[fromDay] },
    })
  }

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      onChange(template.schedule)
    }
  }

  const updateTimeRange = (day: keyof WeekSchedule, index: number, field: "start" | "end", newValue: string) => {
    const updatedRanges = [...value[day].ranges];
    updatedRanges[index] = { ...updatedRanges[index], [field]: newValue };
    updateDaySchedule(day, { ...value[day], ranges: updatedRanges });
  };

  const removeTimeRange = (day: keyof WeekSchedule, index: number) => {
    const updatedRanges = value[day].ranges.filter((_, i) => i !== index);
    updateDaySchedule(day, { ...value[day], ranges: updatedRanges });
  };

  const addTimeRange = (day: keyof WeekSchedule) => {
    const newRange: TimeRange = { start: "08:00", end: "17:00" };
    updateDaySchedule(day, { ...value[day], ranges: [...value[day].ranges, newRange] });
  };

  return (
    <div className="space-y-4">
      {showTemplateSelector && templates.length > 0 && (
        <div className="space-y-2">
          <Label>Seleccionar plantilla</Label>
          <Select onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar una plantilla" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {Object.entries(DAYS).map(([day, label]) => (
        <Card key={day} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={value[day].isOpen}
                onCheckedChange={(checked) =>
                  updateDaySchedule(day, {
                    ...value[day],
                    isOpen: checked as boolean,
                  })
                }
              />
              <Label className="font-medium">{label}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => toggleDay(day)}>
                {expandedDays.includes(day) ? "Ocultar" : "Mostrar"}
              </Button>
              <Select
                value=""
                onValueChange={(copyFrom) => {
                  if (copyFrom) {
                    copySchedule(copyFrom as keyof WeekSchedule, day)
                  }
                }}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Copiar de..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DAYS).map(
                    ([key, label]) =>
                      key !== day && (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {expandedDays.includes(day) && value[day].isOpen && (
            <div className="mt-4 space-y-4">
              {value[day].ranges.map((range, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Hora inicio</Label>
                      <input
                        type="time"
                        value={range.start}
                        onChange={(e) => updateTimeRange(day, index, "start", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <Label>Hora fin</Label>
                      <input
                        type="time"
                        value={range.end}
                        onChange={(e) => updateTimeRange(day, index, "end", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeTimeRange(day, index)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addTimeRange(day)} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Añadir rango horario
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

