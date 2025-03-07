"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { BackButton } from "@/components/ui/button"

export default function ClientePage({ params }: { params: { id: string } }) {
  const [date, setDate] = useState<Date>()

  const form = useForm({
    defaultValues: {
      birthDate: new Date("1980-02-05"),
    },
  })

  return (
    <div className="space-y-6">
      {/* Client Info Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="clientNumber">Nº Cliente</Label>
          <Input id="clientNumber" value="6557" readOnly className="bg-gray-50" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="clinic">Clínica</Label>
          <Input id="clinic" value="000001 - Californie Multilaser - Organicare" readOnly className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="registrationDate">Fecha alta</Label>
          <Input id="registrationDate" value="02/03/2021" readOnly className="bg-gray-50" />
        </div>
      </div>

      <div>
        <Label htmlFor="lifecycle">Etapa del ciclo de vida</Label>
        <Input id="lifecycle" value="Contacto" readOnly className="bg-gray-50" />
      </div>

      {/* Personal Data Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            👤
          </span>
          Datos personales
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" defaultValue="Lina" />
          </div>
          <div>
            <Label htmlFor="firstSurname">Primer apellido</Label>
            <Input id="firstSurname" defaultValue="Sadaoui" />
          </div>
          <div>
            <Label htmlFor="secondSurname">Segundo apellido</Label>
            <Input id="secondSurname" defaultValue="Sadaoui" />
          </div>
          <div>
            <Label htmlFor="birthDate">Fecha nacimiento</Label>
            <Controller
              name="birthDate"
              control={form.control}
              defaultValue={new Date("1980-02-05")}
              render={({ field }) => (
                <CustomDatePicker
                  {...field}
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>
          <div>
            <Label htmlFor="documentType">Tipo de documento</Label>
            <Select defaultValue="dni">
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dni">DNI</SelectItem>
                <SelectItem value="passport">Pasaporte</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="documentNumber">Número de documento</Label>
            <Input id="documentNumber" />
          </div>
          <div>
            <Label htmlFor="gender">Sexo</Label>
            <Select defaultValue="mujer">
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mujer">Mujer</SelectItem>
                <SelectItem value="hombre">Hombre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="notes">Notas</Label>
          <Textarea id="notes" className="min-h-[100px]" />
        </div>
      </div>

      {/* Contact Data Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            📍
          </span>
          Datos de contacto
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" defaultValue="Linasadaoui@gmail.com" />
            <Button size="icon" variant="ghost" className="absolute right-2 top-7">
              ✉️
            </Button>
          </div>
          <div>
            <Label htmlFor="phone1">Teléfono 1</Label>
            <Input id="phone1" defaultValue="+212622742529" />
          </div>
          <div>
            <Label htmlFor="phone2">Teléfono 2</Label>
            <Input id="phone2" />
          </div>
          <div>
            <Label htmlFor="phone3">Teléfono 3</Label>
            <Input id="phone3" />
          </div>
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" />
          </div>
          <div>
            <Label htmlFor="city">Localidad</Label>
            <Input id="city" />
          </div>
          <div>
            <Label htmlFor="country">País</Label>
            <Select defaultValue="maroc">
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maroc">Maroc</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="province">Provincia</Label>
            <Input id="province" defaultValue="CASABLANCA" />
          </div>
          <div>
            <Label htmlFor="postalCode">CP</Label>
            <Input id="postalCode" />
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">⚙️</span>
          Configuración
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="vipClient" />
            <label
              htmlFor="vipClient"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Cliente VIP
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="privacyPolicy" defaultChecked />
            <label
              htmlFor="privacyPolicy"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Política de Privacidad
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="commercialComm" defaultChecked />
            <label
              htmlFor="commercialComm"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Acepto recibir comunicaciones comerciales
            </label>
            <Button variant="link" className="text-purple-600 px-1">
              Ver historial de cambios
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="preventAppAppts" />
            <label
              htmlFor="preventAppAppts"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Impedir citas desde la App
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-2 z-50">
        <BackButton className="flex-1 md:flex-none">Volver</BackButton>
        <Button variant="outline" className="flex-1 md:flex-none text-red-600 hover:text-red-600">
          Eliminar
        </Button>
        <Button className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700">Guardar</Button>
        <Button variant="outline" className="hidden md:inline-flex rounded-full bg-black text-white hover:bg-gray-800">
          Ayuda
        </Button>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed buttons */}
      <div className="h-32 md:h-20"></div>
    </div>
  )
}

