-- Create wishlists table
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    destination_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, destination_id)
);

-- Enable RLS for wishlists
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlists"
ON wishlists
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trip_drafts table
CREATE TABLE trip_drafts (
    id TEXT PRIMARY KEY, -- using TEXT because Zustand store uses arbitrary string IDs like "draft-..."
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    itinerary_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for trip_drafts
ALTER TABLE trip_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own trip drafts"
ON trip_drafts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger for trip_drafts
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trip_drafts_modtime
BEFORE UPDATE ON trip_drafts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
