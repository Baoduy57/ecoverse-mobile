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

```

eco-mobile/
├── app.json # Expo configuration
├── App.tsx # Root component
├── index.ts # Entry point
├── package.json # Dependencies & scripts
├── tsconfig.json # TypeScript config (path aliases)
├── babel.config.js # Babel config
│
├── assets/ # Root assets (icon, splash)
│
└── src/
├── components/ # Reusable UI components
│ ├── common/ # Button, Card, Input...
│ ├── ai/ # AI scanner components
│ ├── dashboard/ # Dashboard components
│ └── game/ # Game components
│
├── screens/ # Screen components (pages)
│ ├── auth/ # LoginScreen
│ ├── onboarding/ # OnboardingScreen
│ ├── splash/ # SplashScreen
│ ├── home/ # HomeScreen
│ ├── dashboard/ # DashboardScreen
│ ├── ai/ # AIScannerScreen
│ ├── game/ # GameScreen
│ └── profile/ # ProfileScreen
│
├── navigation/ # Navigation setup
│ ├── AppNavigator.tsx # Main app navigation
│ └── AuthNavigator.tsx # Auth flow navigation
│
├── services/ # External services
│ ├── api/ # API clients (axios)
│ │ ├── client.ts # Base axios instance
│ │ ├── auth.ts # Auth API
│ │ ├── game.ts # Game API
│ │ ├── vision.ts # AI Vision API
│ │ └── ...
│ └── storage/ # AsyncStorage wrapper
│
├── store/ # Zustand state management
│ ├── authStore.ts # Auth state (token, user)
│ ├── gameStore.ts # Game state (points, level)
│ ├── rewardStore.ts # Rewards state
│ └── notificationStore.ts
│
├── hooks/ # Custom React hooks
│ └── (chưa có - sẽ thêm useAuth, useGame...)
│
├── utils/ # Utility functions
│ ├── helpers.ts # General helpers
│ └── validators.ts # Validation functions
│
├── constants/ # App constants
│ ├── config.ts # API URLs, app config
│ ├── routes.ts # Route names
│ └── game.ts # Game constants
│
├── types/ # TypeScript type definitions
│ ├── user.ts
│ ├── game.ts
│ ├── reward.ts
│ └── ...
│
├── theme/ # Theme system
│ ├── colors.ts # Color palette
│ ├── spacing.ts # Spacing scale
│ ├── typography.ts # Font styles
│ └── paperTheme.ts # React Native Paper theme
│
├── contexts/ # React contexts
│ └── AuthContext.tsx
│
└── assets/ # Source assets
├── images/ # PNG, JPG images
└── sounds/ # Audio files

````

### Path Aliases (tsconfig.json)

```typescript
// Import tuyệt đối thay vì relative path
import { Button } from '@/components/common';
import { AuthService } from '@services/api';
import { useAuthStore } from '@store/authStore';
import { COLORS } from '@theme';
````

---

## 📝 Coding Convention

### 1. Naming Conventions

**Files & Folders:**

- Components: `PascalCase.tsx` (Button.tsx, GameCard.tsx)
- Utils/Hooks: `camelCase.ts` (useAuth.ts, helpers.ts)
- Folders: `lowercase` or `kebab-case`

**Variables & Functions:**

```typescript
// Variables: camelCase
const userName = 'John';
const totalPoints = 100;

// Constants: UPPER_SNAKE_CASE
const MAX_POINTS = 1000;
const API_BASE_URL = 'https://api.example.com';

// Functions: camelCase (verb + noun)
const getUserData = () => {};
const handleSubmit = () => {};

// Components: PascalCase
const UserProfile = () => {};
```

**Types & Interfaces:**

```typescript
// Interfaces: PascalCase
interface User {
  id: string;
  name: string;
}

// Types: PascalCase
type GameStatus = 'idle' | 'playing' | 'paused';

// Enums: PascalCase
enum WasteType {
  Organic = 'organic',
  Recyclable = 'recyclable',
  Hazardous = 'hazardous',
}
```

### 2. Component Structure

```typescript
// 1. Imports (thư viện -> local)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/common';
import { useAuthStore } from '@store/authStore';

// 2. Types/Interfaces
interface Props {
  title: string;
  onPress: () => void;
}

// 3. Component
export const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  // 3.1 State & Store
  const [count, setCount] = useState(0);
  const { user } = useAuthStore();

  // 3.2 Effects
  useEffect(() => {
    // side effects
  }, []);

  // 3.3 Handlers
  const handlePress = () => {
    setCount(count + 1);
    onPress();
  };

  // 3.4 Render
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
      <Button onPress={handlePress} />
    </View>
  );
};

// 4. Styles (cuối file)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

### 3. Import Order

```typescript
// 1. React & React Native
import React from 'react';
import { View, Text } from 'react-native';

// 2. External libraries
import { useNavigation } from '@react-navigation/native';

// 3. Aliases (@/ paths)
import { Button } from '@/components/common';
import { useAuthStore } from '@store/authStore';
import { COLORS } from '@theme';

// 4. Types
import type { User } from '@types/user';
```

### 4. Code Quality Rules

- ✅ Luôn định nghĩa types cho props, state, API response
- ✅ Sử dụng path aliases (`@/`) thay vì relative paths
- ✅ Export named thay vì default (dễ refactor)
- ✅ Tách logic phức tạp thành custom hooks
- ❌ Không để `console.log()` trong production code
- ❌ Không dùng `any` type
- ❌ Không hardcode giá trị (dùng constants)

---

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
```

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
