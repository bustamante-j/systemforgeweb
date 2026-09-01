create table public.templates (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  audience text not null,
  theme text not null,
  description text not null,
  demo_url text not null,
  tags text[] not null default '{}',
  features text[] not null default '{}',
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint templates_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint templates_name_not_blank check (btrim(name) <> ''),
  constraint templates_audience_not_blank check (btrim(audience) <> ''),
  constraint templates_description_not_blank check (btrim(description) <> ''),
  constraint templates_theme_allowed check (theme in ('light', 'dark')),
  constraint templates_demo_url_https check (demo_url ~ '^https://'),
  constraint templates_tags_no_nulls check (array_position(tags, null) is null),
  constraint templates_features_no_nulls check (array_position(features, null) is null),
  constraint templates_display_order_nonnegative check (display_order >= 0)
);

comment on table public.templates is
  'Public System Forge template catalog managed through Supabase.';

comment on column public.templates.slug is
  'Stable public identifier used in the website URL.';

create index templates_published_order_idx
  on public.templates (display_order, id)
  where is_published = true;

alter table public.templates enable row level security;

revoke all on table public.templates from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public.templates to anon, authenticated;

create policy "published templates are publicly readable"
  on public.templates
  for select
  to anon, authenticated
  using (is_published = true);
