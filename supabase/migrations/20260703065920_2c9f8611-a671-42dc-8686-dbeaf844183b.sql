CREATE TABLE public.organizer_follows (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organizer text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, organizer)
);

GRANT SELECT ON public.organizer_follows TO anon;
GRANT SELECT, INSERT, DELETE ON public.organizer_follows TO authenticated;
GRANT ALL ON public.organizer_follows TO service_role;

ALTER TABLE public.organizer_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads organizer follows"
  ON public.organizer_follows FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users follow organizers"
  ON public.organizer_follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users unfollow organizers"
  ON public.organizer_follows FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX organizer_follows_organizer_idx ON public.organizer_follows (organizer);
CREATE INDEX organizer_follows_user_idx ON public.organizer_follows (user_id);