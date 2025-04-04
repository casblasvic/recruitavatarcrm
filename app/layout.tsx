import type React from "react"
import "@/styles/globals.css"
import { LastClientProvider } from "@/contexts/last-client-context"
import { ClientCardProvider } from "@/contexts/client-card-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { LayoutWrapper } from "@/components/LayoutWrapper"
import { CabinProvider } from "@/contexts/CabinContext"
import { ClinicProvider } from "@/contexts/clinic-context"

export const metadata = {
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ClinicProvider>
          <CabinProvider>
            <LastClientProvider>
              <ClientCardProvider>
                <ThemeProvider>
                  <LayoutWrapper>{children}</LayoutWrapper>
                </ThemeProvider>
              </ClientCardProvider>
            </LastClientProvider>
          </CabinProvider>
        </ClinicProvider>
      </body>
    </html>
  )
}



import './globals.css'