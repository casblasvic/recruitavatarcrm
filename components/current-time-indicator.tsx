import type React from "react"
import { getCurrentTimePosition, AGENDA_CONFIG } from "@/config/agenda-config"

interface CurrentTimeIndicatorProps {
  currentTime?: Date
  isMobile?: boolean
}

export const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ currentTime, isMobile = false }) => {
  const position = getCurrentTimePosition(currentTime || new Date(), isMobile)

  if (position === null) {
    return null
  }

  return (
    <div
      className="absolute left-0 right-0 z-10 pointer-events-none"
      style={{
        top: `${position}px`,
      }}
    >
      <div className={AGENDA_CONFIG.CURRENT_TIME_LINE_CLASS} />
      <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-purple-600" />
    </div>
  )
}

