"use client"

import { useClinic } from "@/contexts/clinic-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ClinicSelector() {
  const { activeClinic, setActiveClinic, clinics } = useClinic()

  // Modificar la función handleClinicChange para asegurarnos de que se actualiza correctamente
  const handleClinicChange = (clinicId: string) => {
    const selectedClinic = clinics.find((clinic) => clinic.id.toString() === clinicId)
    if (selectedClinic) {
      setActiveClinic(selectedClinic)
      console.log("Clínica cambiada a:", selectedClinic.name) // Para depuración
    }
  }

  return (
    <Select value={activeClinic.id.toString()} onValueChange={handleClinicChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Seleccionar clínica" />
      </SelectTrigger>
      <SelectContent>
        {clinics.map((clinic) => (
          <SelectItem key={clinic.id} value={clinic.id.toString()}>
            {clinic.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

