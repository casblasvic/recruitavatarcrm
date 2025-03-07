"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SearchInput } from "@/components/SearchInput"
import { Button } from "@/components/ui/button"
import { Trash2, Search } from "lucide-react"

interface Equipment {
  id: number
  code: string
  name: string
  description: string
}

export default function EquipmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: 1, code: "BALLA", name: "Ballancer", description: "Pressotherapie" },
    { id: 2, code: "EVRL", name: "Evrl", description: "EVRL" },
    { id: 3, code: "FORTE", name: "Forte Gem", description: "Forte Gem" },
    { id: 4, code: "JFL", name: "JETPEEL", description: "JETPEEL" },
  ])

  const filteredEquipment = equipment.filter((item) =>
    Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const deleteEquipment = (id: number) => {
    setEquipment((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex flex-col gap-2 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Equipamiento</h1>
        <p className="text-sm text-muted-foreground">Listado del equipamiento de la clínica</p>
      </div>

      <div className="p-6 pt-0">
        <div className="relative mb-6">
          <SearchInput
            placeholder="Buscar equipamiento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteEquipment(item.id)}>
                      <Trash2 className="h-4 w-4 text-primary" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => router.push(`/configuracion/clinicas/${params.id}/equipamiento/${item.id}`)}
                    >
                      <Search className="h-4 w-4 text-primary" />
                      <span className="sr-only">Ver</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

