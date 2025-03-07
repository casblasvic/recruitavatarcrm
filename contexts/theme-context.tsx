"use client"

import { useEffect } from "react"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  mobileColors?: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
}

interface ThemeContextType {
  colors: ThemeColors
  setColors: (colors: Partial<ThemeColors>) => void
  isMobile: boolean
}

const defaultColors: ThemeColors = {
  primary: "rgb(147, 51, 234)", // Purple
  secondary: "#f3f4f6", // Light gray
  accent: "#4b5563", // Dark gray
  background: "#ffffff", // White
  text: "#1f2937", // Almost black
  mobileColors: {
    primary: "rgb(147, 51, 234)", // Can be different for mobile
    secondary: "#f3f4f6",
    accent: "#4b5563",
    background: "#ffffff",
    text: "#1f2937",
  },
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColorsState] = useState<ThemeColors>(defaultColors)
  const [isMobile, setIsMobile] = useState(false)

  // Update on window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const setColors = (newColors: Partial<ThemeColors>) => {
    setColorsState((prev) => ({ ...prev, ...newColors }))
  }

  return <ThemeContext.Provider value={{ colors, setColors, isMobile }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

