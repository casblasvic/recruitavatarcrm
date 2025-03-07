"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { menuItems, type MenuItem } from "@/config/menu-structure"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useClinic } from "@/contexts/clinic-context"

interface MobileDrawerMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileDrawerMenu({ isOpen, onClose }: MobileDrawerMenuProps) {
  const router = useRouter()
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { activeClinic, setActiveClinic, clinics } = useClinic()

  const handleNavigation = (href: string) => {
    router.push(href)
    onClose()
  }

  const handleSubmenu = (item: MenuItem) => {
    if (item.submenu) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id)
    } else {
      handleNavigation(item.href)
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      onClose()
      setActiveSubmenu(null)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        onClose()
        setActiveSubmenu(null)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("resize", handleResize)
    }
  }, [isOpen, onClose])

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const Icon = item.icon
    return (
      <div key={item.id}>
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 mb-2 h-12 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 ${
            depth > 0 ? "pl-8" : ""
          }`}
          onClick={() => handleSubmenu(item)}
        >
          <Icon className="h-4 w-4 text-purple-600" />
          {item.label}
          {item.submenu && (
            <ChevronRight className={`ml-auto h-4 w-4 ${activeSubmenu === item.id ? "rotate-90" : ""}`} />
          )}
        </Button>
        {item.submenu && activeSubmenu === item.id && (
          <div className="ml-4">{item.submenu.map((subItem) => renderMenuItem(subItem, depth + 1))}</div>
        )}
      </div>
    )
  }

  const handleClinicChange = (clinicId: string) => {
    const selectedClinic = clinics.find((clinic) => clinic.id.toString() === clinicId)
    if (selectedClinic) {
      setActiveClinic(selectedClinic)
      console.log("Clínica cambiada en móvil a:", selectedClinic.name) // Para depuración
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            ref={menuRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed top-[64px] left-0 h-[calc(100vh-64px-64px)] w-4/5 max-w-xs bg-white z-50 flex flex-col"
          >
            <nav className="flex-1 p-4 overflow-y-auto max-h-full">
              <div className="mb-4">
                <Select onValueChange={handleClinicChange} value={activeClinic.id.toString()}>
                  <SelectTrigger className="w-full">
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
              </div>
              {menuItems.map((item) => renderMenuItem(item))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

