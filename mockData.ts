export interface Clinic {
  id: number
  prefix: string
  commercialName: string
  businessName: string
  cif: string
  country: string
  province: string
  city: string
  postalCode: string
  address: string
  phone: string
  phone2: string
  email: string
  openTime: string
  closeTime: string
  weekendOpenTime: string
  weekendCloseTime: string
  initialCash: string
  rate: string
  ip: string
  notes: string
  saturdayOpen: boolean
  sundayOpen: boolean
  ticketSize: "a4" | "a5"
  blockSignArea: "yes" | "no"
  blockPersonalData: "yes" | "no"
  delayedPayments: boolean
  affectsStats: boolean
  appearsInApp: boolean
  scheduleControl: boolean
  professionalSkills: boolean
  cabins: Cabin[]
}

export interface Cabin {
  id: number
  clinicId: number
  code: string
  name: string
  color: string
  isActive: boolean
  order: number
}

export interface User {
  id: number
  clinicId: number
  name: string
  email: string
  role: string
}

export interface Appointment {
  id: number
  clinicId: number
  cabinId: number
  userId: number
  clientName: string
  clientPhone: string
  date: string
  startTime: string
  duration: number
  service: string
}

export interface Equipment {
  id: number
  clinicId: number
  code: string
  name: string
  description: string
}

export const mockClinics: Clinic[] = [
  {
    id: 1,
    prefix: "000001",
    commercialName: "Californie Multilaser - Organicare",
    businessName: "Californie Multilaser S.A.",
    cif: "002169591000022",
    country: "Marruecos",
    province: "Casablanca-Settat",
    city: "Casablanca",
    postalCode: "24070",
    address: "Al Adarissa 15",
    phone: "0520223100",
    phone2: "",
    email: "contact@multilaser.ma",
    openTime: "10:00",
    closeTime: "19:30",
    weekendOpenTime: "10:00",
    weekendCloseTime: "15:00",
    initialCash: "0.00",
    rate: "Tarifa Californie",
    ip: "0.0.0.0",
    notes: "",
    saturdayOpen: true,
    sundayOpen: false,
    ticketSize: "a5",
    blockSignArea: "no",
    blockPersonalData: "no",
    delayedPayments: true,
    affectsStats: true,
    appearsInApp: true,
    scheduleControl: false,
    professionalSkills: false,
    cabins: [
      { id: 1, clinicId: 1, code: "Con", name: "Consultation", color: "#ff0000", isActive: true, order: 1 },
      { id: 2, clinicId: 1, code: "Con", name: "Consultation2", color: "#00ff00", isActive: true, order: 2 },
      { id: 3, clinicId: 1, code: "Lun", name: "Lunula", color: "#0000ff", isActive: true, order: 3 },
      { id: 4, clinicId: 1, code: "For", name: "Forte/Bal", color: "#ff0000", isActive: true, order: 4 },
      { id: 5, clinicId: 1, code: "Ski", name: "SkinShape", color: "#ff0000", isActive: false, order: 5 },
      { id: 6, clinicId: 1, code: "WB", name: "Won/Bal", color: "#ff0000", isActive: true, order: 6 },
      { id: 7, clinicId: 1, code: "Ver", name: "Verju/Bal", color: "#ff0000", isActive: true, order: 7 },
      { id: 8, clinicId: 1, code: "WB", name: "Won/Bal", color: "#ff0000", isActive: false, order: 8 },
      { id: 9, clinicId: 1, code: "Eme", name: "Emerald", color: "#ff0000", isActive: true, order: 9 },
    ],
  },
  {
    id: 2,
    prefix: "Cafc",
    commercialName: "Cafc Multilaser",
    businessName: "Cafc Multilaser S.A.",
    cif: "002169591000023",
    country: "Marruecos",
    province: "Casablanca-Settat",
    city: "Casablanca",
    postalCode: "24000",
    address: "Rue 123, Quartier XYZ",
    phone: "0520223101",
    phone2: "",
    email: "contact@cafcmultilaser.ma",
    openTime: "09:00",
    closeTime: "18:00",
    weekendOpenTime: "09:00",
    weekendCloseTime: "14:00",
    initialCash: "0.00",
    rate: "Tarifa Cafc",
    ip: "0.0.0.0",
    notes: "",
    saturdayOpen: true,
    sundayOpen: false,
    ticketSize: "a4",
    blockSignArea: "no",
    blockPersonalData: "no",
    delayedPayments: true,
    affectsStats: true,
    appearsInApp: true,
    scheduleControl: true,
    professionalSkills: true,
    cabins: [
      { id: 10, clinicId: 2, code: "Con", name: "Consultation", color: "#0000ff", isActive: true, order: 1 },
      { id: 11, clinicId: 2, code: "Tre", name: "Treatment", color: "#00ff00", isActive: true, order: 2 },
    ],
  },
  {
    id: 3,
    prefix: "TEST",
    commercialName: "CENTRO TEST",
    businessName: "Centro Test S.L.",
    cif: "B12345678",
    country: "España",
    province: "Madrid",
    city: "Madrid",
    postalCode: "28001",
    address: "Calle de Prueba, 123",
    phone: "912345678",
    phone2: "",
    email: "contact@centrotest.es",
    openTime: "08:00",
    closeTime: "20:00",
    weekendOpenTime: "10:00",
    weekendCloseTime: "16:00",
    initialCash: "100.00",
    rate: "Tarifa Test",
    ip: "0.0.0.0",
    notes: "Centro de pruebas",
    saturdayOpen: true,
    sundayOpen: true,
    ticketSize: "a5",
    blockSignArea: "yes",
    blockPersonalData: "yes",
    delayedPayments: false,
    affectsStats: true,
    appearsInApp: false,
    scheduleControl: true,
    professionalSkills: true,
    cabins: [{ id: 12, clinicId: 3, code: "Tes", name: "Test Cabin", color: "#ff00ff", isActive: true, order: 1 }],
  },
]

