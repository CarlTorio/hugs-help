
-- Allow anyone to upload to event-images bucket
CREATE POLICY "Allow public upload to event-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-images');

-- Allow anyone to update objects in event-images bucket
CREATE POLICY "Allow public update in event-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'event-images');

-- Allow anyone to delete from event-images bucket
CREATE POLICY "Allow public delete from event-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-images');

-- Allow anyone to read from event-images bucket
CREATE POLICY "Allow public read from event-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');
