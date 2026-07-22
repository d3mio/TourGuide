-- ====================================================================
-- FULL OPTIMIZED SCHEMA MIGRATION FOR TOURGUIDE / VISITCEYLON
-- Target Database: https://mfqdtxojgutnaciyiigf.supabase.co
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. WISHLISTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    destination_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, destination_id)
);

-- Optimization: Foreign Key Index
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);

-- Security: Row Level Security & Explicit Grants
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wishlists" ON public.wishlists;
CREATE POLICY "Users can view own wishlists"
ON public.wishlists FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own wishlists" ON public.wishlists;
CREATE POLICY "Users can insert own wishlists"
ON public.wishlists FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own wishlists" ON public.wishlists;
CREATE POLICY "Users can delete own wishlists"
ON public.wishlists FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlists TO anon, authenticated;

-- --------------------------------------------------------------------
-- 2. TRIP DRAFTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trip_drafts (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    itinerary_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optimization: Indexes on FK and commonly queried status filter
CREATE INDEX IF NOT EXISTS idx_trip_drafts_user_id ON public.trip_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_drafts_status ON public.trip_drafts(status);

-- Security: Row Level Security
ALTER TABLE public.trip_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own trip drafts" ON public.trip_drafts;
CREATE POLICY "Users can select own trip drafts"
ON public.trip_drafts FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own trip drafts" ON public.trip_drafts;
CREATE POLICY "Users can insert own trip drafts"
ON public.trip_drafts FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own trip drafts" ON public.trip_drafts;
CREATE POLICY "Users can update own trip drafts"
ON public.trip_drafts FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own trip drafts" ON public.trip_drafts;
CREATE POLICY "Users can delete own trip drafts"
ON public.trip_drafts FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Updated At Trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS update_trip_drafts_modtime ON public.trip_drafts;
CREATE TRIGGER update_trip_drafts_modtime
BEFORE UPDATE ON public.trip_drafts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_drafts TO anon, authenticated;

-- --------------------------------------------------------------------
-- 3. REVIEWS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
    text TEXT NOT NULL,
    date TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optimization: Index on user_id and sort order (created_at DESC)
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reviews read access" ON public.reviews;
CREATE POLICY "Public reviews read access"
ON public.reviews FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
CREATE POLICY "Authenticated users can create reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
CREATE POLICY "Users can delete own reviews"
ON public.reviews FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO anon, authenticated;

-- --------------------------------------------------------------------
-- 4. MEDIA TABLE (Optmized for WebP media storage)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    url TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    width INT,
    height INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optimization: Composite index for category and type filtering
CREATE INDEX IF NOT EXISTS idx_media_category_type ON public.media(category, type);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public media read access" ON public.media;
CREATE POLICY "Public media read access"
ON public.media FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated media insert" ON public.media;
CREATE POLICY "Authenticated media insert"
ON public.media FOR INSERT
TO authenticated
WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO anon, authenticated;

-- --------------------------------------------------------------------
-- 5. STORAGE BUCKETS & POLICIES (tours_media)
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('tours_media', 'tours_media', true)
ON CONFLICT (id) DO NOTHING;

-- Public bucket image viewing works automatically via public URL.
-- Remove broad SELECT RLS policy on storage.objects to prevent unauthorized directory listing.
DROP POLICY IF EXISTS "Public storage read access" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated storage insert access" ON storage.objects;
CREATE POLICY "Authenticated storage insert access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tours_media');
