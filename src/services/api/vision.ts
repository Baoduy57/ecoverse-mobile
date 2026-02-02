import axios from 'axios';
import { WASTE_TYPES, WasteType, WasteClassification } from '@/types/wasteClassification';

// Đọc API key từ environment variable
const VISION_API_KEY = process.env.EXPO_PUBLIC_VISION_API_KEY || 'YOUR_GOOGLE_CLOUD_VISION_API_KEY';
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`;

interface VisionLabel {
  description: string;
  score: number;
}

interface VisionResponse {
  responses: Array<{
    labelAnnotations: VisionLabel[];
  }>;
}

/**
 * Phân tích ảnh bằng Google Cloud Vision API
 */
export async function analyzeImageWithVision(imageBase64: string): Promise<string[]> {
  try {
    const requestBody = {
      requests: [
        {
          image: {
            content: imageBase64,
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10,
            },
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 5,
            },
          ],
        },
      ],
    };

    const response = await axios.post<VisionResponse>(VISION_API_URL, requestBody);

    const annotations = response.data?.responses?.[0]?.labelAnnotations;

    if (!Array.isArray(annotations)) return [];

    return annotations.map(label => label?.description?.toLowerCase()).filter(Boolean);
  } catch (error) {
    console.error('Vision API Error:', error);
    return mockVisionAnalysis(imageBase64);
  }
}

/**
 * Mock function để test khi chưa có API key
 */
function mockVisionAnalysis(imageBase64: string): string[] {
  // Simulate random waste items
  const mockLabels = [
    ['bottle', 'plastic', 'container', 'beverage'],
    ['apple', 'fruit', 'food', 'organic'],
    ['battery', 'electronics', 'power'],
    ['paper', 'document', 'cardboard', 'office'],
    ['plastic bag', 'shopping', 'packaging'],
  ];

  const randomIndex = Math.floor(Math.random() * mockLabels.length);
  return mockLabels[randomIndex];
}

/**
 * Phân loại rác dựa trên labels từ Vision API
 */
export function classifyWaste(labels?: string[] | null): WasteType {
  if (!Array.isArray(labels) || labels.length === 0) {
    return WASTE_TYPES.find(t => t.id === 'general')!;
  }

  const scores: Record<string, number> = {};

  WASTE_TYPES.forEach(wasteType => {
    if (!wasteType || !Array.isArray(wasteType.keywords)) return;

    scores[wasteType.id] = 0;

    labels.forEach(label => {
      if (!label || typeof label !== 'string') return;

      const labelLower = label.toLowerCase();
      wasteType.keywords.forEach(keyword => {
        if (!keyword || typeof keyword !== 'string') return;

        const keywordLower = keyword.toLowerCase();
        if (labelLower.includes(keywordLower) || keywordLower.includes(labelLower)) {
          scores[wasteType.id]++;
        }
      });
    });
  });

  let bestMatch = WASTE_TYPES.find(t => t.id === 'general')!;
  let maxScore = 0;

  Object.entries(scores).forEach(([id, score]) => {
    if (score > maxScore) {
      maxScore = score;
      const found = WASTE_TYPES.find(t => t.id === id);
      if (found) bestMatch = found;
    }
  });

  return bestMatch;
}

/**
 * Phân tích ảnh và phân loại rác
 */
export async function analyzeAndClassifyWaste(
  imageUri: string,
  imageBase64: string
): Promise<WasteClassification> {
  try {
    // Bước 1: Gọi Vision API
    const labels = await analyzeImageWithVision(imageBase64);
    console.log('Detected labels:', labels);

    // Bước 2: Phân loại rác
    const suggestedType = classifyWaste(labels);

    // Bước 3: Tính confidence
    const confidence = labels.length > 0 ? Math.min(0.7 + labels.length * 0.05, 0.95) : 0.5;

    // Bước 4: Tạo mô tả
    const description = generateWasteDescription(suggestedType, labels);

    // Bước 5: Tạo tên hiển thị (VD: "Chai nhựa")
    const displayName = generateDisplayName(labels, suggestedType);

    return {
      imageUri,
      detectedLabels: labels,
      suggestedType,
      confidence,
      description,
      displayName,
    };
  } catch (error) {
    console.error('Analyze and classify error:', error);
    throw error;
  }
}

/** Map label tiếng Anh sang tên tiếng Việt */
const LABEL_TO_VIETNAMESE: Record<string, string> = {
  bottle: 'Chai nhựa',
  plastic: 'Nhựa',
  container: 'Hộp đựng',
  paper: 'Giấy',
  cardboard: 'Bìa carton',
  can: 'Lon',
  battery: 'Pin',
  apple: 'Táo',
  fruit: 'Trái cây',
  food: 'Thức ăn',
  electronics: 'Điện tử',
  bag: 'Túi',
  'plastic bag': 'Túi nilon',
  towel: 'Giấy lau',
  'paper towel': 'Cuộn giấy',
  document: 'Tài liệu giấy',
  packaging: 'Bao bì',
};

/**
 * Tạo tên hiển thị từ labels
 */
function generateDisplayName(labels: string[], wasteType: WasteType): string {
  if (!labels?.length) return wasteType.name;
  const first = (labels[0] || '').toLowerCase();
  const joined = labels.slice(0, 2).join(' ').toLowerCase();
  return (
    LABEL_TO_VIETNAMESE[joined] ||
    LABEL_TO_VIETNAMESE[first] ||
    (first ? first.charAt(0).toUpperCase() + first.slice(1) : wasteType.name)
  );
}

/**
 * Tạo mô tả chi tiết về loại rác
 */
function generateWasteDescription(wasteType: WasteType, labels: string[]): string {
  const descriptions: Record<string, string> = {
    organic: `Đây là rác hữu cơ có thể phân hủy tự nhiên. Vật phẩm này nên được bỏ vào thùng rác xanh lá để tạo phân compost.`,
    recyclable: `Đây là rác có thể tái chế. Vật phẩm này có thể được tái chế để làm sản phẩm mới, giúp bảo vệ môi trường.`,
    hazardous: `Đây là rác nguy hại cần xử lý đặc biệt. Không được vứt chung với rác thông thường vì có thể gây hại cho môi trường và sức khỏe.`,
    general: `Đây là rác thông thường không thể tái chế. Vật phẩm này nên được bỏ vào thùng rác xám để xử lý đúng cách.`,
  };

  let description = descriptions[wasteType.id] || descriptions.general;

  if (labels.length > 0) {
    description += `\n\nPhát hiện: ${labels.slice(0, 3).join(', ')}`;
  }

  return description;
}

/**
 * Kiểm tra kết quả drag & drop
 */
export function checkWasteClassification(
  correctType: WasteType,
  selectedType: WasteType
): { isCorrect: boolean; feedback: string } {
  const isCorrect = correctType.id === selectedType.id;

  if (isCorrect) {
    return {
      isCorrect: true,
      feedback: `Chính xác! ${correctType.name} - ${
        correctType.id === 'organic'
          ? 'Có thể phân hủy tự nhiên'
          : correctType.id === 'recyclable'
            ? 'Có thể tái chế'
            : correctType.id === 'hazardous'
              ? 'Cần xử lý đặc biệt'
              : 'Xử lý chung'
      }`,
    };
  } else {
    return {
      isCorrect: false,
      feedback: `Sai rồi! Đây là ${correctType.name}, không phải ${selectedType.name}. Hãy thử lại!`,
    };
  }
}
