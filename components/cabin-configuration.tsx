"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Trash2, Search } from "lucide-react"
import { CabinEditDialog } from "./cabin-edit-dialog"

interface Cabin {
  id: number
  code: string
  name: string
  color: string
  isActive: boolean
  order: number
}

interface CabinConfigurationProps {
  cabins: Cabin[]
  updateCabin: (cabin: Cabin) => void
  deleteCabin: (cabinId: number) => void
}

export default function CabinConfiguration({ cabins, updateCabin, deleteCabin }: CabinConfigurationProps) {
  const [isCabinDialogOpen, setIsCabinDialogOpen] = useState(false)
  const [editingCabin, setEditingCabin] = useState<Cabin | null>(null)
  const [filterText, setFilterText] = useState("")

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value)
  }

  const filteredCabins = cabins.filter(
    (cabin) =>
      cabin.name.toLowerCase().includes(filterText.toLowerCase()) ||
      cabin.code.toLowerCase().includes(filterText.toLowerCase()),
  )

  const moveCabin = (index: number, direction: "up" | "down") => {
    const newCabins = [...cabins].sort((a, b) => a.order - b.order)
    if (direction === "up" && index > 0) {
      const temp = newCabins[index].order
      newCabins[index].order = newCabins[index - 1].order
      newCabins[index - 1].order = temp
    } else if (direction === "down" && index < newCabins.length - 1) {
      const temp = newCabins[index].order
      newCabins[index].order = newCabins[index + 1].order
      newCabins[index + 1].order = temp
    }
    setCabins(newCabins)
  }

  const handleSaveCabin = (cabin: Cabin) => {
    if (cabin.id === 0) {
      const newId = Math.max(...cabins.map((c) => c.id)) + 1
      updateCabin({ ...cabin, id: newId, order: newId })
    } else {
      updateCabin(cabin)
    }
    setIsCabinDialogOpen(false)
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Configuración de cabinas</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Buscar cabinas" className="pl-10" value={filterText} onChange={handleFilterChange} />
        </div>

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
              {filteredCabins
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
                          updateCabin({ ...cabin, isActive: checked as boolean })
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 text-purple-600 hover:bg-purple-100"
                        onClick={() => moveCabin(index, "up")}
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
                        onClick={() => moveCabin(index, "down")}
                        disabled={index === filteredCabins.length - 1}
                      >
                        <ChevronDown className="h-6 w-6 font-bold" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 text-purple-600 hover:bg-purple-100"
                        onClick={() => deleteCabin(cabin.id)}
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

      <CabinEditDialog
        isOpen={isCabinDialogOpen}
        onClose={() => setIsCabinDialogOpen(false)}
        cabin={editingCabin}
        onSave={handleSaveCabin}
      />
    </Card>
  )
}

