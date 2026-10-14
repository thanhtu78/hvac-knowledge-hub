-- Chuyen user app sang Google login (15/10/2026)
-- Bo OTP SMS ton phi: phone khong con bat buoc, auth qua Google OAuth
alter table app_users alter column phone drop not null;
alter table app_users add column if not exists email text;
alter table app_users add column if not exists full_name text;
alter table app_users add column if not exists avatar_url text;
