
-- Create settings table for persistent key-value config
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert settings" ON public.settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update settings" ON public.settings FOR UPDATE USING (true);

-- Create zone-photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('zone-photos', 'zone-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure event-images bucket exists
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for zone-photos bucket
CREATE POLICY "Anyone can read zone photos" ON storage.objects FOR SELECT USING (bucket_id = 'zone-photos');
CREATE POLICY "Anyone can upload zone photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'zone-photos');
CREATE POLICY "Anyone can update zone photos" ON storage.objects FOR UPDATE USING (bucket_id = 'zone-photos');
CREATE POLICY "Anyone can delete zone photos" ON storage.objects FOR DELETE USING (bucket_id = 'zone-photos');

-- Seed default contact info into settings
INSERT INTO public.settings (key, value) VALUES
  ('site_address', 'No. 7 Buenamar Road, Dona Isaura Village, Brgy. Novaliches Proper, Quezon City 1123'),
  ('site_address_sub', '(Across Novaliches Proper Barangay Hall)'),
  ('site_contact', '0951 081 5806'),
  ('site_instagram', '@auxiliarybar_lounge'),
  ('site_instagram_url', 'https://www.instagram.com/auxiliarybar_lounge'),
  ('site_facebook', 'Auxiliary Bar and Lounge'),
  ('site_facebook_url', 'https://www.facebook.com/profile.php?id=61581380972061'),
  ('site_hours', 'Open Daily · 5:00 PM – 2:00 AM'),
  ('site_directions_url', 'https://share.google/JQiUAJQYR01e2kkXN')
ON CONFLICT (key) DO NOTHING;
