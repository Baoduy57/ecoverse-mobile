# 🌱 EcoVerse Mobile App

> Ứng dụng giáo dục gamification giúp trẻ em học cách phân loại rác thải thông qua mini games và đổi quà.

## 📋 Mục Lục

- [Giới Thiệu Dự Án](#-giới-thiệu-dự-án)
- [Kiến Trúc & Stack Công Nghệ](#-kiến-trúc--stack-công-nghệ)
- [Cài Đặt & Chạy Dự Án](#-cài-đặt--chạy-dự-án)
- [Quy Trình Development](#-quy-trình-development)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Coding Convention](#-coding-convention)

---

## 🎯 Giới Thiệu Dự Án

**EcoVerse Mobile** là ứng dụng di động dành cho học sinh (6-15 tuổi) học về bảo vệ môi trường và phân loại rác thải thông qua gamification.

### 🎮 Tính Năng Chính

- **AI Scanner**: Quét ảnh rác thải bằng Camera/Gallery và nhận gợi ý phân loại
- **Mini Games**: Trò chơi kéo thả phân loại rác tương tác (Drag & Drop)
- **Hệ Thống Điểm**: Tích điểm qua từng hoạt động và nâng level
- **Đổi Quà**: Đổi điểm lấy quà (cần phụ huynh xác nhận qua Web)
- **Dashboard**: Theo dõi tiến độ học tập, điểm số, và thành tích
- **Profile & Avatar**: Quản lý thông tin cá nhân

### 👥 Hệ Sinh Thái

- **Mobile App**: Học sinh sử dụng để học và chơi
- **Web Platform**: Phụ huynh xác nhận đổi quà, đối tác quản lý, admin giám sát

---

## 🏗 Kiến Trúc & Stack Công Nghệ

### Technology Stack

```
Framework:        React Native 0.81.5 (Expo ~54.x)
Language:         TypeScript 5.9.2 (Strict Mode)
State:            Zustand 5.x (Global State Management)
Navigation:       React Navigation 7.x (Stack & Tab)
UI Library:       React Native Paper 5.x
Styling:          StyleSheet + Theme System
Animation:        React Native Reanimated 4.x
HTTP Client:      Axios 1.7.x
Storage:          AsyncStorage 2.x
Media:            Expo AV, Camera, Image Picker
```

### Kiến Trúc Source Code

```
┌─────────────────────────────────────────────────────────┐
│                     APP ARCHITECTURE                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────┐         ┌────────────┐                 │
│  │  Screens   │────────▶│ Navigation │                 │
│  └────────────┘         └────────────┘                 │
│        │                                                 │
│        ▼                                                 │
│  ┌────────────┐         ┌────────────┐                 │
│  │ Components │────────▶│   Theme    │                 │
│  └────────────┘         └────────────┘                 │
│        │                                                 │
│        ▼                                                 │
│  ┌────────────┐         ┌────────────┐                 │
│  │   Hooks    │────────▶│   Store    │ (Zustand)      │
│  └────────────┘         └────────────┘                 │
│        │                                                 │
│        ▼                                                 │
│  ┌────────────┐         ┌────────────┐                 │
│  │  Services  │────────▶│ API Client │ (Axios)        │
│  └────────────┘         └────────────┘                 │
│        │                                                 │
│        ▼                                                 │
│  ┌────────────┐         ┌────────────┐                 │
│  │   Utils    │         │  Constants │                 │
│  └────────────┘         └────────────┘                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Module Pattern

- **Feature-based Organization**: Code được tổ chức theo tính năng (auth, game, dashboard...)
- **Barrel Exports**: Mỗi folder có `index.ts` để export tập trung
- **Path Aliases**: Sử dụng `@/` để import tuyệt đối, tránh relative path hell
- **Type Safety**: TypeScript strict mode, định nghĩa types riêng trong `/types`
- **Separation of Concerns**: UI, Logic, State, Service tách biệt rõ ràng

---

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống

```bash
Node.js:  >= 18.x
npm:      >= 9.x
Expo:     ~54.x (tự động cài khi npm install)
```

### Bước 1: Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd eco-mobile

# Cài đặt dependencies
npm install
```

### Bước 2: Cấu Hình Environment (Optional)

```bash
# Nếu cần cấu hình API endpoint hoặc keys
cp .env.example .env
# Sau đó chỉnh sửa .env theo môi trường của bạn
```

### Bước 3: Chạy Ứng Dụng

```bash
# Chạy development server
npm start

# Hoặc chạy trực tiếp trên platform
npm run android    # Android emulator/device
npm run ios        # iOS simulator (chỉ macOS)
npm run web        # Browser
```

**Lưu ý**: Sau khi chạy `npm start`, quét QR code bằng Expo Go app trên điện thoại hoặc nhấn `a` (Android) / `i` (iOS) để mở emulator.

---

## 🔧 Quy Trình Development

### Trước Khi Code

```bash
# Tạo branch mới từ main/develop
git checkout -b feature/ten-tinh-nang
# hoặc
git checkout -b fix/ten-loi
```

### Trong Khi Code

```bash
# Kiểm tra TypeScript errors
npm run type-check

# Format code (tự động sửa)
npm run format

# Lint code
npm run lint

# Lint và tự động fix
npm run lint:fix
```

### Trước Khi Push Code

**🚨 BẮT BUỘC chạy các lệnh sau để đảm bảo code đúng chuẩn:**

```bash
# 1. Kiểm tra TypeScript (không có lỗi type)
npm run type-check

# 2. Kiểm tra ESLint (không có lỗi lint)
npm run lint

# 3. Format code (đảm bảo format đồng nhất)
npm run format

# 4. Kiểm tra lại tất cả
npm run type-check && npm run lint
```

**✅ Checklist trước khi push:**

- [ ] `npm run type-check` - Pass (no errors)
- [ ] `npm run lint` - Pass (no errors/warnings)
- [ ] `npm run format` - Đã chạy
- [ ] Code đã test trên thiết bị/emulator
- [ ] Không có `console.log()` hoặc debug code
- [ ] Commit message đúng format

### Push Code & Pull Request

```bash
# Stage và commit
git add .
git commit -m "feat(game): thêm drag drop game component"

# Push lên remote
git push origin feature/ten-tinh-nang

# Tạo Pull Request trên GitHub/GitLab
# Chờ review và merge
```

### Commit Message Convention

```
<type>(<scope>): <message>

Types:
  feat      - Tính năng mới
  fix       - Sửa lỗi
  refactor  - Tái cấu trúc code
  style     - Format code, không đổi logic
  docs      - Cập nhật documentation
  test      - Thêm/sửa tests
  chore     - Cập nhật dependencies, config

Examples:
  feat(auth): thêm màn hình đăng nhập
  fix(game): sửa lỗi tính điểm không đúng
  refactor(api): tối ưu hóa API service
  docs(readme): cập nhật hướng dẫn cài đặt
```

```

---

## 📁 Cấu Trúc Thư Mục

eco-mobile/
├── assets/        # Icon, splash, media
├── src/
│   ├── components/   # UI components dùng chung
│   ├── screens/      # Các màn hình chính
│   ├── navigation/  # Điều hướng (Stack, Tab)
│   ├── services/    # API, AI, storage
│   ├── store/       # State management (Zustand)
│   ├── hooks/       # Custom hooks
│   ├── utils/       # Hàm tiện ích
│   ├── constants/   # Hằng số, config
│   ├── types/       # TypeScript types
│   ├── theme/       # Theme & styling
│   └── contexts/    # React Context
│
├── App.tsx        # Root component
├── app.json       # Expo config
├── package.json   # Dependencies
└── tsconfig.json  # TypeScript config
```

````


## 🧪 Testing & Quality Assurance

### Scripts Kiểm Tra

```bash
# TypeScript check
npm run type-check
# → Kiểm tra lỗi type, đảm bảo code type-safe

# ESLint
npm run lint
# → Kiểm tra code style, best practices

# Prettier format
npm run format
# → Tự động format code đồng nhất

# Tất cả trong một
npm run type-check && npm run lint && npm run format
````

### Khi Nào Chạy?

| Thời Điểm            | Lệnh                                 | Mục Đích              |
| -------------------- | ------------------------------------ | --------------------- |
| **Trong khi code**   | `npm run type-check`                 | Catch lỗi type ngay   |
| **Trước khi commit** | `npm run lint && npm run format`     | Đảm bảo code clean    |
| **Trước khi push**   | `npm run type-check && npm run lint` | ✅ Pass tất cả checks |

### Lỗi Thường Gặp & Cách Fix

```bash
# Lỗi TypeScript
Error: Property 'user' does not exist on type 'UserState'
→ Fix: Thêm property vào type definition trong /types

# Lỗi ESLint
Error: 'React' must be in scope when using JSX
→ Fix: import React from 'react';

# Lỗi Prettier
Error: Code style issues found
→ Fix: npm run format (tự động fix)
```

---

## 📚 Resources & Documentation

### Project Links

- **Figma Design**: [Link to design]
- **API Docs**: [Backend API documentation]
- **Postman Collection**: [API testing collection]

### Useful Commands

```bash
# Clear cache và restart
npm start -- --reset-cache

# Check Expo version
npx expo --version

# Update dependencies
npm update

# Audit security
npm audit
```

---

## 📞 Support & Contact

Nếu gặp vấn đề hoặc cần hỗ trợ:

1. Check [Issues](link-to-issues) để xem có ai gặp lỗi tương tự
2. Tạo issue mới với label phù hợp (bug, question, help wanted)
3. Liên hệ team lead qua [communication channel]

---

**Happy Coding! 🚀🌱**

Made with ❤️ by EcoVerse Team © 2026
