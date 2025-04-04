"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DatosClinicaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="relative min-h-screen">
      {children}

      <div className="fixed bottom-6 right-6 flex items-center gap-2">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <Button>Guardar</Button>

        <Button variant="outline" className="bg-black text-white hover:bg-gray-800">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

