
-- Create events table for 3 editable event card slots
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot INTEGER NOT NULL UNIQUE CHECK (slot >= 1 AND slot <= 3),
  image_url TEXT,
  date_label TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seed 3 default event slots
INSERT INTO public.events (slot, image_url, date_label, title, description) VALUES
(1, 'https://i.imgur.com/YCOVP70.png', 'FEBRUARY 7, 2025', 'Cupid''s Choice — A Pink Affair', 'The wildest Valentine''s event in Novaliches. Featuring DJ Tricia Cosio and Shy Dee Wong together with Dan, Azi, MC Pain, and Usake Girls. No date? No problem. IYKYK.'),
(2, 'https://i.imgur.com/HyINqXX.png', 'EVERY WEEKEND', 'DJ Nights at Auxiliary', 'Lose yourself in the beat. Our resident and guest DJs keep the energy alive every Friday and Saturday night. Come early, stay late.'),
(3, 'https://i.imgur.com/g22R9eh.png', 'OPEN FOR BOOKINGS', 'Private Events & Celebrations', 'Birthdays, debuts, company parties — we host it all. Message us to customize your perfect night at Auxiliary.');

-- Enable RLS but allow public read
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert events" ON public.events FOR INSERT WITH CHECK (true);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests TEXT NOT NULL,
  occasion TEXT NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete bookings" ON public.bookings FOR DELETE USING (true);

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);

CREATE POLICY "Anyone can read event images" ON storage.objects FOR SELECT USING (bucket_id = 'event-images');
CREATE POLICY "Anyone can upload event images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-images');
CREATE POLICY "Anyone can update event images" ON storage.objects FOR UPDATE USING (bucket_id = 'event-images');
CREATE POLICY "Anyone can delete event images" ON storage.objects FOR DELETE USING (bucket_id = 'event-images');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
