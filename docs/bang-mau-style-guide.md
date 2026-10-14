# Bảng Màu & Style Guide

**Sản phẩm:** HVAC Knowledge Hub  
**Phiên bản:** 1.0  
**Phạm vi:** Mobile React Native và Admin CMS React

## 1. Hướng thiết kế đã chốt

Giao diện sử dụng phong cách **Premium Neumorphic**: nền xanh nhạt, khối nổi/chìm mềm, điểm nhấn xanh dương gradient và nhận diện Premium màu vàng gold. Phong cách phải hiện đại nhưng vẫn phù hợp với thợ kỹ thuật sử dụng ngoài hiện trường.

Ba nguyên tắc ưu tiên:

1. **Tra cứu nhanh:** tìm kiếm, mã lỗi và bảng tra luôn nằm trong tầm thao tác ngắn.
2. **Dễ đọc trong điều kiện thực tế:** chữ rõ, nút lớn, tương phản tốt; bóng đổ không được là tín hiệu duy nhất.
3. **Nhất quán giữa mobile và admin:** dùng chung token màu, typography, spacing, trạng thái và ngôn ngữ component.

> [!NOTE]
> Neumorphism là lớp nhận diện, không thay thế cấu trúc giao diện. Form, trạng thái lỗi, focus, selected và disabled vẫn phải có màu, viền hoặc icon rõ ràng.

## 2. Bảng màu chủ đạo

### 2.1. Màu thương hiệu

| Token | Giá trị | Vai trò |
|---|---|---|
| `brand-bg` | `#E2E8F3` | Nền chính |
| `brand-blue-400` | `#5B93FF` | Đầu gradient |
| `brand-blue-600` | `#2F63E7` | Cuối gradient |
| `brand-blue-700` | `#234FC2` | Hover, chữ link |
| `premium-gold-300` | `#F8D66D` | Đầu gradient Premium |
| `premium-gold-500` | `#D7A928` | Cuối gradient Premium |
| `premium-ink` | `#5A4100` | Chữ trên nền vàng nhạt |

**Gradient chính**

```css
background: linear-gradient(135deg, #5B93FF 0%, #2F63E7 100%);
```

**Gradient Premium**

```css
background: linear-gradient(135deg, #F8D66D 0%, #D7A928 100%);
```

### 2.2. Màu nền, chữ và viền

| Token | Giá trị | Vai trò |
|---|---|---|
| `surface` | `#E2E8F3` | Card và nền đồng nhất |
| `surface-soft` | `#EDF2FA` | Vùng nội dung phụ |
| `surface-strong` | `#D4DDEB` | Thanh phân tách |
| `text-primary` | `#182033` | Tiêu đề, nội dung chính |
| `text-secondary` | `#526078` | Mô tả, metadata |
| `text-muted` | `#718096` | Placeholder, phụ chú |
| `text-on-primary` | `#FFFFFF` | Chữ trên nền xanh |
| `border-subtle` | `#C7D1E1` | Viền kiểm soát |
| `focus-ring` | `#1E54D8` | Focus bàn phím |

Không dùng `text-muted` cho thông tin kỹ thuật quan trọng, mã lỗi, thông số hoặc hướng dẫn an toàn.

### 2.3. Màu trạng thái

| Trạng thái | Nền | Nội dung |
|---|---|---|
| Thành công | `#DDF5EA` | `#176B4A` |
| Cảnh báo | `#FFF0CC` | `#7A4A00` |
| Lỗi/nguy hiểm | `#FDE5E5` | `#9F2F2F` |
| Thông tin | `#E3ECFF` | `#234FC2` |
| Offline | `#E8EAF0` | `#4E596B` |

Mỗi trạng thái phải đi kèm **nhãn hoặc icon**, không chỉ dùng màu.

## 3. Typography

Font đề xuất: **Be Vietnam Pro**. Nếu chưa tải được font, dùng fallback `Inter`, `system-ui`, `sans-serif`.

| Style | Cỡ / line-height | Weight | Dùng cho |
|---|---|---:|---|
| Display | `32 / 40` | 700 | Hero, số liệu lớn |
| H1 | `28 / 36` | 700 | Tiêu đề màn hình |
| H2 | `22 / 30` | 700 | Tiêu đề section |
| H3 | `18 / 26` | 600 | Card, nhóm nội dung |
| Body L | `17 / 26` | 400 | Nội dung kỹ thuật |
| Body | `15 / 23` | 400 | Nội dung mặc định |
| Label | `14 / 20` | 600 | Nút, input, tab |
| Caption | `12 / 18` | 500 | Metadata, chú thích |

