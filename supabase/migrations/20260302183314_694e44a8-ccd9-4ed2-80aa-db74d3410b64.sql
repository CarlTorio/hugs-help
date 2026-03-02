
-- Create receipts storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true);

-- Allow anyone to upload receipts
CREATE POLICY "Anyone can upload receipts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'receipts');

-- Allow anyone to read receipts
CREATE POLICY "Anyone can read receipts" ON storage.objects FOR SELECT USING (bucket_id = 'receipts');
