// Reservation types and helpers — mapped to bookings table

export interface Reservation {
  id: string;
  full_name: string;
  email: string;
  contact_number: string;
  number_of_pax: number;
  date_of_visit: string;
  time_of_arrival: string;
  table_type: string;
  special_requests: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

// Maps form data to bookings table columns
export function toBookingInsert(data: {
  full_name: string;
  email: string;
  contact_number: string;
  number_of_pax: number;
  date_of_visit: string;
  time_of_arrival: string;
  table_type: string;
  special_requests: string | null;
}) {
  return {
    name: data.full_name,
    contact: `${data.contact_number} | ${data.email}`,
    date: data.date_of_visit,
    time: data.time_of_arrival,
    guests: String(data.number_of_pax),
    occasion: data.table_type,
    notes: data.special_requests || "",
  };
}

// Maps bookings table row back to Reservation shape
export function fromBookingRow(row: any): Reservation {
  const contactParts = (row.contact || "").split(" | ");
  const contactNumber = contactParts[0] || "";
  const email = contactParts[1] || "";
  return {
    id: row.id,
    full_name: row.name,
    email,
    contact_number: contactNumber,
    number_of_pax: parseInt(row.guests) || 0,
    date_of_visit: row.date,
    time_of_arrival: row.time,
    table_type: row.occasion,
    special_requests: row.notes || null,
    status: row.status,
    admin_notes: null,
    created_at: row.created_at,
  };
}

export type ReservationInsert = Omit<Reservation, "id" | "status" | "admin_notes" | "created_at">;

export const TABLE_TYPES = [
  { value: "standing-small", label: "Standing Table — Small (2-4 pax)", minPax: 2, maxPax: 4, price: 1500 },
  { value: "standing-big", label: "Standing Table — Big (4-8 pax)", minPax: 4, maxPax: 8, price: 2500 },
  { value: "vip-1-3", label: "VIP Table 1-3 (5-7 pax)", minPax: 5, maxPax: 7, price: 5000 },
  { value: "vip-4-9", label: "VIP Table 4-9 (8-10 pax)", minPax: 8, maxPax: 10, price: 7000 },
  { value: "vip-10", label: "VIP Table 10 (10-12 pax)", minPax: 10, maxPax: 12, price: 10000 },
] as const;

// Time slots: 9PM-11PM same day, 12AM-5AM = next day
export const TIME_SLOTS = [
  { label: "9:00 PM", value: "9:00 PM", isNextDay: false },
  { label: "10:00 PM", value: "10:00 PM", isNextDay: false },
  { label: "11:00 PM", value: "11:00 PM", isNextDay: false },
  { label: "12:00 AM", value: "12:00 AM", isNextDay: true },
  { label: "1:00 AM", value: "1:00 AM", isNextDay: true },
  { label: "2:00 AM", value: "2:00 AM", isNextDay: true },
  { label: "3:00 AM", value: "3:00 AM", isNextDay: true },
  { label: "4:00 AM", value: "4:00 AM", isNextDay: true },
  { label: "5:00 AM", value: "5:00 AM", isNextDay: true },
] as const;

export const PAX_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const PRICING = {
  "standing-small": 1500,
  "standing-big": 2500,
  "vip-1-3": 5000,
  "vip-4-9": 7000,
  "vip-10": 10000,
} as const;

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 5 || day === 6; // Fri, Sat, Sun
}

export function validatePaxForTable(pax: number, tableType: string): string | null {
  const table = TABLE_TYPES.find((t) => t.value === tableType);
  if (!table) return null;
  if (pax < table.minPax || pax > table.maxPax) {
    return `${table.label} accommodates ${table.minPax}-${table.maxPax} guests. You selected ${pax}.`;
  }
  return null;
}

export function formatPeso(amount: number): string {
  return `₱${amount.toLocaleString()}`;
}

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgba(204,204,0,0.15)", text: "#CCCC00" },
  confirmed: { bg: "rgba(0,180,0,0.15)", text: "#00CC00" },
  cancelled: { bg: "rgba(204,0,0,0.15)", text: "#CC0000" },
  completed: { bg: "rgba(0,120,204,0.15)", text: "#0088CC" },
  archived: { bg: "rgba(212,160,23,0.15)", text: "#D4A017" },
};
