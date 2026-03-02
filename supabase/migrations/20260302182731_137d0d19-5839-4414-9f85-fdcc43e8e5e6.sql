
-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests TEXT NOT NULL,
  occasion TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot INTEGER NOT NULL UNIQUE,
  image_url TEXT,
  date_label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Seed default events
INSERT INTO public.events (slot, image_url, date_label, title, description) VALUES
  (1, 'https://i.imgur.com/YCOVP70.png', 'FEBRUARY 7, 2025', 'Cupid''s Choice — A Pink Affair', 'The wildest Valentine''s event in Novaliches.'),
  (2, 'https://i.imgur.com/HyINqXX.png', 'EVERY WEEKEND', 'DJ Nights at Auxiliary', 'Our resident and guest DJs keep the energy alive.'),
  (3, 'https://i.imgur.com/g22R9eh.png', 'OPEN FOR BOOKINGS', 'Private Events & Celebrations', 'Birthdays, debuts, company parties — we host it all.');

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Bookings: anyone can insert (public reservation form)
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Bookings: anyone can read (for admin, will add auth later if needed)
CREATE POLICY "Anyone can read bookings" ON public.bookings FOR SELECT USING (true);

-- Bookings: anyone can update (admin actions)
CREATE POLICY "Anyone can update bookings" ON public.bookings FOR UPDATE USING (true);

-- Bookings: anyone can delete
CREATE POLICY "Anyone can delete bookings" ON public.bookings FOR DELETE USING (true);

-- Events: anyone can read
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT USING (true);

-- Events: anyone can update (admin)
CREATE POLICY "Anyone can update events" ON public.events FOR UPDATE USING (true);

-- Events: anyone can insert
CREATE POLICY "Anyone can insert events" ON public.events FOR INSERT WITH CHECK (true);
