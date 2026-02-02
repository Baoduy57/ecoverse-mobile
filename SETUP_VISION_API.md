# Hướng dẫn cài đặt Google Cloud Vision API

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google của bạn
3. Nhấn vào **Select a project** ở góc trên bên trái
4. Chọn **NEW PROJECT**
5. Đặt tên project (ví dụ: "EcoVerse-Mobile")
6. Nhấn **CREATE**

## Bước 2: Kích hoạt Vision API

1. Trong Google Cloud Console, vào menu ☰ → **APIs & Services** → **Library**
2. Tìm kiếm "Vision API"
3. Chọn **Cloud Vision API**
4. Nhấn **ENABLE**

## Bước 3: Tạo API Key

1. Vào menu ☰ → **APIs & Services** → **Credentials**
2. Nhấn **+ CREATE CREDENTIALS** ở trên cùng
3. Chọn **API key**
4. API key sẽ được tạo tự động và hiển thị
5. **Copy API key này** (bắt đầu bằng "AIza...")
6. (Khuyến nghị) Nhấn **RESTRICT KEY** để cấu hình bảo mật:
   - **Application restrictions**: Chọn "Android apps" hoặc "iOS apps"
   - **API restrictions**: Chọn "Restrict key" → Chọn "Cloud Vision API"
   - Nhấn **SAVE**

## Bước 4: Thêm API Key vào Project

Mở file `src/services/api/vision.ts` và thay thế:

```typescript
// Thay dòng này:
const VISION_API_KEY = 'YOUR_GOOGLE_CLOUD_VISION_API_KEY';

// Bằng API key thật của bạn:
const VISION_API_KEY = 'AIzaSyD...'; // API key bạn vừa copy
```

**⚠️ LƯU Ý BẢO MẬT:**

- **KHÔNG** commit API key lên Git/GitHub
- Nên sử dụng environment variables:
  ```typescript
  const VISION_API_KEY = process.env.EXPO_PUBLIC_VISION_API_KEY || '';
  ```
- Tạo file `.env` (đã thêm vào `.gitignore`):
  ```
  EXPO_PUBLIC_VISION_API_KEY=AIzaSyD...
  ```

## Bước 5: Kiểm tra hoạt động

1. Chạy app: `npx expo start`
2. Vào màn Dashboard → Nhấn card "Công cụ AI"
3. Cấp quyền camera
4. Chụp ảnh một vật thể (chai nhựa, lon nhôm, thức ăn...)
5. Chờ AI phân tích
6. Kéo thả ảnh vào đúng thùng rác

## Giá cả

- **1,000 requests đầu tiên/tháng**: MIỄN PHÍ
- Sau đó: $1.5 / 1,000 requests
- Chi tiết: [Vision API Pricing](https://cloud.google.com/vision/pricing)

## Xử lý lỗi thường gặp

### Lỗi 400: API key not valid

- Kiểm tra API key đã copy đúng chưa (không có khoảng trắng thừa)
- Đảm bảo đã ENABLE Vision API

### Lỗi 403: Permission denied

- Kiểm tra quota trong Google Cloud Console
- Đảm bảo billing account đã được kích hoạt (cần thẻ tín dụng)

### Lỗi 429: Quota exceeded

- Đã vượt quá 1,000 requests miễn phí
- Nâng cấp billing hoặc đợi tháng mới

## Mode Demo (không cần API key)

Nếu chưa có API key, app sẽ tự động dùng **mock data** để test:

```typescript
// File: src/services/api/vision.ts
// Khi VISION_API_KEY = 'YOUR_GOOGLE_CLOUD_VISION_API_KEY'
// → Hàm mockVisionAnalysis() sẽ được gọi
```

Mock data bao gồm:

- Chai nhựa → Thùng Recyclable (màu xanh dương)
- Vỏ chuối → Thùng Organic (màu xanh lá)
- Pin → Thùng Hazardous (màu đỏ)
- Giấy → Thùng General (màu xám)

---

**Cần hỗ trợ?** Xem [Vision API Documentation](https://cloud.google.com/vision/docs)