Quy tắc nội dung:

- Mã lỗi như `E1`, `U4` dùng weight 700 và không xuống dòng.
- Thông số kỹ thuật dùng số tabular nếu font hỗ trợ.
- Không viết hoa toàn bộ câu; chỉ dùng cho nhãn rất ngắn.
- Nội dung xử lý sự cố dùng danh sách bước, mỗi bước bắt đầu bằng động từ.

## 4. Spacing, kích thước và hình khối

Dùng hệ spacing nền **4 px**, với nhịp chính **8 px**.

| Token | Giá trị | Ứng dụng |
|---|---:|---|
| `space-1` | 4 px | Khoảng icon nhỏ |
| `space-2` | 8 px | Khoảng trong nhóm |
| `space-3` | 12 px | Nội dung compact |
| `space-4` | 16 px | Padding mặc định |
| `space-5` | 20 px | Card mobile |
| `space-6` | 24 px | Khoảng giữa section |
| `space-8` | 32 px | Khối nội dung lớn |
| `space-10` | 40 px | Hero, page header |

### Bo góc

- Input, button, chip: `12 px`.
- Card tiêu chuẩn: `16 px`.
- Card nổi bật, modal: `20 px`.
- Bottom sheet: `24 px 24 px 0 0`.
- Avatar và icon button tròn: `999 px`.

### Kích thước thao tác

- Vùng chạm tối thiểu: `48 × 48 px`.
- Nút chính mobile: cao `52 px`.
- Input mobile: cao `52–56 px`.
- Tab bar mobile: cao `72–80 px`, chưa tính safe area.
- Hàng dữ liệu admin: `44 px` compact hoặc `52 px` comfortable.

## 5. Công thức Neumorphic

### 5.1. Trạng thái nổi

Dùng cho card chính, nút phụ và nhóm điều khiển.

```css
box-shadow:
  10px 10px 24px rgba(164, 177, 198, 0.52),
  -10px -10px 24px rgba(255, 255, 255, 0.82);
```

### 5.2. Trạng thái chìm

Dùng cho search box, vùng nhập liệu và control đang được chọn.

```css
box-shadow:
  inset 5px 5px 12px rgba(164, 177, 198, 0.48),
  inset -5px -5px 12px rgba(255, 255, 255, 0.78);
```

### 5.3. Trạng thái nhấn

```css
box-shadow:
  inset 3px 3px 8px rgba(164, 177, 198, 0.52),
  inset -3px -3px 8px rgba(255, 255, 255, 0.72);
transform: translateY(1px);
```

### 5.4. Giới hạn sử dụng

- Mỗi màn hình chỉ nên có một cấp bóng nổi chủ đạo.
- Card lồng nhau dùng viền hoặc thay đổi nền, không chồng nhiều lớp bóng.
- Nút chính dùng gradient xanh; không dùng bóng để biểu đạt khả năng bấm.
- Khi `prefers-reduced-motion` được bật, bỏ hiệu ứng phóng/thu và giảm transition.
- Trên thiết bị cấu hình thấp, ưu tiên bóng đơn giản; không dùng blur nền diện rộng.

## 6. Component cốt lõi

### Button

| Biến thể | Style | Mục đích |
|---|---|---|
| Primary | Gradient xanh, chữ trắng | Hành động chính |
| Secondary | Nền `brand-bg`, bóng nổi | Hành động phụ |
| Tertiary | Không nền, chữ xanh | Hành động nhẹ |
| Danger | Nền đỏ nhạt, chữ đỏ đậm | Xóa, hủy nguy hiểm |
| Premium | Gradient gold, chữ `premium-ink` | Nâng cấp, nội dung khóa |

Mỗi nút có đủ `default`, `hover`, `pressed`, `focus`, `loading` và `disabled`. Nút loading giữ nguyên chiều rộng để layout không giật.

### Input và search

- Label luôn hiển thị phía trên; placeholder không thay cho label.
- Search chính dùng icon tìm kiếm bên trái và nút xóa bên phải.
- Lỗi nhập liệu hiển thị viền đỏ, icon và câu hướng dẫn sửa.
- Ô nhập OTP tách theo chữ số nhưng hỗ trợ paste toàn bộ mã.

