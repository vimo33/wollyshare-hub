
-- Enable real-time updates for the items table
ALTER TABLE public.items REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.items;
