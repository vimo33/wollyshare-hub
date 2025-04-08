
-- Define constants to avoid duplication
DO $$ 
DECLARE
  bucket_id CONSTANT text := 'items';
  bucket_name CONSTANT text := 'Items Images';
  auth_uid_path CONSTANT text := 'auth.uid()::text = SUBSTRING(name FROM \'^([^/]+)\')'; 
BEGIN

-- Create a storage bucket for item images
INSERT INTO storage.buckets (id, name, public)
VALUES (bucket_id, bucket_name, true);

-- Set up access policies for the items bucket
-- Allow users to upload their own images
EXECUTE format('
  CREATE POLICY "Users can upload their own item images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = %L AND %s)',
  bucket_id, auth_uid_path
);

-- Allow users to update their own images
EXECUTE format('
  CREATE POLICY "Users can update their own item images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = %L AND %s)',
  bucket_id, auth_uid_path
);

-- Allow users to delete their own images
EXECUTE format('
  CREATE POLICY "Users can delete their own item images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = %L AND %s)',
  bucket_id, auth_uid_path
);

-- Allow anyone to view item images (since they're shared with the community)
EXECUTE format('
  CREATE POLICY "Anyone can view item images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = %L)',
  bucket_id
);

END $$;
