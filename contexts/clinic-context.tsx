"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { type WeekSchedule, DEFAULT_SCHEDULE } from "@/types/schedule"

interface Cabin {
  id: number
  code: string
  name: string
  color: string
  isActive: boolean
  order: number
}

interface ClinicConfig {
  openTime: string
  closeTime: string
  weekendOpenTime: string
  weekendCloseTime: string
  cabins: Cabin[]
  saturdayOpen: boolean
  sundayOpen: boolean
  schedule: WeekSchedule
}

interface Clinic {
  id: number
  prefix: string
  name: string
  city: string
  config: ClinicConfig
}

interface ClinicContextType {
  activeClinic: Clinic
  setActiveClinic: (clinic: Clinic) => void
  clinics: Clinic[]
  setClinics: (clinics: Clinic[]) => void
  updateClinicConfig: (clinicId: number, newConfig: Partial<ClinicConfig>) => void
}

const defaultClinics: Clinic[] = [
  {
    id: 1,
    prefix: "000001",
    name: "Californie Multilaser - Organicare",
    city: "Casablanca",
    config: {
      openTime: "10:00",
      closeTime: "19:30",
      weekendOpenTime: "10:00",
      weekendCloseTime: "15:00",
      saturdayOpen: true, // Make sure this is properly set
      sundayOpen: false,
      cabins: [
        { id: 1, code: "Con", name: "Consultation", color: "#f00", isActive: true, order: 1 },
        { id: 2, code: "Con", name: "Consultation2", color: "#0f0", isActive: true, order: 2 },
        { id: 3, code: "Lun", name: "Lunula", color: "#00f", isActive: true, order: 3 },
        { id: 4, code: "For", name: "Forte/Bal", color: "#f00", isActive: true, order: 4 },
        { id: 5, code: "Ski", name: "SkinShape", color: "#f00", isActive: false, order: 5 },
        { id: 6, code: "WB", name: "Won/Bal", color: "#f00", isActive: true, order: 6 },
        { id: 7, code: "Ver", name: "Verju/Bal", color: "#f00", isActive: true, order: 7 },
        { id: 8, code: "WB", name: "Won/Bal", color: "#f00", isActive: false, order: 8 },
        { id: 9, code: "Eme", name: "Emerald", color: "#f00", isActive: true, order: 9 },
      ],
      schedule: DEFAULT_SCHEDULE,
    },
  },
  {
    id: 2,
    prefix: "Cafc",
    name: "Cafc Multilaser",
    city: "Casablanca",
    config: {
      openTime: "09:00",
      closeTime: "18:00",
      weekendOpenTime: "09:00",
      weekendCloseTime: "14:00",
      saturdayOpen: true,
      sundayOpen: false,
      cabins: [
        { id: 1, code: "Con", name: "Consultation", color: "#00f", isActive: true, order: 1 },
        { id: 2, code: "Tre", name: "Treatment", color: "#0f0", isActive: true, order: 2 },
      ],
      schedule: DEFAULT_SCHEDULE,
    },
  },
  {
    id: 3,
    prefix: "TEST",
    name: "CENTRO TEST",
    city: "Casablanca",
    config: {
      openTime: "08:00",
      closeTime: "20:00",
      weekendOpenTime: "10:00",
      weekendCloseTime: "16:00",
      saturdayOpen: true,
      sundayOpen: false,
      cabins: [{ id: 1, code: "Tes", name: "Test Cabin", color: "#f0f", isActive: true, order: 1 }],
      schedule: DEFAULT_SCHEDULE,
    },
  },
]

const ClinicContext = createContext<ClinicContextType | undefined>(undefined)

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [activeClinic, setActiveClinic] = useState<Clinic>(() => {
    if (typeof window !== "undefined") {
      const savedClinic = localStorage.getItem("activeClinic")
      if (savedClinic) {
        try {
          return JSON.parse(savedClinic)
        } catch (e) {
          console.error("Error parsing saved clinic", e)
        }
      }
    }
    return defaultClinics[0]
  })
  const [clinics, setClinics] = useState<Clinic[]>(defaultClinics)

  const updateClinicConfig = (clinicId: number, newConfig: Partial<ClinicConfig>) => {
    setClinics((prevClinics) =>
      prevClinics.map((clinic) =>
        clinic.id === clinicId
          ? {
              ...clinic,
              config: { ...clinic.config, ...newConfig },
            }
          : clinic,
      ),
    )

    // If we're updating the active clinic, update that too
    if (activeClinic.id === clinicId) {
      setActiveClinic((prev) => ({
        ...prev,
        config: { ...prev.config, ...newConfig },
      }))

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "activeClinic",
          JSON.stringify({
            ...activeClinic,
            config: { ...activeClinic.config, ...newConfig },
          }),
        )
      }
    }
  }

  const handleSetActiveClinic = (clinic: Clinic) => {
    setActiveClinic(clinic)
    if (typeof window !== "undefined") {
      localStorage.setItem("activeClinic", JSON.stringify(clinic))
    }
  }

  return (
    <ClinicContext.Provider
      value={{
        activeClinic,
        setActiveClinic: handleSetActiveClinic,
        clinics,
        setClinics,
        updateClinicConfig,
      }}
    >
      {children}
    </ClinicContext.Provider>
  )
}

export function useClinic() {
  const context = useContext(ClinicContext)
  if (context === undefined) {
    throw new Error("useClinic must be used within a ClinicProvider")
  }
  return context
}

