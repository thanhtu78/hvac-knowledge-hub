# HVAC Hub — Admin CMS

Trang quản trị cho nền tảng tài liệu kỹ thuật điện lạnh HVAC Hub.

## Chạy local

```bash
pnpm install
cp .env.example .env   # điền SUPABASE_URL + ANON_KEY
pnpm dev               # http://localhost:5173
```

## Deploy Vercel

1. Import repo `hvac-knowledge-hub` vào Vercel
2. **Root Directory:** `apps/admin`, Framework Preset: **Vite**
3. Thêm Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

## Chuẩn bị Supabase

Chạy file `supabase/migrations/0001_init.sql` trong SQL Editor của Supabase project
để tạo toàn bộ bảng + RLS policies + seed data mẫu.
