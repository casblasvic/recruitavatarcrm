"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronRight, Search } from "lucide-react"
import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { menuItems, type MenuItem } from "@/config/menu-structure"
import { Input } from "@/components/ui/input"
import { useClinic } from "@/contexts/clinic-context"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean
  onToggle?: () => void
}

interface Clinic {
  id: number
  prefix: string
  name: string
  city: string
}

const useMenuState = () => {
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set())

  const toggleMenu = useCallback((menuId: string) => {
    setOpenMenus((prev) => {
      const next = new Set(prev)
      if (next.has(menuId)) {
        next.delete(menuId)
      } else {
        next.clear() // Cerrar todos los menús abiertos
        next.add(menuId)
      }
      return next
    })
  }, [])

  const closeAllMenus = useCallback(() => {
    setOpenMenus(new Set())
  }, [])

  return { openMenus, toggleMenu, closeAllMenus }
}

const MenuItemComponent = ({
  item,
  depth = 0,
  isCollapsed = false,
  openMenus,
  toggleMenu,
}: {
  item: MenuItem
  depth?: number
  isCollapsed?: boolean
  openMenus: Set<string>
  toggleMenu: (id: string) => void
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const hasSubmenu = item.submenu && item.submenu.length > 0
  const isActive = pathname === item.href
  const isOpen = openMenus.has(item.id)
  const [isHovered, setIsHovered] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasSubmenu) {
      toggleMenu(item.id)
    } else if (item.href) {
      router.push(item.href)
      toggleMenu("") // Close all menus when navigating
    }
  }

  useEffect(() => {
    if ((isOpen || (isHovered && isCollapsed)) && hasSubmenu && menuRef.current) {
      const updatePosition = () => {
        const menuRect = menuRef.current?.getBoundingClientRect()
        if (menuRect) {
          const submenu = menuRef.current?.querySelector(".submenu") as HTMLElement
          if (submenu) {
            submenu.style.position = "fixed"

            // Centrar el submenú verticalmente con respecto al elemento padre
            const subMenuHeight = submenu.offsetHeight
            const parentHeight = menuRect.height
            let topPosition = menuRect.top + parentHeight / 2 - subMenuHeight / 2

            // Ajustar si se sale por arriba o por abajo
            if (topPosition < 0) topPosition = 0
            if (topPosition + subMenuHeight > window.innerHeight) {
              topPosition = window.innerHeight - subMenuHeight
            }

            submenu.style.top = `${topPosition}px`
            submenu.style.left = `${menuRect.right}px`

            // Ajustar si se sale por la derecha
            const submenuRect = submenu.getBoundingClientRect()
            if (submenuRect.right > window.innerWidth) {
              submenu.style.left = `${menuRect.left - submenuRect.width}px`
            }

            // Asegurar que el submenú tenga scroll si es muy largo
            submenu.style.maxHeight = `${window.innerHeight}px`
            submenu.style.overflowY = "auto"
          }
        }
      }

      updatePosition()
      window.addEventListener("resize", updatePosition)
      return () => window.removeEventListener("resize", updatePosition)
    }
  }, [isOpen, isHovered, isCollapsed, hasSubmenu])

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          isActive && "bg-purple-50 text-purple-600",
          "hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200",
          depth > 0 && "pl-4",
          isCollapsed && "px-2",
        )}
        onClick={handleClick}
      >
        {item.icon && <item.icon className={cn("mr-2 h-4 w-4 text-purple-600", isCollapsed && "mr-0")} />}
        {(!isCollapsed || depth > 0) && <span className="flex-1 text-left">{item.label}</span>}
        {(!isCollapsed || depth > 0) && item.badge && (
          <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">{item.badge}</span>
        )}
        {(!isCollapsed || depth > 0) && hasSubmenu && (
          <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
        )}
      </Button>
      {hasSubmenu && (isOpen || (isHovered && isCollapsed)) && (
        <div
          className={cn(
            "submenu fixed left-full top-0 w-64 rounded-md border bg-white shadow-lg z-[9999]",
            isCollapsed ? "left-full" : "left-full",
          )}
        >
          {item.submenu!.map((subItem) => (
            <MenuItemComponent
              key={subItem.id}
              item={subItem}
              depth={depth + 1}
              isCollapsed={false}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const getClinicInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function MainSidebar({ className, isCollapsed, onToggle }: SidebarProps) {
  const { openMenus, toggleMenu, closeAllMenus } = useMenuState()
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)

  const { activeClinic, setActiveClinic, clinics } = useClinic()
  const [clinicSearchTerm, setClinicSearchTerm] = useState("")
  const [isClinicSelectorOpen, setIsClinicSelectorOpen] = useState(false)

  const handleClinicSelect = (clinic: Clinic) => {
    setActiveClinic(clinic)
    setIsClinicSelectorOpen(false)
    setClinicSearchTerm("")
  }

  const filteredClinics = useMemo(() => {
    return clinics.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(clinicSearchTerm.toLowerCase()) ||
        clinic.prefix.toLowerCase().includes(clinicSearchTerm.toLowerCase()),
    )
  }, [clinics, clinicSearchTerm])

  useEffect(() => {
    const handleMouseLeave = () => {
      closeAllMenus()
      setHoveredMenu(null)
    }

    document.getElementById("main-sidebar")?.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.getElementById("main-sidebar")?.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [closeAllMenus])

  return (
    <div
      id="main-sidebar"
      className={cn(
        "h-full flex flex-col border-r bg-white transition-all duration-300 overflow-y-auto relative",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex-1 py-4">
        <div className="px-3">
          <h2 className={cn("mb-2 text-xs font-semibold tracking-tight text-gray-500", isCollapsed && "sr-only")}>
            CENTRO
          </h2>
          <div className="relative">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start px-3 py-2",
                isCollapsed ? "h-10 w-10" : "h-10",
                isClinicSelectorOpen && "bg-purple-50",
              )}
              onClick={() => setIsClinicSelectorOpen(!isClinicSelectorOpen)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-sm font-medium text-purple-600">
                  {getClinicInitials(activeClinic.name)}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-sm text-left">
                      {activeClinic.name.length > 20 ? `${activeClinic.name.slice(0, 20)}...` : activeClinic.name}
                    </div>
                    <ChevronRight className={cn("h-4 w-4 text-gray-400", isClinicSelectorOpen && "rotate-90")} />
                  </>
                )}
              </div>
            </Button>
            {isClinicSelectorOpen && (
              <div
                className="fixed left-0 top-0 w-screen h-screen flex items-start justify-start z-[9999]"
                onClick={() => setIsClinicSelectorOpen(false)}
              >
                <div
                  className="absolute left-64 top-16 w-80 rounded-md border bg-white shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        placeholder="Buscar centros..."
                        value={clinicSearchTerm}
                        onChange={(e) => setClinicSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
                      {filteredClinics.map((clinic) => (
                        <Button
                          key={clinic.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start px-3 py-2",
                            activeClinic.id === clinic.id ? "bg-green-50" : "hover:bg-purple-50",
                          )}
                          onClick={() => handleClinicSelect(clinic)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-sm font-medium text-purple-600">
                              {getClinicInitials(clinic.name)}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium">{clinic.name}</div>
                              <div className="text-xs text-gray-500">{clinic.prefix}</div>
                            </div>
                            {activeClinic.id === clinic.id && <div className="h-2 w-2 rounded-full bg-green-500"></div>}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="px-3 mt-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <MenuItemComponent
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

