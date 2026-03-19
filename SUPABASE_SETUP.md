Supabase setup
================

1. Create a new project at https://app.supabase.com
2. In SQL editor, run the following to create the `tournaments` table:

```sql
create extension if not exists "pgcrypto";

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  owner uuid references auth.users(id) on delete cascade,
  content jsonb,
  updated_at timestamptz default now()
);

create index if not exists idx_tournaments_owner_updated on public.tournaments(owner, updated_at desc);
```

3. In your Supabase project settings → API, copy `Project URL` and `anon` key. In Supabase → Settings → API, also get a `Service Role` key (keep secret).

4. On Vercel, set these Environment Variables in your Project Settings → Environment Variables:
- `VITE_SUPABASE_URL` = your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` = anon public key
- `SUPABASE_URL` = same as `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` = service role key (secret)

5. Locally, create `.env.local` with at least:
```
VITE_SUPABASE_URL=your_projects_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=your_projects_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

6. After setting env vars, deploy on Vercel. The front-end will let authenticated Supabase users sync their tournament data.
