"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button, BackButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CabinEditDialog } from "@/components/cabin-edit-dialog"
import { useClinic } from "@/contexts/clinic-context"
import { SearchInput } from "@/components/SearchInput"
import { ScheduleConfig } from "@/components/schedule-config"
import { DEFAULT_SCHEDULE } from "@/types/schedule"
import { useTemplates } from "@/hooks/use-templates"
import { toast } from "@/components/ui/use-toast"
import {
  Building2,
  Bed,
  Cog,
  Users,
  CreditCard,
  Link,
  Percent,
  MessageSquare,
  Mail,
  Phone,
  Globe,
  ArrowLeft,
  HelpCircle,
  Save,
  MapPin,
  BarChart2,
  Search,
  Plus,
  ChevronUp,
  ChevronDown,
  Trash2,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { WeekSchedule } from "@/types/schedule"

const menuItems = [
  { id: "datos", label: "Datos de la clínica", icon: Building2 },
  { id: "cabinas", label: "Cabinas", icon: Bed },
  { id: "equipamiento", label: "Equipamiento", icon: Cog },
  { id: "usuarios", label: "Usuarios", icon: Users },
  { id: "entidades", label: "Entidades bancarias", icon: CreditCard },
  { id: "integraciones", label: "Integraciones", icon: Link },
  { id: "descuentos", label: "Descuentos", icon: Percent },
  { id: "sms", label: "SMS/Push", icon: MessageSquare },
  { id: "email", label: "Notificaciones e-mail", icon: Mail },
  { id: "whatsapp", label: "Notificaciones WhatsApp", icon: Phone },
  { id: "otros", label: "Otros APIs", icon: Globe },
]

interface Cabin {
  id: number
  code: string
  name: string
  color: string
  isActive: boolean
  order: number
}

const SectionTitle = ({ icon: Icon, title, color }: { icon: any; title: string; color: string }) => (
  <div className={`flex items-center space-x-2 mb-4 pb-2 border-b ${color}`}>
    <Icon className="h-5 w-5" />
    <h3 className={`text-lg font-medium ${color}`}>{title}</h3>
  </div>
)

export default function ClinicaDetailPage({ params }: { params: { id: string } }) {
  const { clinics, updateClinicConfig } = useClinic()
  const { templates } = useTemplates()
  const [activeTab, setActiveTab] = useState("datos")
  const [isCabinDialogOpen, setIsCabinDialogOpen] = useState(false)
  const [editingCabin, setEditingCabin] = useState<Cabin | null>(null)
  const [clinicData, setClinicData] = useState<typeof clinic | null>(null)
  const [cabinFilterText, setCabinFilterText] = useState("")
  const [equipmentFilterText, setEquipmentFilterText] = useState("")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [equipmentData, setEquipmentData] = useState([
    { code: "BALLA", name: "Ballancer", description: "Pressotherapie" },
    { code: "Balla", name: "Ballancer", description: "Pressotherapie" },
    { code: "Balla", name: "Ballancer", description: "Pressotherapie" },
    { code: "BALLA", name: "Ballancer", description: "Pressotherapie" },
    { code: "EVRL", name: "Evrl", description: "EVRL" },
    { code: "FORTE", name: "Forte Gem", description: "Forte Gem" },
    { code: "JFL", name: "JETPEEL", description: "JETPEEL" },
    { code: "LUNUL", name: "Lunula Laser", description: "Lunula Laser" },
    { code: "MICRO", name: "MicroMotor", description: "MicroMotor" },
    { code: "sknr", name: "skinshape r", description: "Skinshape Radiofrequence" },
    { code: "SKNS", name: "Skinshape R", description: "Skinshape Radiofrequence" },
    { code: "VERJU", name: "VERJU LASER", description: "VERJU LASER" },
    { code: "VERJU", name: "VERJU LASER", description: "Pressotherapie" },
    { code: "WOND", name: "Wonder", description: "Electro Stimulation" },
    { code: "WOND", name: "Wonder", description: "Electro Stimulation" },
  ])
  const [scheduleConfigMode, setScheduleConfigMode] = useState<"standard" | "advanced">("standard")
  const [advancedSchedule, setAdvancedSchedule] = useState<WeekSchedule>(DEFAULT_SCHEDULE)
  const [isSaving, setIsSaving] = useState(false)

  const router = useRouter()

  const clinic = clinics.find((c) => c.id.toString() === params.id)

  useEffect(() => {
    if (!clinic) {
      router.push("/configuracion/clinicas")
    } else {
      setClinicData(clinic)
    }
  }, [clinic, router])

  const handleAdvancedScheduleChange = (newSchedule: WeekSchedule) => {
    setAdvancedSchedule(newSchedule)
    handleClinicUpdate({ schedule: newSchedule })
  }

  const handleClinicUpdate = useCallback(
    (newConfig: any) => {
      if (clinicData) {
        const updatedConfig = { ...newConfig }

        if (scheduleConfigMode === "advanced" && newConfig.schedule) {
          updatedConfig.schedule = newConfig.schedule
        } else if (scheduleConfigMode === "standard") {
          // Lógica para la configuración estándar (sin cambios)
        }

        setClinicData((prev) => (prev ? { ...prev, config: { ...prev.config, ...updatedConfig } } : null))
      }
    },
    [clinicData, scheduleConfigMode],
  )

  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = templates.find((t) => t.id === templateId)
    if (selectedTemplate) {
      setAdvancedSchedule(selectedTemplate.schedule)
      setSelectedTemplateId(templateId)
      handleClinicUpdate({ schedule: selectedTemplate.schedule })
    }
  }

  const handleSaveCabin = useCallback(
    (cabin: Cabin) => {
      const updatedCabins = clinicData?.config?.cabins?.map((c) => (c.id === cabin.id ? cabin : c)) || []
      if (cabin.id === 0) {
        updatedCabins.push({
          ...cabin,
          id: Math.max(...updatedCabins.map((c) => c.id), 0) + 1,
          order: (clinicData?.config?.cabins?.length || 0) + 1,
        })
      }
      handleClinicUpdate({ cabins: updatedCabins })
      setIsCabinDialogOpen(false)
    },
    [clinicData?.config?.cabins, handleClinicUpdate],
  )

  const handleDeleteCabin = useCallback(
    (cabinId: number) => {
      const updatedCabins = clinicData?.config?.cabins?.filter((c) => c.id !== cabinId) || []
      handleClinicUpdate({ cabins: updatedCabins })
    },
    [clinicData?.config?.cabins, handleClinicUpdate],
  )

  const handleMoveCabin = useCallback(
    (cabinId: number, direction: "up" | "down") => {
      const updatedCabins = [...(clinicData?.config?.cabins || [])].sort((a, b) => a.order - b.order)
      const cabinIndex = updatedCabins.findIndex((c) => c.id === cabinId)

      if ((direction === "up" && cabinIndex > 0) || (direction === "down" && cabinIndex < updatedCabins.length - 1)) {
        const swapIndex = direction === "up" ? cabinIndex - 1 : cabinIndex + 1
        const temp = updatedCabins[cabinIndex].order
        updatedCabins[cabinIndex].order = updatedCabins[swapIndex].order
        updatedCabins[swapIndex].order = temp

        handleClinicUpdate({ cabins: updatedCabins })
      }
    },
    [clinicData?.config?.cabins, handleClinicUpdate],
  )

  const deleteEquipment = useCallback((index: number) => {
    setEquipmentData((prevData) => prevData.filter((_, i) => i !== index))
  }, [])

  const filteredEquipment = equipmentData.filter((equipment) =>
    Object.values(equipment).some((value) => String(value).toLowerCase().includes(equipmentFilterText.toLowerCase())),
  )

  const handleSaveClinic = useCallback(async () => {
    setIsSaving(true)
    try {
      // Aquí simularemos el guardado en un archivo
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simula una operación asíncrona

      // En un escenario real, aquí guardaríamos en la base de datos o en un archivo
      console.log("Guardando configuración:", clinicData)

      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido guardados exitosamente.",
      })
    } catch (error) {
      console.error("Error al guardar:", error)
      toast({
        title: "Error al guardar",
        description: "Hubo un problema al guardar la configuración.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }, [clinicData])

  if (!clinicData) {
    return null
  }

  const { config } = clinicData

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="hidden md:flex w-64 flex-shrink-0 bg-gray-100 overflow-y-auto pt-16">
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-3",
                  activeTab === item.id
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-purple-600",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="md:hidden fixed top-16 left-0 right-0 bg-white z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full h-12 overflow-x-auto">
            {menuItems.map((item) => (
              <TabsTrigger key={item.id} value={item.id} className="px-4 py-2 text-sm">
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-auto pt-28 md:pt-16 pb-24">
        <div className="container mx-auto p-6 space-y-6 max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6">{menuItems.find((item) => item.id === activeTab)?.label}</h2>

          {activeTab === "datos" && (
            <Card className="p-6">
              <SectionTitle icon={Building2} title="Información Básica" color="text-blue-600 border-blue-600" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prefix" className="text-sm">
                    Prefijo
                  </Label>
                  <Input
                    id="prefix"
                    defaultValue={config.prefix}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ prefix: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commercialName" className="text-sm">
                    Nombre Comercial
                  </Label>
                  <Input
                    id="commercialName"
                    defaultValue={config.commercialName}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ commercialName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm">
                    Razón Social
                  </Label>
                  <Input
                    id="businessName"
                    defaultValue={config.businessName}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ businessName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cif" className="text-sm">
                    CIF
                  </Label>
                  <Input
                    id="cif"
                    defaultValue={config.cif}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ cif: e.target.value })}
                  />
                </div>
              </div>

              <SectionTitle icon={MapPin} title="Ubicación" color="text-green-600 border-green-600" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm">
                    País
                  </Label>
                  <Select
                    defaultValue={config.country}
                    onValueChange={(value) => handleClinicUpdate({ country: value })}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marruecos">Marruecos</SelectItem>
                      <SelectItem value="España">España</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-sm">
                    Provincia
                  </Label>
                  <Input
                    id="province"
                    defaultValue={config.province}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ province: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm">
                    Ciudad
                  </Label>
                  <Input
                    id="city"
                    defaultValue={config.city}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm">
                    CP
                  </Label>
                  <Input
                    id="postalCode"
                    defaultValue={config.postalCode}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ postalCode: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-sm">
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    defaultValue={config.address}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ address: e.target.value })}
                  />
                </div>
              </div>

              <SectionTitle icon={Phone} title="Contacto" color="text-orange-600 border-orange-600" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    defaultValue={config.phone}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone2" className="text-sm">
                    Teléfono 2
                  </Label>
                  <Input
                    id="phone2"
                    defaultValue={config.phone2}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ phone2: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-sm">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={config.email}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ email: e.target.value })}
                  />
                </div>
              </div>

              <SectionTitle icon={Cog} title="Configuración" color="text-purple-600 border-purple-600" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Caja inicial</Label>
                  <Input
                    type="number"
                    step="0.01"
                    defaultValue={config.initialCash}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ initialCash: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Tamaño impresión ticket</Label>
                  <Select
                    defaultValue={config.ticketSize}
                    onValueChange={(value) => handleClinicUpdate({ ticketSize: value })}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Seleccionar tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a5">Hoja A5</SelectItem>
                      <SelectItem value="a4">Hoja A4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Tarifa</Label>
                  <Select defaultValue={config.rate} onValueChange={(value) => handleClinicUpdate({ rate: value })}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Seleccionar tarifa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tarifa Californie">Tarifa Californie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">IP</Label>
                  <Input
                    defaultValue={config.ip}
                    className="h-9 text-sm"
                    onChange={(e) => handleClinicUpdate({ ip: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">¿Desea bloquear el área de firma electrónica en flowww.me?</Label>
                    <RadioGroup
                      defaultValue={config.blockSignArea}
                      onValueChange={(value) => handleClinicUpdate({ blockSignArea: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="sign-no" />
                        <Label htmlFor="sign-no" className="text-sm">
                          No
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="sign-yes" />
                        <Label htmlFor="sign-yes" className="text-sm">
                          Sí, con la clave
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">¿Desea bloquear las áreas de datos personales en flowww.me?</Label>
                    <RadioGroup
                      defaultValue={config.blockPersonalData}
                      onValueChange={(value) => handleClinicUpdate({ blockPersonalData: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="personal-no" />
                        <Label htmlFor="personal-no" className="text-sm">
                          No
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="personal-yes" />
                        <Label htmlFor="personal-yes" className="text-sm">
                          Sí, con la clave
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Funcionalidades</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="delayed-payments"
                        defaultChecked={config.delayedPayments}
                        onCheckedChange={(checked) => handleClinicUpdate({ delayedPayments: checked })}
                      />
                      <Label htmlFor="delayed-payments" className="text-sm">
                        Pagos aplazados
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="affects-stats"
                        defaultChecked={config.affectsStats}
                        onCheckedChange={(checked) => handleClinicUpdate({ affectsStats: checked })}
                      />
                      <Label htmlFor="affects-stats" className="text-sm">
                        Afecta estadísticas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="appears-in-app"
                        defaultChecked={config.appearsInApp}
                        onCheckedChange={(checked) => handleClinicUpdate({ appearsInApp: checked })}
                      />
                      <Label htmlFor="appears-in-app" className="text-sm">
                        Aparece en App / Self
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="schedule-control"
                        defaultChecked={config.scheduleControl}
                        onCheckedChange={(checked) => handleClinicUpdate({ scheduleControl: checked })}
                      />
                      <Label htmlFor="schedule-control" className="text-sm">
                        Control de horarios
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="professional-skills"
                        defaultChecked={config.professionalSkills}
                        onCheckedChange={(checked) => handleClinicUpdate({ professionalSkills: checked })}
                      />
                      <Label htmlFor="professional-skills" className="text-sm">
                        Control de habilidades profesionales
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm">
                    Notas
                  </Label>
                  <Textarea
                    id="notes"
                    defaultValue={config.notes}
                    className="h-20 text-sm"
                    onChange={(e) => handleClinicUpdate({ notes: e.target.value })}
                  />
                </div>
              </div>

              <SectionTitle icon={Clock} title="Horarios" color="text-purple-600 border-purple-600" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Modo de configuración</Label>
                  <Select
                    value={scheduleConfigMode}
                    onValueChange={(value: "standard" | "advanced") => setScheduleConfigMode(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar modo de configuración" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Configuración Estándar</SelectItem>
                      <SelectItem value="advanced">Configuración Avanzada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {scheduleConfigMode === "standard" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Hora apertura</Label>
                        <Input
                          type="time"
                          value={config.openTime}
                          onChange={(e) => handleClinicUpdate({ openTime: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hora cierre</Label>
                        <Input
                          type="time"
                          value={config.closeTime}
                          onChange={(e) => handleClinicUpdate({ closeTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Apertura fines de semana</Label>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="saturday"
                            checked={config.saturdayOpen}
                            onCheckedChange={(checked) => handleClinicUpdate({ saturdayOpen: checked })}
                          />
                          <Label htmlFor="saturday">Sábados</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sunday"
                            checked={config.sundayOpen}
                            onCheckedChange={(checked) => handleClinicUpdate({ sundayOpen: checked })}
                          />
                          <Label htmlFor="sunday">Domingos</Label>
                        </div>
                      </div>
                    </div>
                    {(config.saturdayOpen || config.sundayOpen) && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Hora apertura fines de semana</Label>
                          <Input
                            type="time"
                            value={config.weekendOpenTime}
                            onChange={(e) => handleClinicUpdate({ weekendOpenTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Hora cierre fines de semana</Label>
                          <Input
                            type="time"
                            value={config.weekendCloseTime}
                            onChange={(e) => handleClinicUpdate({ weekendCloseTime: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Seleccionar plantilla horaria</Label>
                      <Select value={selectedTemplateId || ""} onValueChange={handleTemplateChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar una plantilla" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Card>
                      <CardContent className="pt-6">
                        <ScheduleConfig
                          value={clinicData?.config?.schedule || DEFAULT_SCHEDULE}
                          onChange={handleAdvancedScheduleChange}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              <SectionTitle icon={BarChart2} title="Estadísticas de uso" color="text-red-600 border-red-600" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Espacio de almacenamiento</Label>
                  <div className="text-sm text-gray-600">100 Mb (0 Mb libres)</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Nº de cuenta domiciliaciones clientes</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <Input placeholder="PCC" className="h-9 text-sm" />
                    <Input placeholder="Entidad" className="h-9 text-sm" />
                    <Input placeholder="Oficina" className="h-9 text-sm" />
                    <Input placeholder="D.C." className="h-9 text-sm" />
                  </div>
                  <Input placeholder="Cuenta" className="h-9 text-sm" />
                  <Input placeholder="BIC/SWIFT" className="h-9 text-sm" />
                </div>
              </div>
            </Card>
          )}

          {activeTab === "cabinas" && (
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Listado de cabinas de la clínica: {clinicData.name}</h2>

                <SearchInput placeholder="Buscar cabinas" value={cabinFilterText} onChange={setCabinFilterText} />

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Nº</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead className="text-center">Activo</TableHead>
                        <TableHead className="text-center">Subir</TableHead>
                        <TableHead className="text-center">Bajar</TableHead>
                        <TableHead className="text-center">Borrar</TableHead>
                        <TableHead className="text-center">Ver +</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinicData?.config?.cabins
                        .filter(
                          (cabin) =>
                            cabin.name.toLowerCase().includes(cabinFilterText.toLowerCase()) ||
                            cabin.code.toLowerCase().includes(cabinFilterText.toLowerCase()),
                        )
                        .sort((a, b) => a.order - b.order)
                        .map((cabin, index) => (
                          <TableRow key={cabin.id} className={cabin.isActive ? "" : "opacity-50"}>
                            <TableCell>{cabin.order}</TableCell>
                            <TableCell>{cabin.code}</TableCell>
                            <TableCell>{cabin.name}</TableCell>
                            <TableCell>
                              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: cabin.color }}></div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={cabin.isActive}
                                onCheckedChange={(checked) => {
                                  const updatedCabins = clinicData?.config?.cabins.map((c) =>
                                    c.id === cabin.id ? { ...c, isActive: checked as boolean } : c,
                                  )
                                  handleClinicUpdate({ cabins: updatedCabins })
                                }}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 text-purple-600 hover:bg-purple-100"
                                onClick={() => handleMoveCabin(cabin.id, "up")}
                                disabled={index === 0}
                              >
                                <ChevronUp className="h-6 w-6 font-bold" />
                              </Button>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 text-purple-600 hover:bg-purple-100"
                                onClick={() => handleMoveCabin(cabin.id, "down")}
                                disabled={index === clinicData?.config?.cabins.length - 1}
                              >
                                <ChevronDown className="h-6 w-6 font-bold" />
                              </Button>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 text-purple-600 hover:bg-purple-100"
                                onClick={() => handleDeleteCabin(cabin.id)}
                              >
                                <Trash2 className="h-6 w-6 font-bold" />
                              </Button>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 text-purple-600 hover:bg-purple-100"
                                onClick={() => {
                                  setEditingCabin(cabin)
                                  setIsCabinDialogOpen(true)
                                }}
                              >
                                <Search className="h-6 w-6 font-bold" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "equipamiento" && (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium">Listado del equipamiento de la clínica: {clinicData.name}</h2>
                </div>

                <SearchInput
                  placeholder="Buscar equipamiento"
                  value={equipmentFilterText}
                  onChange={setEquipmentFilterText}
                />

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Código</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="w-[100px] text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEquipment.map((equipment, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{equipment.code}</TableCell>
                          <TableCell>{equipment.name}</TableCell>
                          <TableCell>{equipment.description}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => deleteEquipment(index)}
                            >
                              <Trash2 className="h-4 w-4 text-primary" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                router.push(`/configuracion/clinicas/${params.id}/equipamiento/${equipment.code}`)
                              }
                            >
                              <Search className="h-4 w-4 text-primary" />
                              <span className="sr-only">Ver/Editar</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "usuarios" && (
            <Card className="p-6">
              <h3>Contenido de Usuarios</h3>
            </Card>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex items-center space-x-2 z-50">
        <BackButton className="bg-white text-gray-600 hover:bg-gray-100 text-sm py-2 px-4 rounded-md shadow-md">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </BackButton>
        {activeTab === "cabinas" && (
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-md shadow-md"
            onClick={() => {
              setEditingCabin({
                id: 0,
                code: "",
                name: "",
                color: "#ffffff",
                isActive: true,
                order: (clinicData?.config?.cabins?.length || 0) + 1,
              })
              setIsCabinDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva cabina
          </Button>
        )}
        {activeTab === "equipamiento" && (
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-md shadow-md"
            onClick={() => {
              router.push(`/configuracion/clinicas/${params.id}/equipamiento/nuevo`)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo equipamiento
          </Button>
        )}
        {activeTab === "usuarios" && (
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-md shadow-md"
            onClick={() => {
              console.log("Crear nuevo usuario")
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        )}
        {activeTab === "entidades" && (
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-md shadow-md"
            onClick={() => {
              console.log("Crear nuevo banco")
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Banco
          </Button>
        )}
        {activeTab === "descuentos" && (
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-md shadow-md"
            onClick={() => {
              console.log("Crear nuevo descuento")
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Descuento
          </Button>
        )}
        {activeTab === "integraciones" && (
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-md shadow-md"
            onClick={() => {
              console.log("Crear nueva integración")
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Integración
          </Button>
        )}
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-md shadow-md"
          onClick={handleSaveClinic}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Centro
            </>
          )}
        </Button>
        <Button className="bg-black text-white hover:bg-gray-800 text-sm py-2 px-4 rounded-md shadow-md">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

      <CabinEditDialog
        isOpen={isCabinDialogOpen}
        onClose={() => setIsCabinDialogOpen(false)}
        cabin={editingCabin}
        onSave={handleSaveCabin}
      />
    </div>
  )
}