### Card

- Card tài liệu: thumbnail, loại tài liệu, tiêu đề, hãng/model, trạng thái tải offline.
- Card mã lỗi: mã lỗi nổi bật, mô tả ngắn, hãng và model áp dụng.
- Card Premium: badge gold, lý do khóa và nút nâng cấp rõ ràng.
- Toàn bộ card có thể bấm thì phải có trạng thái pressed và nhãn truy cập.

### Badge và chip

- Badge dùng cho `Premium`, `Mới`, `Offline`, `Đã lưu`.
- Filter chip có hai trạng thái selected/unselected rõ bằng màu, viền và icon check.
- Không đặt quá ba badge trên một card.

### Feedback

- Toast cho xác nhận ngắn, tự đóng.
- Inline message cho lỗi gắn với trường hoặc nội dung.
- Dialog chỉ dùng cho hành động cần xác nhận.
- Skeleton giữ cấu trúc trang; spinner chỉ dùng cho vùng nhỏ hoặc thao tác ngắn.

## 7. Layout mobile

### Khung chung

- Dùng lưới 4 cột, gutter `16 px`, lề màn hình `16–20 px`.
- Header gọn, giữ tìm kiếm hoặc hành động quan trọng trong vùng nhìn đầu tiên.
- Nội dung cuộn theo chiều dọc; không tạo scroll ngang trừ bảng số liệu có chủ đích.
- Bottom navigation cố định gồm 5 tab: **Trang chủ, Tra cứu, Mã lỗi, Bảng tra, Cá nhân**.
- Tôn trọng safe area ở đầu và cuối màn hình.

### Trang chủ

1. Header chào người dùng và trạng thái online/offline.
2. Search box lớn: mã lỗi, model hoặc từ khóa.
3. Lối tắt: Tra mã lỗi, Bảng tra, Tài liệu đã lưu, Tải offline.
4. Mục gần đây và tài liệu đề xuất.
5. Banner chỉ hiển thị khi có nội dung thực sự ưu tiên.

### Tra cứu tài liệu

Luồng chuẩn: **Hãng → Dòng máy → Model → Danh sách tài liệu → Trình đọc**. Mỗi cấp có breadcrumb hoặc tiêu đề rõ để người dùng biết vị trí hiện tại. Bộ lọc đặt trong bottom sheet trên mobile.

### Mã lỗi

- Search mã lỗi là điều khiển đầu tiên.
- Kết quả hiển thị: ý nghĩa, nguyên nhân, mức độ, model áp dụng và quy trình kiểm tra.
- Bước xử lý dùng checklist; cảnh báo điện và môi chất đặt trước thao tác.
- Phần Premium cho biết nội dung nào bị khóa, không che mờ toàn bộ thông tin cơ bản.

### Bảng tra nhanh

Bảng gas, áp suất và đổi đơn vị là dữ liệu phía app, không nằm trong Admin CMS. Tab hoặc segmented control chuyển nhóm dữ liệu. Giá trị nhập và kết quả phải dễ sao chép.

### Trạng thái bắt buộc

Mỗi màn hình dữ liệu phải có đủ:

- Loading hoặc skeleton.
- Empty state có hành động tiếp theo.
- Error có nút thử lại.
- Offline có thông tin dữ liệu gần nhất.
- Permission denied hoặc Premium locked khi áp dụng.

## 8. Layout Admin CMS

### Khung desktop

- Sidebar cố định: rộng `248 px`, có chế độ thu gọn `72 px`.
- Top bar: tiêu đề, tìm kiếm, thông báo và tài khoản.
- Content container tối đa `1440 px`; padding `24–32 px`.
- Page header gồm tiêu đề, mô tả ngắn và hành động chính bên phải.

Chín phân hệ:

1. Dashboard.
2. Quản lý bài viết.
3. Quản lý mã lỗi.
4. Quản lý hãng & model.
5. Checklist bảo trì.
6. Quản lý người dùng.
7. Gói & thanh toán.
8. Thư viện media.
9. Thông báo & banner.

### Danh sách và bảng dữ liệu

- Toolbar gồm search, filter, sort, density và hành động hàng loạt khi cần.
- Header bảng sticky trên danh sách dài.
- Cột hành động đặt cuối; menu ba chấm cho thao tác phụ.
- Phân trang hiển thị số dòng và tổng kết quả.
- Trạng thái Premium dùng badge gold, không dùng icon khóa đơn lẻ.

