/**
 * Data cho game Drag & Drop phân loại rác
 * Mỗi level có bộ câu hỏi và cấu hình riêng
 */

export enum WasteType {
  ORGANIC = 'ORGANIC',
  RECYCLABLE = 'RECYCLABLE',
  HAZARDOUS = 'HAZARDOUS',
  OTHER = 'OTHER',
}

export interface WasteItem {
  id: string;
  name: string;
  nameEn: string;
  type: WasteType;
  icon: string;
  image?: any; // Dành cho ảnh thực tế (chèn require() hoặc URL)
  description: string;
  hint?: string; // Gợi ý như "RỬA SẠCH TRƯỚC"
}

export interface BinConfig {
  type: WasteType;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface LevelConfig {
  id: number;
  title: string;
  gameModeLabel: string; // VD: "CHẾ ĐỘ VÔ TẬN"
  itemCount: number;
  timeLimit: number;
  wasteItems: WasteItem[];
}

// Labels cho header
export const GAME_HEADER_LABELS = {
  time: 'THỜI GIAN',
  combo: 'LIÊN HOÀN',
  score: 'ĐIỂM SỐ',
} as const;

// Cấu hình thùng rác - dùng chung cho tất cả level
export const BINS: BinConfig[] = [
  {
    type: WasteType.ORGANIC,
    name: 'Hữu cơ',
    icon: 'leaf',
    color: '#4CAF50',
    bgColor: 'rgba(76, 175, 80, 0.15)',
  },
  {
    type: WasteType.RECYCLABLE,
    name: 'Tái chế',
    icon: 'recycle',
    color: '#2196F3',
    bgColor: 'rgba(33, 150, 243, 0.15)',
  },
  {
    type: WasteType.HAZARDOUS,
    name: 'Nguy hại',
    icon: 'alert-circle',
    color: '#F44336',
    bgColor: 'rgba(244, 67, 54, 0.15)',
  },
  {
    type: WasteType.OTHER,
    name: 'Khác',
    icon: 'delete',
    color: '#FFC107',
    bgColor: 'rgba(255, 193, 7, 0.15)',
  },
];

// Kho dữ liệu rác - theo level
const WASTE_ITEMS_BY_LEVEL: Record<number, WasteItem[]> = {
  // Level 1 - Cơ Bản: rác thường gặp
  1: [
    {
      id: '1',
      name: 'Chai nhựa',
      nameEn: 'Plastic bottle',
      type: WasteType.RECYCLABLE,
      icon: 'bottle-soda',
      description:
        'Chai nhựa có thể tái chế để làm thành đồ chơi hoặc quần áo mới đó! Hãy nhớ tráng sạch nước trước khi bỏ vào thùng rác nhé.',
      hint: 'RỬA SẠCH TRƯỚC',
    },
    {
      id: '2',
      name: 'Vỏ chuối',
      nameEn: 'Banana peel',
      type: WasteType.ORGANIC,
      icon: 'fruit-citrus',
      description:
        'Vỏ chuối là rác hữu cơ, có thể ủ thành phân bón tuyệt vời cho cây trồng. Bạn có thể cho vào thùng rác hữu cơ nhé!',
    },
    {
      id: '3',
      name: 'Vỏ trứng',
      nameEn: 'Egg shell',
      type: WasteType.ORGANIC,
      icon: 'egg',
      description: 'Vỏ trứng giàu canxi, tốt cho cây',
    },
    {
      id: '4',
      name: 'Pin cũ',
      nameEn: 'Old battery',
      type: WasteType.HAZARDOUS,
      icon: 'battery-alert',
      description: 'Pin cũ rất độc hại, thu gom riêng',
    },
    {
      id: '5',
      name: 'Báo cũ',
      nameEn: 'Old newspaper',
      type: WasteType.RECYCLABLE,
      icon: 'newspaper',
      description:
        'Báo giấy có thể tái chế làm giấy mới, giúp tiết kiệm gỗ và bảo vệ rừng. Bỏ vào thùng rác tái chế nhé!',
    },
    {
      id: '6',
      name: 'Hộp sữa',
      nameEn: 'Milk carton',
      type: WasteType.RECYCLABLE,
      icon: 'cup',
      description: 'Hộp sữa giấy tái chế được',
      hint: 'RỬA SẠCH TRƯỚC',
    },
    {
      id: '7',
      name: 'Túi nilon',
      nameEn: 'Plastic bag',
      type: WasteType.OTHER,
      icon: 'shopping',
      description: 'Túi nilon khó phân hủy',
    },
    {
      id: '8',
      name: 'Lon nhôm',
      nameEn: 'Aluminum can',
      type: WasteType.RECYCLABLE,
      icon: 'glass-mug',
      description: 'Lon nhôm tái chế vô số lần',
    },
  ],

  // Level 2 - Tái Chế: tập trung rác tái chế
  2: [
    {
      id: '9',
      name: 'Chai thủy tinh',
      nameEn: 'Glass bottle',
      type: WasteType.RECYCLABLE,
      icon: 'bottle-tonic',
      description: 'Thủy tinh tái chế tốt',
    },
    {
      id: '10',
      name: 'Hộp carton',
      nameEn: 'Cardboard box',
      type: WasteType.RECYCLABLE,
      icon: 'package-variant',
      description: 'Hộp giấy tái chế được',
    },
    {
      id: '11',
      name: 'Lá cây khô',
      nameEn: 'Dry leaves',
      type: WasteType.ORGANIC,
      icon: 'leaf-maple',
      description: 'Lá cây ủ phân tốt',
    },
    {
      id: '12',
      name: 'Bóng đèn hỏng',
      nameEn: 'Broken bulb',
      type: WasteType.HAZARDOUS,
      icon: 'lightbulb-outline',
      description: 'Chứa thủy ngân độc hại',
    },
    {
      id: '13',
      name: 'Vỏ hộp mì',
      nameEn: 'Instant noodle pack',
      type: WasteType.OTHER,
      icon: 'food',
      description: 'Hộp mì thường là rác khác',
    },
    {
      id: '14',
      name: 'Giấy vụn',
      nameEn: 'Scrap paper',
      type: WasteType.RECYCLABLE,
      icon: 'file-document-outline',
      description: 'Giấy tái chế thành giấy mới',
    },
    {
      id: '15',
      name: 'Xác cà phê',
      nameEn: 'Coffee grounds',
      type: WasteType.ORGANIC,
      icon: 'coffee',
      description: 'Bã cà phê ủ phân rất tốt',
    },
    {
      id: '16',
      name: 'Thuốc hết hạn',
      nameEn: 'Expired medicine',
      type: WasteType.HAZARDOUS,
      icon: 'medical-bag',
      description: 'Thuốc hết hạn là rác nguy hại',
    },
  ],

  // Level 3 - Ủ Phân: rác hữu cơ nhiều
  3: [
    {
      id: '17',
      name: 'Rau củ thừa',
      nameEn: 'Vegetable scraps',
      type: WasteType.ORGANIC,
      icon: 'carrot',
      description: 'Rau củ ủ phân rất nhanh',
    },
    {
      id: '18',
      name: 'Vỏ tôm',
      nameEn: 'Shrimp shell',
      type: WasteType.ORGANIC,
      icon: 'food-drumstick-outline',
      description: 'Vỏ tôm ủ được',
    },
    {
      id: '19',
      name: 'Bã trà',
      nameEn: 'Tea leaves',
      type: WasteType.ORGANIC,
      icon: 'tea',
      description: 'Bã trà tốt cho đất',
    },
    {
      id: '20',
      name: 'Túi nhựa bẩn',
      nameEn: 'Dirty plastic bag',
      type: WasteType.OTHER,
      icon: 'shopping',
      description: 'Túi bẩn không tái chế được',
    },
    {
      id: '21',
      name: 'Đèn pin cũ',
      nameEn: 'Old flashlight',
      type: WasteType.HAZARDOUS,
      icon: 'flashlight',
      description: 'Có pin - rác nguy hại',
    },
    {
      id: '22',
      name: 'Vỏ cam',
      nameEn: 'Orange peel',
      type: WasteType.ORGANIC,
      icon: 'fruit-citrus',
      description: 'Vỏ cam ủ phân thơm',
    },
    {
      id: '23',
      name: 'Xương gà',
      nameEn: 'Chicken bone',
      type: WasteType.ORGANIC,
      icon: 'food-drumstick',
      description: 'Xương phân hủy chậm nhưng hữu cơ',
    },
    {
      id: '24',
      name: 'Màng bọc thực phẩm',
      nameEn: 'Food wrap',
      type: WasteType.OTHER,
      icon: 'film',
      description: 'Màng nilon dùng 1 lần',
    },
  ],

  // Level 4+ - Dùng chung pool mở rộng
};

// Tất cả items cho level mặc định
const ALL_WASTE_ITEMS: WasteItem[] = [
  ...(WASTE_ITEMS_BY_LEVEL[1] || []),
  ...(WASTE_ITEMS_BY_LEVEL[2] || []),
  ...(WASTE_ITEMS_BY_LEVEL[3] || []),
];

export function getWasteItemsForLevel(levelId: number, count: number): WasteItem[] {
  const levelItems = WASTE_ITEMS_BY_LEVEL[levelId] || WASTE_ITEMS_BY_LEVEL[1] || ALL_WASTE_ITEMS;
  const pool = [...levelItems];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getLevelConfig(levelId: number): LevelConfig {
  const levelItems = WASTE_ITEMS_BY_LEVEL[levelId] || WASTE_ITEMS_BY_LEVEL[1] || ALL_WASTE_ITEMS;
  const titles: Record<number, string> = {
    1: 'Cơ Bản',
    2: 'Tái Chế',
    3: 'Ủ Phân',
  };
  const gameModeLabels: Record<number, string> = {
    1: 'CHẾ ĐỘ CƠ BẢN',
    2: 'CHẾ ĐỘ TÁI CHẾ',
    3: 'CHẾ ĐỘ Ủ PHÂN',
  };
  return {
    id: levelId,
    title: titles[levelId] || `Cấp ${levelId}`,
    gameModeLabel: gameModeLabels[levelId] || 'CHẾ ĐỘ VÔ TẬN',
    itemCount: 5,
    timeLimit: 45,
    wasteItems: levelItems,
  };
}
