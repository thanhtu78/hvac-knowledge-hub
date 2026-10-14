-- HVAC Knowledge Hub — schema khởi tạo
-- Chạy trong SQL Editor của Supabase project

-- ============ CATALOG ============
create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

create table product_lines (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table models (
  id uuid primary key default gen_random_uuid(),
  line_id uuid not null references product_lines(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brand_id uuid references brands(id) on delete set null,
  model_id uuid references models(id) on delete set null,
  file_url text,
  pages int default 0,
  is_premium boolean default false,
  status text default 'draft' check (status in ('draft','pending','published')),
  views int default 0,
  created_at timestamptz default now()
);

create table error_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  brand_id uuid references brands(id) on delete set null,
  title text not null,
  cause text,
  created_at timestamptz default now()
);

create table error_code_steps (
  id uuid primary key default gen_random_uuid(),
  error_code_id uuid not null references error_codes(id) on delete cascade,
  step_order int not null,
  instruction text not null,
  is_premium boolean default false
);

create table checklists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamptz default now()
);

create table checklist_steps (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references checklists(id) on delete cascade,
  step_order int not null,
  instruction text not null
);

-- ============ USERS & BILLING ============
create table app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique not null,
  is_premium boolean default false,
  created_at timestamptz default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references app_users(id) on delete set null,
  plan text not null,
  amount int not null,
  status text default 'pending' check (status in ('pending','success','failed')),
  created_at timestamptz default now()
);

-- ============ MEDIA & NOTIFICATIONS ============
create table media_files (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_type text not null check (file_type in ('pdf','image','video')),
  size_bytes bigint,
  storage text not null check (storage in ('r2','cloudinary')),
  url text,
  created_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  status text default 'draft' check (status in ('draft','sent')),
  sent_count int default 0,
  created_at timestamptz default now()
);

-- ============ RLS ============
-- Admin CMS dùng phiên authenticated. Thu hẹp policies khi lên production thật.
alter table brands enable row level security;
alter table product_lines enable row level security;
alter table models enable row level security;
alter table documents enable row level security;
alter table error_codes enable row level security;
alter table error_code_steps enable row level security;
alter table checklists enable row level security;
alter table checklist_steps enable row level security;
alter table app_users enable row level security;
alter table transactions enable row level security;
alter table media_files enable row level security;
alter table notifications enable row level security;

-- Đọc public cho app user (tài liệu đã duyệt, mã lỗi, checklist...)
create policy "public read published documents"
  on documents for select using (status = 'published');
create policy "public read error codes"
  on error_codes for select using (true);
create policy "public read error code steps"
  on error_code_steps for select using (true);
create policy "public read checklists"
  on checklists for select using (true);
create policy "public read checklist steps"
  on checklist_steps for select using (true);
create policy "public read brands"
  on brands for select using (true);
create policy "public read product lines"
  on product_lines for select using (true);
create policy "public read models"
  on models for select using (true);

-- Admin (authenticated) full quyền — TODO: giới hạn theo role admin
create policy "admin full access"
  on brands for all to authenticated using (true) with check (true);
create policy "admin full access"
  on product_lines for all to authenticated using (true) with check (true);
create policy "admin full access"
  on models for all to authenticated using (true) with check (true);
create policy "admin full access"
  on documents for all to authenticated using (true) with check (true);
create policy "admin full access"
  on error_codes for all to authenticated using (true) with check (true);
create policy "admin full access"
  on error_code_steps for all to authenticated using (true) with check (true);
create policy "admin full access"
  on checklists for all to authenticated using (true) with check (true);
create policy "admin full access"
  on checklist_steps for all to authenticated using (true) with check (true);
create policy "admin full access"
  on app_users for all to authenticated using (true) with check (true);
create policy "admin full access"
  on transactions for all to authenticated using (true) with check (true);
create policy "admin full access"
  on media_files for all to authenticated using (true) with check (true);
create policy "admin full access"
  on notifications for all to authenticated using (true) with check (true);

-- ============ SEED ============
insert into brands (name) values ('Daikin'), ('Panasonic'), ('LG') on conflict (name) do nothing;