### Form biên tập

- Form dài chia section hoặc step, không nhồi trong một card.
- Hành động **Lưu nháp** và **Xuất bản** phải khác cấp rõ ràng.
- Hiển thị cảnh báo rời trang khi có thay đổi chưa lưu.
- Upload PDF đi Cloudflare R2; ảnh và video đi Cloudinary. UI cần hiển thị tiến trình, lỗi và khả năng thử lại.

### Responsive admin

| Breakpoint | Hành vi |
|---|---|
| `< 768 px` | Sidebar thành drawer, bảng thành card/list |
| `768–1199 px` | Sidebar thu gọn, toolbar có thể wrap |
| `≥ 1200 px` | Layout đầy đủ, sidebar cố định |

Admin hỗ trợ mobile cho thao tác nhanh, nhưng quy trình biên tập dài ưu tiên desktop.

## 9. Chuyển động và phản hồi

- Micro-interaction: `120–180 ms`.
- Mở modal hoặc bottom sheet: `200–280 ms`.
- Dùng easing `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Không dùng animation lặp vô hạn ngoài loading.
- Thành công sau lưu cần phản hồi ngay tại khu vực hành động; không phụ thuộc riêng vào toast.

## 10. Khả năng tiếp cận

- Mục tiêu tương phản: tối thiểu `4.5:1` cho chữ thường và `3:1` cho chữ lớn hoặc thành phần giao diện.
- Không đặt chữ trắng trên phần sáng của gradient gold.
- Focus ring phải nhìn thấy rõ và không bị `outline: none` xóa bỏ.
- Icon đơn lẻ phải có nhãn truy cập; icon trang trí bị ẩn khỏi screen reader.
- Thứ tự focus đi theo thứ tự đọc.
- Hỗ trợ tăng cỡ chữ mà không cắt nội dung hoặc che nút.
- Màu đỏ, vàng, xanh luôn đi kèm văn bản hoặc biểu tượng.
- Nội dung kỹ thuật nguy hiểm không đặt trong tooltip hoặc chỉ hiển thị khi hover.

> [!WARNING]
> Các cặp màu phải được kiểm tra lại bằng công cụ contrast trong component thực tế, vì gradient, opacity và nền phía sau có thể làm thay đổi kết quả.

## 11. Ngôn ngữ giao diện

- Dùng tiếng Việt rõ, ngắn và trực tiếp.
- Nút mô tả hành động: **Tra cứu**, **Lưu offline**, **Mở tài liệu**, **Nâng cấp Premium**.
- Empty state cho biết vì sao trống và người dùng có thể làm gì tiếp theo.
- Lỗi kỹ thuật hiển thị câu dễ hiểu trước; mã lỗi hệ thống đặt ở phần chi tiết.
- Xác nhận thao tác nguy hiểm nêu rõ đối tượng bị tác động.

Ví dụ:

| Không nên | Nên dùng |
|---|---|
| Có lỗi xảy ra | Không tải được tài liệu. Hãy thử lại. |
| Submit | Lưu bài viết |
| Delete? | Xóa bài viết “…”? |
| No data | Chưa có tài liệu đã lưu |

## 12. Design tokens cho web

```css
:root {
  --color-bg: #E2E8F3;
  --color-surface-soft: #EDF2FA;
  --color-surface-strong: #D4DDEB;

  --color-primary-start: #5B93FF;
  --color-primary-end: #2F63E7;
  --color-primary-hover: #234FC2;

  --color-premium-start: #F8D66D;
  --color-premium-end: #D7A928;
  --color-premium-ink: #5A4100;

  --color-text: #182033;
  --color-text-secondary: #526078;
  --color-text-muted: #718096;
  --color-border: #C7D1E1;
  --color-focus: #1E54D8;

  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-pill: 999px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  --shadow-raised:
    10px 10px 24px rgba(164, 177, 198, 0.52),
    -10px -10px 24px rgba(255, 255, 255, 0.82);
  --shadow-inset:
    inset 5px 5px 12px rgba(164, 177, 198, 0.48),
    inset -5px -5px 12px rgba(255, 255, 255, 0.78);

  --gradient-primary:
    linear-gradient(135deg, #5B93FF 0%, #2F63E7 100%);
  --gradient-premium:
    linear-gradient(135deg, #F8D66D 0%, #D7A928 100%);
}
```

Các component không khai báo màu trực tiếp ngoài file token. Mọi thay đổi nhận diện phải đi qua token để mobile và web không lệch nhau.

## 13. Design tokens cho React Native

```ts
export const colors = {
  background: '#E2E8F3',
  surfaceSoft: '#EDF2FA',
  surfaceStrong: '#D4DDEB',
  primaryStart: '#5B93FF',
  primaryEnd: '#2F63E7',
  primaryPressed: '#234FC2',
  premiumStart: '#F8D66D',
  premiumEnd: '#D7A928',
  premiumInk: '#5A4100',
  textPrimary: '#182033',
  textSecondary: '#526078',
  textMuted: '#718096',
  border: '#C7D1E1',
  focus: '#1E54D8',
  successBg: '#DDF5EA',
  successText: '#176B4A',
  warningBg: '#FFF0CC',
  warningText: '#7A4A00',
  dangerBg: '#FDE5E5',
  dangerText: '#9F2F2F',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  pill: 999,
} as const;
```

Với React Native, hai lớp bóng sáng/tối có thể cần hai view lồng nhau hoặc thư viện hỗ trợ shadow đa lớp. Trên Android, luôn kiểm tra kết quả thật; nếu bóng không ổn định, ưu tiên viền nhẹ, nền phân cấp và `elevation` thấp thay vì cố mô phỏng web.

## 14. Cấu trúc component đề xuất

```text
ui/
├── tokens/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── shadows.ts
├── primitives/
│   ├── Button
│   ├── IconButton
│   ├── TextField
│   ├── SearchField
│   ├── Card
│   ├── Badge
│   ├── Chip
│   └── Divider
├── feedback/
│   ├── Alert
│   ├── Toast
│   ├── Skeleton
│   ├── EmptyState
│   └── ErrorState
└── domain/
    ├── DocumentCard
    ├── ErrorCodeCard
    ├── PremiumGate
    ├── OfflineStatus
    └── MaintenanceChecklist
```

Primitive không chứa logic nghiệp vụ. Component domain kết hợp primitive và nhận dữ liệu qua props. Trạng thái Premium, quyền truy cập và offline do lớp nghiệp vụ quyết định, không hard-code trong giao diện.

## 15. Checklist nghiệm thu giao diện

### Trước khi merge

- [ ] Chỉ dùng màu, spacing và radius từ token.
- [ ] Component có đủ trạng thái default, pressed, focus, loading và disabled.
- [ ] Vùng chạm trên mobile đạt tối thiểu `48 × 48 px`.
- [ ] Không dùng bóng hoặc màu làm tín hiệu duy nhất.
- [ ] Text dài và tiếng Việt có dấu không vỡ layout.
- [ ] Kiểm tra light mode đã chốt; dark mode chỉ triển khai khi có bộ token riêng.
- [ ] Màn hình dữ liệu có loading, empty, error và offline.
- [ ] Nội dung Premium khóa đúng phạm vi, không chặn nhầm nội dung free.
- [ ] Keyboard và screen reader thao tác được các luồng chính.
- [ ] Admin hoạt động ở ba nhóm breakpoint.

### Trước khi release

- [ ] Kiểm tra trên ít nhất một thiết bị Android cấu hình trung bình và một thiết bị iOS.
- [ ] Kiểm tra ngoài trời hoặc màn hình độ sáng thấp với luồng tra mã lỗi.
- [ ] Kiểm tra cỡ chữ hệ thống lớn.
- [ ] Kiểm tra mạng chậm, mất mạng và tải lại.
- [ ] Kiểm tra upload PDF, ảnh và video với trạng thái tiến trình và lỗi.
- [ ] Kiểm tra quyền free/Premium bằng tài khoản thật của từng tier.
- [ ] Kiểm tra analytics cho tìm kiếm, mở tài liệu, lưu offline và nâng cấp.

## 16. Quy tắc thay đổi design system

Mọi thay đổi màu, typography, spacing hoặc component cốt lõi phải được cập nhật trong tài liệu này và trong token dùng chung. Không sửa riêng một màn hình nếu thay đổi đó có ý nghĩa toàn hệ thống. Component mới chỉ được thêm khi primitive hiện có không thể đáp ứng mà không tạo biến thể khó duy trì.
