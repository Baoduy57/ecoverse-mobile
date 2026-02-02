export interface WasteType {
  id: string;
  name: string;
  icon: string;
  color: string;
  keywords: string[]; // Keywords để nhận diện từ Vision API
  description: string;
  recyclingInfo: string;
  priority?: number;
}

export interface DetectedObject {
  name: string;
  score: number;
  boundingBox?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

export interface WasteClassification {
  imageUri: string;
  detectedLabels: string[];
  suggestedType: WasteType;
  confidence: number;
  description?: string;
  detectedObjects?: DetectedObject[];
  displayName?: string; // Tên hiển thị vật phát hiện (VD: "Chai nhựa")
}

export interface DragDropGameResult {
  isCorrect: boolean;
  correctType: WasteType;
  selectedType: WasteType;
  feedback: string;
}

// 4 loại rác chính
export const WASTE_TYPES: WasteType[] = [
  {
    id: 'organic',
    name: 'Rác hữu cơ',
    icon: 'leaf',
    color: '#4CAF50',
    description: 'Rác thải có thể phân hủy tự nhiên từ thực vật, động vật',
    recyclingInfo: 'Có thể sử dụng làm phân compost cho cây trồng. Bỏ vào thùng rác màu xanh lá.',
    priority: 1,
    keywords: [
      'fruit',
      'vegetable',
      'food',
      'banana',
      'apple',
      'orange',
      'leaf',
      'plant',
      'flower',
      'grass',
      'tree',
      'wood',
      'rice',
      'bread',
      'meat',
      'fish',
      'egg',
      'milk',
      'coconut',
      'corn',
      'potato',
      'tomato',
      'peel',
      'bone',
      'shell',
      'organic',
    ],
  },
  {
    id: 'recyclable',
    name: 'Rác tái chế',
    icon: 'recycle',
    color: '#2196F3',
    description: 'Rác có thể tái chế: nhựa, giấy, kim loại, thủy tinh',
    recyclingInfo: 'Rửa sạch và bỏ vào thùng rác màu xanh dương. Góp phần bảo vệ môi trường.',
    priority: 2,
    keywords: [
      'bottle',
      'plastic',
      'paper',
      'cardboard',
      'box',
      'can',
      'glass',
      'metal',
      'aluminum',
      'newspaper',
      'magazine',
      'container',
      'packaging',
      'carton',
      'steel',
      'tin',
      'foil',
      'jar',
      'cup',
    ],
  },
  {
    id: 'hazardous',
    name: 'Rác nguy hại',
    icon: 'alert',
    color: '#F44336',
    description: 'Rác độc hại: pin, bóng đèn, hóa chất, điện tử',
    recyclingInfo: 'Mang đến điểm thu gom chuyên dụng. KHÔNG vứt vào rác thông thường.',
    priority: 3,
    keywords: [
      'battery',
      'medicine',
      'chemical',
      'spray',
      'paint',
      'lightbulb',
      'bulb',
      'electronics',
      'phone',
      'computer',
      'syringe',
      'thermometer',
      'electronic',
      'circuit',
      'toxic',
      'hazardous',
      'fluorescent',
      'device',
      'electrical',
      'appliance',
    ],
  },
  {
    id: 'general',
    name: 'Rác thông thường',
    icon: 'delete',
    color: '#9E9E9E',
    description: 'Rác thải khó phân hủy, không tái chế được',
    recyclingInfo: 'Bỏ vào thùng rác màu xám. Giảm thiểu sử dụng để bảo vệ môi trường.',
    priority: 0,
    keywords: [
      'plastic bag',
      'wrapper',
      'straw',
      'styrofoam',
      'ceramic',
      'rubber',
      'cloth',
      'tissue',
      'napkin',
      'diaper',
      'cigarette',
      'foam',
      'tape',
      'bag',
      'other',
      'unknown',
      'misc',
      'general',
      'trash',
      'waste',
    ],
  },
];
