-- Grant only the minimum required CRUD privileges (not TRUNCATE, REFERENCES, or TRIGGER)
-- Row-level access is controlled by RLS policies defined in the create_tables migration.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_drafts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlists TO anon, authenticated;