export const mockUsers: User[] = [
  { id: 1, clinicId: 1, name: "Admin Californie", email: "admin@californie.ma", role: "admin" },
  { id: 2, clinicId: 1, name: "Doctor Californie", email: "doctor@californie.ma", role: "doctor" },
  { id: 3, clinicId: 2, name: "Admin Cafc", email: "admin@cafc.ma", role: "admin" },
  { id: 4, clinicId: 3, name: "Admin Test", email: "admin@test.es", role: "admin" },
]

export const mockAppointments: Appointment[] = [
  {
    id: 1,
    clinicId: 1,
    cabinId: 1,
    userId: 2,
    clientName: "Nadia Anachad",
    clientPhone: "0600000001",
    date: "2025-02-24",
    startTime: "10:00",
    duration: 60,
    service: "Verju Amincissement",
  },
  {
    id: 2,
    clinicId: 1,
    cabinId: 3,
    userId: 2,
    clientName: "Maria Garcia",
    clientPhone: "0600000002",
    date: "2025-02-24",
    startTime: "11:30",
    duration: 30,
    service: "Masaje",
  },
  {
    id: 3,
    clinicId: 2,
    cabinId: 10,
    userId: 3,
    clientName: "John Doe",
    clientPhone: "0600000003",
    date: "2025-02-25",
    startTime: "09:30",
    duration: 45,
    service: "Consulta",
  },
]

export const mockEquipment: Equipment[] = [
  { id: 1, clinicId: 1, code: "BALLA", name: "Ballancer", description: "Pressotherapie" },
  { id: 2, clinicId: 1, code: "EVRL", name: "Evrl", description: "EVRL" },
  { id: 3, clinicId: 1, code: "FORTE", name: "Forte Gem", description: "Forte Gem" },
  { id: 4, clinicId: 2, code: "JFL", name: "JETPEEL", description: "JETPEEL" },
  { id: 5, clinicId: 2, code: "LUNUL", name: "Lunula Laser", description: "Lunula Laser" },
  { id: 6, clinicId: 3, code: "TEST", name: "Test Equipment", description: "For testing purposes" },
]

