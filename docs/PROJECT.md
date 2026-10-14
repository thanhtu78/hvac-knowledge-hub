# HVAC Knowledge Hub — Kế hoạch tổng thể

> Tài liệu chốt định hướng dự án (cập nhật 15/10/2026).
> Design system chi tiết: xem [Bảng Màu & Style Guide](./bang-mau-style-guide.md).

## 1. Định vị

Nền tảng tra cứu tài liệu kỹ thuật điện lạnh (HVAC/R) cho thợ hiện trường.
Mục tiêu: **mở app là tra được đáp án trong 30 giây**, kể cả khi đang đứng trước dàn nóng ngoài trời.

## 2. Đối tượng người dùng (theo ưu tiên)

1. Kỹ thuật viên sửa chữa / bảo trì — tra mã lỗi, sơ đồ, thông số ngoài hiện trường
2. Kỹ sư thiết kế — bảng tính, tiêu chuẩn, catalogue
3. Học viên / học nghề — tài liệu học theo chủ đề

## 3. Tính năng MVP

- **Thư viện tài liệu:** hãng → dòng máy → model → tài liệu (PDF)
- **Tra mã lỗi:** nhập mã → nguyên nhân + các bước xử lý dạng checklist
- **Bảng tra nhanh:** gas lạnh, áp suất, đổi đơn vị (dữ liệu tĩnh đóng gói trong app)
- **Checklist** quy trình bảo trì / bảo dưỡng chuẩn
- **Offline mode** (bắt buộc vì hiện trường hay mất mạng)

## 4. Lộ trình

- **Phase 1 (MVP):** frontend web + Admin CMS (deploy Vercel), 2 hãng phổ biến nhất VN (Daikin, Panasonic) + tra mã lỗi + offline
- **Phase 1.5:** mobile native Android / iOS (React Native)
- **Phase 2:** AI chatbot RAG hỏi đáp kỹ thuật
- **Phase 3:** Cộng đồng (chia sẻ case thực tế, Q&A)

## 5. Cấu trúc app

### Frontend web trước (React, deploy Vercel)

Triển khai bản web trước để ra mắt nhanh; toàn bộ 5 tab bên dưới làm bản web responsive trước, mobile native (Android/iOS) làm sau.

### Mobile native sau (React Native) — 5 tab

1. **Trang chủ:** thanh tìm kiếm lớn, hãng phổ biến, tài liệu mới
2. **Tra cứu:** hãng → dòng máy → model → danh sách tài liệu → xem PDF
3. **Mã lỗi:** chọn hãng + nhập mã → nguyên nhân + checklist xử lý
4. **Bảng tra:** gas lạnh, đổi nhiệt độ, công suất
5. **Cá nhân:** hồ sơ, nâng cấp Premium, tài liệu đã lưu, lịch sử tra cứu, tải offline, cài đặt

### Web (React)

- Bản tra cứu trên desktop + **Admin CMS**

## 6. Tech stack

| Thành phần       | Công nghệ                          |
|------------------|------------------------------------|
| Mobile           | React Native                       |
| Web / Admin CMS  | React                              |
| Backend / DB     | Supabase (PostgreSQL + Auth + pgvector) |
| Lưu trữ PDF      | Cloudflare R2 (rẻ, không phí egress) |
| Ảnh / video      | Cloudinary (optimize, streaming)   |
| Deploy web + CMS | Vercel                             |

Cấu trúc repo (monorepo — pnpm workspaces + Turborepo):

```
hvac-knowledge-hub/
├── apps/
│   ├── web/              # React frontend user (Vercel) — làm trước
│   │   └── src/
│   │       ├── pages/        # Trang chủ, Tra cứu, Mã lỗi, Bảng tra, Cá nhân
│   │       ├── components/   # UI theo style Neumorphic
│   │       └── hooks/
│   ├── admin/            # React Admin CMS (Vercel) — 9 phân hệ
│   │   └── src/
│   │       └── pages/        # dashboard, articles, error-codes, brands,
│   │                         # checklists, users, billing, media, notifications
│   └── mobile/           # React Native Android/iOS — làm sau (phase 1.5)
├── packages/
│   ├── ui/               # Design system Neumorphic dùng chung (web)
│   ├── shared/           # types, constants, utils dùng chung
│   └── supabase/         # client + queries + types từ DB
├── supabase/
│   ├── migrations/       # SQL migrations
│   └── seed.sql
└── docs/
    ├── PROJECT.md
    └── bang-mau-style-guide.md
```

