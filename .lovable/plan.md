

## Plan: Admin Table Rate Editor + Booking Closure System

### Overview
Two new features in the Admin Settings tab:
1. **Editable table rates** — admin can change the price for each table type
2. **Booking closure** — admin can mark the booking system as closed, preventing new reservations

### Approach: Supabase `settings` Table
Both features will be stored in a new Supabase `settings` table (key-value store) so changes persist across sessions and devices (currently GCash settings use localStorage which is device-local).

### Database Migration

Create a new `settings` table:
```sql
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (needed for booking page)
CREATE POLICY "Anyone can read settings" ON public.settings FOR SELECT USING (true);

-- Allow anyone to update/insert (admin is password-protected in UI)
CREATE POLICY "Anyone can modify settings" ON public.settings FOR ALL USING (true);

-- Seed default values
INSERT INTO public.settings (key, value) VALUES
  ('table_rates', '{"standing-small":1500,"standing-big":2500,"vip-1-3":5000,"vip-4-9":7000,"vip-10":10000}'),
  ('booking_closed', 'false'),
  ('booking_closed_message', 'Reservations are currently closed. Please check back later.'),
  ('gcash_number', '0917 123 4567'),
  ('gcash_name', 'Auxiliary Bar');
```

### Changes

**1. `src/components/admin/AdminSettings.tsx`**
- Add a "Table Rates" section with editable price inputs for each table type
- Add a "Booking Status" toggle (Open/Closed) with a customizable closed message
- Migrate GCash settings from localStorage to the `settings` table
- All settings read/write via Supabase `settings` table

**2. `src/lib/reservations.ts`**
- Make `TABLE_TYPES` prices dynamic — add a helper to merge base table types with fetched rates
- Export a function `fetchTableRates()` that reads from Supabase

**3. `src/components/BookingSection.tsx`**
- On mount, fetch `booking_closed` and `table_rates` from settings
- If booking is closed, show a "closed" message instead of the form
- Use dynamic rates for table type dropdown and pricing info card

**4. `src/components/PaymentStep.tsx`**
- Will receive dynamic price from BookingSection (already does via props, no change needed)

**5. `src/components/admin/AdminSettings.tsx` (GCash migration)**
- Move GCash read/write from localStorage to Supabase settings table
- Update `getGcashNumber()` / `getGcashName()` exports (used by PaymentStep)

### Technical Details

- Settings table uses a simple key-value pattern; `table_rates` stored as JSON string
- Booking closure is a boolean flag; when `true`, the booking form renders a "closed" banner
- Table rates are fetched once on BookingSection mount via a single query to `settings`
- Admin settings page fetches all settings on mount, saves individually on change

