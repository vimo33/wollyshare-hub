
-- Create a storage bucket for item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('items', 'Items Images', true);

-- Set up access policies for the items bucket
-- Allow users to upload their own images
CREATE POLICY "Users can upload their own item images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'items' AND auth.uid()::text = SUBSTRING(name FROM '^([^/]+)'));

-- Allow users to update their own images
CREATE POLICY "Users can update their own item images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'items' AND auth.uid()::text = SUBSTRING(name FROM '^([^/]+)'));

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own item images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'items' AND auth.uid()::text = SUBSTRING(name FROM '^([^/]+)'));

-- Allow anyone to view item images (since they're shared with the community)
CREATE POLICY "Anyone can view item images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'items');