## 7. Data model chính

- `Brand` → `ProductLine` → `Model` → `Document`
- `ErrorCode`: mã lỗi, hãng, nguyên nhân, các bước xử lý
- `Document`: tiêu đề, file PDF (R2), hãng/model liên kết, cờ `is_premium`
- `User`: số điện thoại, trạng thái premium
- (Phase 2) `document_chunks`: embeddings lưu bằng pgvector

## 8. Admin CMS — 9 phân hệ đã chốt

1. Dashboard tổng quan (biểu đồ tra cứu, user, bài xem nhiều)
2. Quản lý bài viết (soạn thảo, upload PDF, gắn hãng/model, đánh dấu Premium)
3. Quản lý mã lỗi
4. Quản lý hãng & model
5. Checklist bảo trì
6. Quản lý người dùng (cấp / hủy premium thủ công, phân quyền)
7. Gói & thanh toán (gói premium, giao dịch, đối soát)
8. Thư viện media (Cloudinary + R2)
9. Thông báo & banner (push notification)

*Tạm chưa làm:* duyệt nội dung cộng đồng, cấu hình hệ thống.
*Bảng tra nhanh* không cần trên admin — là dữ liệu tĩnh phía mobile app.

## 9. Monetization — Freemium

- **Free:** xem tất cả bài viết **trừ** bài admin đánh dấu premium
- **Premium:** xem tất cả
- Cổng thanh toán VN (VietQR / MoMo / chuyển khoản): triển khai khi làm billing

## 10. Authentication

- Đăng nhập bằng **Google OAuth** (Supabase Auth) — chốt ngày 15/10/2026
- Lý do: **0 chi phí SMS** (bỏ OTP), user không cần nhớ/quên mật khẩu, thợ Android bấm 1 chạm là xong
- SĐT thu thập thêm trong profile (không bắt buộc), phục vụ liên hệ & hỗ trợ
- Admin CMS đăng nhập riêng bằng email + mật khẩu (đã làm)
- Cấu hình: Google Cloud Console → tạo OAuth Client ID → dán vào Supabase Dashboard → Authentication → Providers → Google

## 11. AI chatbot RAG (Phase 2)

- Pipeline: bài viết / PDF → chunking → embeddings → lưu pgvector (Supabase)
- User hỏi → similarity search → LLM trả lời **kèm trích dẫn nguồn**
- Guardrail bắt buộc: chỉ trả lời trong phạm vi tài liệu đã duyệt; không chắc thì từ chối (sai thông số kỹ thuật có thể gây hỏng máy / nguy hiểm)
- Nút đánh giá 👍/👎; rate-limit user free, ưu tiên premium

## 12. Chiến lược nội dung & bản quyền

- Tài liệu gốc của hãng (manual, datasheet): **link về trang hãng**, không re-upload (vấn đề bản quyền)
- Nội dung mã lỗi + cách xử lý: **tự biên soạn** (nội dung mình viết là của mình)

## 13. UI / UX

- Style: **Premium Neumorphic** — nền xanh nhạt `#E2E8F3`, bóng nổi/chìm mềm, accent xanh dương gradient (`#5B93FF` → `#2F63E7`), badge premium vàng gold
- Font: Be Vietnam Pro (hỗ trợ tiếng Việt)
- Nguyên tắc mobile: nút to, chữ lớn, tương phản cao (đọc dưới nắng), dark mode, trạng thái offline luôn hiển thị rõ

## 14. Ý tưởng đang cân nhắc (chưa chốt)

- Quét QR / tem trên máy để ra đúng model + tài liệu
- Đăng nhập / chia sẻ qua Zalo (thói quen thợ VN)
- Log mọi lượt tìm kiếm để ưu tiên biên soạn nội dung
- Gói team cho cửa hàng / đại lý (quản lý nhiều thợ)
