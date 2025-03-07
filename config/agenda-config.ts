import type React from "react"

export const AGENDA_CONFIG = {
  TIME_SLOT_MINUTES: 15, // 15-minute intervals
  MIN_SERVICE_DURATION: 1,
  ROW_HEIGHT: 40, // Height for each row
  CURRENT_TIME_LINE_CLASS: "border-t-2 border-purple-600 w-full",
  SCROLL_OFFSET: 300,
  CELL_PADDING: 2,
  SLOTS_PER_HOUR: 4,
  MOBILE: {
    HOUR_COLUMN_WIDTH: 60, // Width for hour column in mobile
    SERVICE_COLUMN_WIDTH: 80, // Width for service columns in mobile
    HEADER_HEIGHT: 40, // Height for the header in mobile
    IOS_OFFSET: 112, // Top offset for iOS devices
  },
  DESKTOP: {
    TIME_OFFSET: 124, // Offset for desktop time indicator
  },
}

export const HOURS_IN_DAY = 24
export const MINUTES_IN_HOUR = 60

export const getTimeSlots = (startTime = "09:00", endTime = "18:00") => {
  const slots = []
  const [startHour, startMinute] = startTime.split(":").map(Number)
  const [endHour, endMinute] = endTime.split(":").map(Number)

  let currentHour = startHour
  let currentMinute = startMinute

  while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
    slots.push(`${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`)

    currentMinute += AGENDA_CONFIG.TIME_SLOT_MINUTES
    if (currentMinute >= 60) {
      currentHour++
      currentMinute = 0
    }
  }

  return slots
}

export const calculateAppointmentHeight = (duration: number) => {
  return (duration / AGENDA_CONFIG.TIME_SLOT_MINUTES) * AGENDA_CONFIG.ROW_HEIGHT
}

export const getCurrentTimePosition = (currentTime: Date | undefined, isMobile = false): number | null => {
  if (!currentTime) return null

  const startTime = new Date(currentTime)
  startTime.setHours(AGENDA_CONFIG.START_HOUR, 0, 0, 0)

  const totalCurrentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
  const totalStartMinutes = AGENDA_CONFIG.START_HOUR * 60

  if (totalCurrentMinutes < totalStartMinutes || totalCurrentMinutes >= AGENDA_CONFIG.END_HOUR * 60) {
    return null
  }

  const diffMinutes = totalCurrentMinutes - totalStartMinutes
  const position = (diffMinutes / AGENDA_CONFIG.TIME_SLOT_MINUTES) * AGENDA_CONFIG.ROW_HEIGHT

  // Different positioning for mobile and desktop
  if (isMobile) {
    return position // Mobile positioning is correct as is
  } else {
    return position + AGENDA_CONFIG.DESKTOP.TIME_OFFSET // Restore desktop offset
  }
}

export const scrollToCurrentTime = (containerRef: React.RefObject<HTMLDivElement>) => {
  if (!containerRef.current) return

  const currentTime = new Date()
  const position = getCurrentTimePosition(currentTime)

  if (position !== null) {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: Math.max(0, position - AGENDA_CONFIG.ROW_HEIGHT * 2),
        behavior: "smooth",
      })
    }, 100)
  }
}

