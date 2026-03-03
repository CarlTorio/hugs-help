
-- Create events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot integer NOT NULL UNIQUE,
  image_url text,
  date_label text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT ''
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete events" ON public.events FOR DELETE USING (true);

-- Seed 3 default event slots
INSERT INTO public.events (slot, image_url, date_label, title, description) VALUES
  (1, 'https://i.imgur.com/YCOVP70.png', 'FEBRUARY 7, 2025', 'Cupid''s Choice — A Pink Affair', 'The wildest Valentine''s event in Novaliches.'),
  (2, 'https://i.imgur.com/HyINqXX.png', 'EVERY WEEKEND', 'DJ Nights at Auxiliary', 'Our resident and guest DJs keep the energy alive.'),
  (3, 'https://i.imgur.com/g22R9eh.png', 'OPEN FOR BOOKINGS', 'Private Events & Celebrations', 'Birthdays, debuts, company parties — we host it all.');

-- Create bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  contact_number text NOT NULL,
  number_of_pax integer NOT NULL,
  date_of_visit date NOT NULL,
  time_of_arrival text NOT NULL,
  table_type text NOT NULL,
  special_requests text,
  receipt_url text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete bookings" ON public.bookings FOR DELETE USING (true);

-- Create receipts storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true);

-- Storage policies for receipts bucket
CREATE POLICY "Anyone can upload receipts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'receipts');
CREATE POLICY "Anyone can read receipts" ON storage.objects FOR SELECT USING (bucket_id = 'receipts');
