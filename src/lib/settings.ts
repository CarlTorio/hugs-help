import { supabase } from "@/integrations/supabase/client";

// Fetch a single setting by key
export async function getSetting(key: string): Promise<string | null> {
  const { data, error } = await (supabase.from as any)("settings")
    .select("value")
    .eq("key", key)
    .single();
  if (error || !data) return null;
  return data.value;
}

// Fetch multiple settings by keys
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const { data, error } = await (supabase.from as any)("settings")
    .select("key, value")
    .in("key", keys);
  if (error || !data) return {};
  const result: Record<string, string> = {};
  for (const row of data) {
    result[row.key] = row.value;
  }
  return result;
}

// Upsert a setting
export async function setSetting(key: string, value: string): Promise<boolean> {
  const { error } = await (supabase.from as any)("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  return !error;
}

// Fetch table rates as a record
export async function fetchTableRates(): Promise<Record<string, number>> {
  const raw = await getSetting("table_rates");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Check if booking is closed
export async function isBookingClosed(): Promise<{ closed: boolean; message: string }> {
  const settings = await getSettings(["booking_closed", "booking_closed_message"]);
  return {
    closed: settings.booking_closed === "true",
    message: settings.booking_closed_message || "Reservations are currently closed.",
  };
}
