import axios from 'axios';
import { WASTE_TYPES, WasteType, WasteClassification } from '@/types/wasteClassification';
import { useApiStatusStore } from '@/store/apiStatusStore';

// Đọc API key từ environment variable
const VISION_API_KEY = process.env.EXPO_PUBLIC_VISION_API_KEY || 'YOUR_GOOGLE_CLOUD_VISION_API_KEY';
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`;
const HAS_VISION_API_KEY =
  !!VISION_API_KEY && VISION_API_KEY !== 'YOUR_GOOGLE_CLOUD_VISION_API_KEY';

const ALLOW_VISION_MOCK_FALLBACK = process.env.EXPO_PUBLIC_ENABLE_VISION_MOCK === 'true';

export type VisionErrorCode =
  | 'AI_API_NOT_CONFIGURED'
  | 'AI_NETWORK_UNAVAILABLE'
  | 'AI_SERVICE_MAINTENANCE'
  | 'AI_REQUEST_TIMEOUT'
  | 'AI_SERVICE_ERROR';

export class VisionServiceError extends Error {
  code: VisionErrorCode;

  constructor(code: VisionErrorCode, message: string) {
    super(message);
    this.name = 'VisionServiceError';
    this.code = code;
  }
}

function notifyVisionIncident(code: VisionErrorCode, customMessage?: string) {
  const apiStatus = useApiStatusStore.getState();

  switch (code) {
    case 'AI_NETWORK_UNAVAILABLE':
      apiStatus.showNetworkError(
        'Lỗi mạng (Scanner)',
        customMessage || 'Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra kết nối mạng (Wifi/4G).'
      );
      break;
    case 'AI_REQUEST_TIMEOUT':
      apiStatus.showTimeout(
        'Quét ảnh quá lâu',
        customMessage || 'Máy chủ AI phản hồi chậm. Vui lòng kiểm tra lại đường truyền và thử lại.'
      );
      break;
    case 'AI_API_NOT_CONFIGURED':
    case 'AI_SERVICE_MAINTENANCE':
      apiStatus.showMaintenance(
        'Bảo trì Scanner',
        customMessage || 'Hệ thống nhận diện hình ảnh đang được bảo trì. Vui lòng quay lại sau.'
      );
      break;
    case 'AI_SERVICE_ERROR':
    default:
      apiStatus.showServerError(
        'Lỗi dịch vụ AI',
        customMessage || 'Dịch vụ phân tích hình ảnh đang gặp sự cố. Vui lòng thử lại sau ít phút.'
      );
      break;
  }
}

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
  if (!HAS_VISION_API_KEY) {
    if (ALLOW_VISION_MOCK_FALLBACK) {
      return mockVisionAnalysis(imageBase64);
    }

    notifyVisionIncident('AI_API_NOT_CONFIGURED');

    throw new VisionServiceError(
      'AI_API_NOT_CONFIGURED',
      'AI Scanner chưa được cấu hình API. Vui lòng cập nhật API key hoặc thử lại sau.'
    );
  }

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
              maxResults: 15,
            },
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 10,
            },
            {
              type: 'WEB_DETECTION',
              maxResults: 5,
            },
          ],
        },
      ],
    };

    const response = await axios.post<VisionResponse>(VISION_API_URL, requestBody, {
      timeout: 25000,
    });

    const resp = response.data?.responses?.[0];
    const annotations = resp?.labelAnnotations ?? [];
    // Also include object names from OBJECT_LOCALIZATION for better accuracy
    const objectLabels: string[] =
      (resp as any)?.localizedObjectAnnotations?.map((o: any) => (o?.name ?? '').toLowerCase()) ??
      [];
    // Web best guess labels
    const webLabels: string[] =
      (resp as any)?.webDetection?.bestGuessLabels?.map((l: any) =>
        (l?.label ?? '').toLowerCase()
      ) ?? [];

    if (!Array.isArray(annotations) || annotations.length === 0) {
      // Merge object + web labels if vision labels empty
      const merged = [...new Set([...objectLabels, ...webLabels])];
      return merged.length > 0 ? merged : [];
    }

    const visionLabels = annotations
      .map(label => label?.description?.toLowerCase())
      .filter(Boolean);

    // Merge all sources, deduplicate
    return [...new Set([...visionLabels, ...objectLabels, ...webLabels])];
  } catch (error: any) {
    console.error('Vision API Error:', error);

    if (ALLOW_VISION_MOCK_FALLBACK) {
      return mockVisionAnalysis(imageBase64);
    }

    const statusCode = error?.response?.status;
    const errorCode = `${error?.code || ''}`;
    const errorMessage = `${error?.message || ''}`.toLowerCase();

    if (statusCode === 503) {
      notifyVisionIncident('AI_SERVICE_MAINTENANCE');
      throw new VisionServiceError(
        'AI_SERVICE_MAINTENANCE',
        'Dịch vụ AI đang được bảo trì. Vui lòng quay lại sau.'
      );
    }

    if (errorCode === 'ECONNABORTED' || errorMessage.includes('timeout')) {
      notifyVisionIncident('AI_REQUEST_TIMEOUT');
      throw new VisionServiceError(
        'AI_REQUEST_TIMEOUT',
        'Yêu cầu quét ảnh mất quá nhiều thời gian. Vui lòng thử lại.'
      );
    }

    if (
      errorCode === 'ERR_NETWORK' ||
      errorCode === 'ENOTFOUND' ||
      errorMessage.includes('network')
    ) {
      notifyVisionIncident('AI_NETWORK_UNAVAILABLE');
      throw new VisionServiceError(
        'AI_NETWORK_UNAVAILABLE',
        'Không thể kết nối đến dịch vụ AI. Vui lòng kiểm tra mạng và thử lại.'
      );
    }

    if (statusCode && statusCode >= 500) {
      notifyVisionIncident('AI_SERVICE_ERROR');
      throw new VisionServiceError(
        'AI_SERVICE_ERROR',
        'Hệ thống AI đang bận. Vui lòng thử lại sau.'
      );
    }

    notifyVisionIncident('AI_SERVICE_ERROR');

    throw new VisionServiceError(
      'AI_SERVICE_ERROR',
      'Không thể phân tích ảnh lúc này. Vui lòng thử lại sau.'
    );
  }
}

/**
 * Mock function để test khi chưa có API key
 * Returns labels based on imageBase64 hash (deterministic) instead of random
 */
function mockVisionAnalysis(imageBase64: string): string[] {
  const mockLabels = [
    ['bottle', 'plastic bottle', 'plastic', 'container', 'beverage'],
    ['apple', 'fruit', 'food', 'organic', 'fresh produce'],
    ['battery', 'electronics', 'power', 'hazardous'],
    ['toilet paper', 'paper roll', 'paper product', 'tissue paper', 'roll'],
    ['newspaper', 'paper', 'cardboard', 'packaging'],
    ['plastic bag', 'bag', 'wrapper'],
    ['glass bottle', 'glass', 'container'],
  ];
  // Use last chars of base64 as a deterministic index
  const lastChars = imageBase64.slice(-8);
  let hash = 0;
  for (let i = 0; i < lastChars.length; i++) {
    hash = (hash * 31 + lastChars.charCodeAt(i)) & 0xffff;
  }
  return mockLabels[hash % mockLabels.length];
}

/**
 * Phân loại rác dựa trên labels từ Vision API
 * Uses weighted scoring: longer keyword matches score higher, preventing
 * short keywords like "tissue" from overriding specific matches like "paper towel"
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

        if (labelLower === keywordLower) {
          // Exact match scores highest — longer keywords score more (prevents "tissue" overriding "paper towel")
          scores[wasteType.id] += 2 + keywordLower.length / 5;
        } else if (labelLower.includes(keywordLower) || keywordLower.includes(labelLower)) {
          // Partial match — prefer longer keyword word to reduce false positives
          scores[wasteType.id] += 1 + keywordLower.length / 10;
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

/** Map label tiếng Anh sang tên tiếng Việt (ưu tiên cụm từ dài hơn) */
const LABEL_TO_VIETNAMESE: Record<string, string> = {
  // ── Đồ uống & bao bì nhựa ─────────────────────────────────────────────
  'plastic bottle': 'Chai nhựa',
  'water bottle': 'Chai nước',
  'soda bottle': 'Chai nước ngọt',
  'juice bottle': 'Chai nước ép',
  'milk bottle': 'Chai sữa',
  'glass bottle': 'Chai thủy tinh',
  'wine bottle': 'Chai rượu',
  'beer bottle': 'Chai bia',
  bottle: 'Chai',
  'plastic cup': 'Cốc nhựa',
  'disposable cup': 'Cốc dùng một lần',
  cup: 'Cốc',
  'plastic bag': 'Túi nilon',
  'shopping bag': 'Túi mua hàng',
  'garbage bag': 'Túi rác',
  bag: 'Túi',
  'plastic container': 'Hộp nhựa',
  'food container': 'Hộp đựng thức ăn',
  container: 'Hộp đựng',
  'plastic straw': 'Ống hút nhựa',
  straw: 'Ống hút',
  'plastic wrap': 'Màng bọc nhựa',
  wrapper: 'Bao bì',
  packaging: 'Bao bì đóng gói',
  plastic: 'Nhựa',
  // ── Giấy & carton ─────────────────────────────────────────────────────
  'toilet paper': 'Cuộn giấy vệ sinh',
  'paper towel': 'Cuộn giấy lau',
  'tissue paper': 'Giấy thấm',
  'paper roll': 'Cuộn giấy',
  'wrapping paper': 'Giấy gói',
  'kraft paper': 'Giấy kraft',
  'paper bag': 'Túi giấy',
  'cardboard box': 'Thùng carton',
  'cereal box': 'Hộp ngũ cốc',
  carton: 'Hộp carton',
  cardboard: 'Bìa carton',
  newspaper: 'Báo giấy',
  magazine: 'Tạp chí',
  book: 'Sách',
  document: 'Tài liệu giấy',
  towel: 'Giấy lau',
  tissue: 'Giấy ăn',
  roll: 'Cuộn giấy',
  paper: 'Giấy',
  // ── Kim loại ──────────────────────────────────────────────────────────
  'aluminum can': 'Lon nhôm',
  'tin can': 'Lon thiếc',
  'beer can': 'Lon bia',
  'soda can': 'Lon nước ngọt',
  can: 'Lon',
  'metal lid': 'Nắp kim loại',
  'steel pipe': 'Ống thép',
  aluminum: 'Nhôm',
  'aluminum foil': 'Giấy bạc nhôm',
  foil: 'Giấy bạc',
  steel: 'Thép',
  tin: 'Thiếc',
  metal: 'Kim loại',
  // ── Thủy tinh ─────────────────────────────────────────────────────────
  'glass jar': 'Lọ thủy tinh',
  'glass cup': 'Ly thủy tinh',
  'glass bowl': 'Bát thủy tinh',
  jar: 'Lọ',
  glass: 'Thủy tinh',
  // ── Thực phẩm hữu cơ ──────────────────────────────────────────────────
  'banana peel': 'Vỏ chuối',
  'orange peel': 'Vỏ cam',
  'apple core': 'Lõi táo',
  'food waste': 'Thức ăn thừa',
  'food scraps': 'Cặn thức ăn',
  'vegetable scraps': 'Rau củ thừa',
  banana: 'Chuối',
  apple: 'Táo',
  orange: 'Cam',
  mango: 'Xoài',
  grapes: 'Nho',
  grape: 'Nho',
  watermelon: 'Dưa hấu',
  pineapple: 'Dứa',
  coconut: 'Dừa',
  corn: 'Bắp ngô',
  potato: 'Khoai tây',
  tomato: 'Cà chua',
  carrot: 'Cà rốt',
  onion: 'Hành tây',
  cucumber: 'Dưa leo',
  lettuce: 'Rau diếp',
  spinach: 'Rau bó xôi',
  mushroom: 'Nấm',
  avocado: 'Bơ',
  lemon: 'Chanh',
  lime: 'Chanh xanh',
  strawberry: 'Dâu tây',
  pear: 'Lê',
  peach: 'Đào',
  fruit: 'Trái cây',
  vegetable: 'Rau củ',
  flower: 'Hoa',
  leaf: 'Lá cây',
  grass: 'Cỏ',
  plant: 'Cây',
  tree: 'Cây gỗ',
  wood: 'Gỗ',
  rice: 'Cơm/Gạo',
  bread: 'Bánh mì',
  meat: 'Thịt',
  fish: 'Cá',
  egg: 'Trứng',
  milk: 'Sữa',
  bone: 'Xương',
  shell: 'Vỏ sò',
  peel: 'Vỏ trái cây',
  food: 'Thức ăn',
  organic: 'Hữu cơ',
  // ── Rác nguy hại & điện tử ────────────────────────────────────────────
  'lithium battery': 'Pin lithium',
  'aa battery': 'Pin AA',
  'aaa battery': 'Pin AAA',
  battery: 'Pin',
  'fluorescent lamp': 'Đèn huỳnh quang',
  'light bulb': 'Bóng đèn',
  lightbulb: 'Bóng đèn',
  bulb: 'Bóng đèn',
  'mobile phone': 'Điện thoại di động',
  smartphone: 'Điện thoại thông minh',
  phone: 'Điện thoại',
  laptop: 'Máy tính xách tay',
  computer: 'Máy tính',
  tablet: 'Máy tính bảng',
  keyboard: 'Bàn phím',
  mouse: 'Chuột máy tính',
  'circuit board': 'Bảng mạch điện',
  circuit: 'Mạch điện',
  cable: 'Cáp điện',
  charger: 'Sạc',
  electronic: 'Thiết bị điện tử',
  electronics: 'Đồ điện tử',
  device: 'Thiết bị',
  appliance: 'Đồ gia dụng',
  electrical: 'Điện',
  syringe: 'Ống tiêm',
  medicine: 'Thuốc',
  chemical: 'Hóa chất',
  paint: 'Sơn',
  spray: 'Bình xịt',
  thermometer: 'Nhiệt kế',
  toxic: 'Độc hại',
  hazardous: 'Chất nguy hại',
  fluorescent: 'Huỳnh quang',
  // ── Rác thông thường ──────────────────────────────────────────────────
  styrofoam: 'Xốp styrofoam',
  'foam box': 'Hộp xốp',
  foam: 'Xốp',
  rubber: 'Cao su',
  cloth: 'Vải',
  diaper: 'Tã lót',
  cigarette: 'Đầu mẩu thuốc lá',
  tape: 'Băng keo',
  ceramic: 'Gốm sứ',
  napkin: 'Giấy ăn dùng một lần',
  'candy wrapper': 'Giấy kẹo',
  'chip bag': 'Túi bim bim',
  waste: 'Rác',
  trash: 'Rác thải',
  misc: 'Vật dụng khác',
  unknown: 'Vật thể chưa xác định',
};

/** Danh sách mô tả chi tiết theo từng nhãn phát hiện */
const LABEL_DETAIL_DESCRIPTIONS: Record<string, string> = {
  // Nhựa
  'plastic bottle':
    'Chai nhựa sau khi dùng nên được rửa sạch, bẹp dẹt lại để tiết kiệm không gian và bỏ vào thùng tái chế. Nhựa PET (ký hiệu số 1) là loại phổ biến nhất và dễ tái chế.',
  'plastic bag':
    'Túi nilon rất khó phân hủy (mất 500-1000 năm). Hãy tái sử dụng nhiều lần hoặc thay bằng túi vải. Nếu phải bỏ, gom thành một túi lớn để dễ phân loại.',
  'plastic cup':
    'Cốc nhựa dùng một lần là nguồn rác thải lớn. Hãy dùng cốc có thể tái sử dụng. Khi bỏ đi, làm sạch và bỏ vào thùng tái chế nếu có ký hiệu tái chế.',
  straw: 'Ống hút nhựa khó tái chế vì kích thước nhỏ. Thay bằng ống hút giấy, inox hoặc tre để bảo vệ môi trường. Nên bỏ vào thùng rác thông thường.',
  plastic: 'Đồ nhựa cần được phân loại theo ký hiệu tái chế (số 1-7 ở đáy). Rửa sạch trước khi bỏ vào thùng tái chế để đảm bảo chất lượng tái chế.',
  // Giấy
  'toilet paper':
    'Giấy vệ sinh đã qua sử dụng không tái chế được và không nên xả xuống bồn cầu ở Việt Nam. Bỏ vào thùng rác thông thường hoặc thùng tái chế nếu chưa qua sử dụng.',
  'paper towel': 'Cuộn giấy lau và hộp carton bao bì có thể tái chế. Nếu giấy lau đã dùng, bỏ vào thùng rác thông thường.',
  newspaper:
    'Báo và tạp chí cũ là nguyên liệu tái chế tốt. Gom lại thành bó, bán cho đồng nát hoặc bỏ vào thùng tái chế màu xanh dương.',
  cardboard:
    'Bìa carton và thùng giấy là vật liệu tái chế có giá trị. Tháo dẹt, tháo băng keo, tránh để ướt để đảm bảo chất lượng khi tái chế.',
  paper: 'Giấy sạch (chưa dính dầu mỡ hay hóa chất) có thể tái chế. Bỏ vào thùng tái chế màu xanh dương hoặc bán cho vựa thu mua.',
  // Kim loại
  can: 'Lon nhôm là vật liệu tái chế có giá trị cao. Rửa sạch, bẹp dẹt để tiết kiệm không gian. Nhôm có thể tái chế vô hạn lần mà không mất chất lượng.',
  'aluminum can': 'Lon nhôm tái chế tiết kiệm 95% năng lượng so với sản xuất nhôm mới. Rửa sạch và bỏ vào thùng tái chế.',
  metal: 'Kim loại là vật liệu tái chế quý giá. Phân loại theo loại (nhôm, sắt, đồng) để đạt giá trị thu gom cao nhất.',
  // Thủy tinh
  'glass bottle': 'Chai thủy tinh có thể tái sử dụng nhiều lần hoặc tái chế. Rửa sạch, tháo nắp kim loại và bỏ vào điểm thu gom thủy tinh.',
  glass: 'Thủy tinh tái chế 100% và có thể tái chế vô hạn lần. Không bỏ thủy tinh bể vào túi rác thông thường vì nguy hiểm. Gói cẩn thận trước khi bỏ.',
  // Thực phẩm hữu cơ
  'food waste': 'Thức ăn thừa là nguyên liệu lý tưởng để làm phân compost. Bỏ vào thùng rác hữu cơ (xanh lá). Phân compost từ rác thực phẩm rất tốt cho cây trồng.',
  banana: 'Chuối và vỏ chuối là rác hữu cơ phân hủy tự nhiên nhanh chóng. Bỏ vào thùng rác hữu cơ hoặc ủ phân compost.',
  apple: 'Táo và lõi táo là rác hữu cơ có thể phân hủy tự nhiên. Bỏ vào thùng rác hữu cơ hoặc ủ phân compost.',
  fruit: 'Trái cây và phần còn thừa (vỏ, hạt) là rác hữu cơ tốt cho việc ủ phân compost. Bỏ vào thùng rác màu xanh lá.',
  vegetable: 'Rau củ và phần cắt bỏ là rác hữu cơ phân hủy nhanh. Dùng làm phân compost hoặc bỏ vào thùng rác hữu cơ.',
  food: 'Thức ăn thừa nên được bỏ vào thùng rác hữu cơ (xanh lá). Tránh đổ dầu ăn thừa vào cống thoát nước vì sẽ gây tắc nghẽn.',
  // Điện tử & nguy hại
  battery:
    'Pin là rác nguy hại chứa kim loại nặng và axit. KHÔNG vứt vào thùng rác thông thường. Mang đến điểm thu gom pin tại siêu thị, cửa hàng điện máy.',
  lightbulb:
    'Bóng đèn cũ (đặc biệt đèn compact và đèn huỳnh quang) chứa thủy ngân. KHÔNG đập vỡ. Mang đến điểm thu gom chuyên dụng tại siêu thị.',
  phone: 'Điện thoại cũ chứa nhiều kim loại quý và hóa chất độc hại. Mang đến cửa hàng điện thoại hoặc điểm thu gom thiết bị điện tử để xử lý đúng cách.',
  electronics:
    'Thiết bị điện tử cũ là rác điện tử (e-waste) cần xử lý đặc biệt. Liên hệ nhà sản xuất hoặc mang đến điểm thu gom thiết bị điện tử.',
  medicine: 'Thuốc hết hạn là rác nguy hại. KHÔNG đổ xuống cống hay vứt vào thùng rác thông thường. Trả lại cho nhà thuốc hoặc cơ sở y tế.',
  // Rác thông thường
  styrofoam:
    'Hộp xốp styrofoam (EPS) rất khó tái chế và mất hàng trăm năm để phân hủy. Bỏ vào thùng rác thông thường. Hạn chế sử dụng bằng cách mang hộp đựng riêng.',
  diaper: 'Tã lót dùng một lần không thể tái chế. Gói kín trước khi bỏ vào thùng rác thông thường để tránh mùi và vi khuẩn lây lan.',
  cigarette: 'Đầu mẩu thuốc lá chứa hóa chất độc hại. KHÔNG vứt xuống đất hay cống rãnh. Bỏ vào thùng rác thông thường sau khi dập tắt hoàn toàn.',
};

/**
 * Tạo tên hiển thị từ labels — ưu tiên cụm từ dài nhất khớp trong từ điển
 */
function generateDisplayName(labels: string[], wasteType: WasteType): string {
  if (!labels?.length) return wasteType.name;

  // Thử ghép 3, 2, 1 nhãn đầu để tìm cụm từ dài nhất có trong từ điển
  for (let n = Math.min(3, labels.length); n >= 1; n--) {
    const candidate = labels
      .slice(0, n)
      .join(' ')
      .toLowerCase()
      .trim();
    if (LABEL_TO_VIETNAMESE[candidate]) {
      return LABEL_TO_VIETNAMESE[candidate];
    }
  }

  // Thử từng nhãn riêng lẻ (không chỉ label[0])
  for (const label of labels.slice(0, 5)) {
    const lbl = (label || '').toLowerCase().trim();
    if (LABEL_TO_VIETNAMESE[lbl]) {
      return LABEL_TO_VIETNAMESE[lbl];
    }
    // Thử tìm nhãn nào đó trong từ điển có chứa label hoặc ngược lại
    for (const [key, value] of Object.entries(LABEL_TO_VIETNAMESE)) {
      if (lbl.includes(key) || key.includes(lbl)) {
        return value;
      }
    }
  }

  // Fallback: viết hoa chữ đầu label đầu tiên
  const first = (labels[0] || '').toLowerCase().trim();
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : wasteType.name;
}

/**
 * Tạo mô tả chi tiết về loại rác — ưu tiên mô tả theo vật phẩm cụ thể
 */
function generateWasteDescription(wasteType: WasteType, labels: string[]): string {
  // 1. Thử tìm mô tả chi tiết theo nhãn cụ thể (ưu tiên cụm từ dài hơn)
  for (let n = Math.min(3, labels.length); n >= 1; n--) {
    const candidate = labels
      .slice(0, n)
      .join(' ')
      .toLowerCase()
      .trim();
    if (LABEL_DETAIL_DESCRIPTIONS[candidate]) {
      return LABEL_DETAIL_DESCRIPTIONS[candidate];
    }
  }
  for (const label of labels.slice(0, 5)) {
    const lbl = (label || '').toLowerCase().trim();
    if (LABEL_DETAIL_DESCRIPTIONS[lbl]) {
      return LABEL_DETAIL_DESCRIPTIONS[lbl];
    }
    // Partial match
    for (const [key, desc] of Object.entries(LABEL_DETAIL_DESCRIPTIONS)) {
      if (lbl.includes(key) || key.includes(lbl)) {
        return desc;
      }
    }
  }

  // 2. Fallback: mô tả theo loại rác kèm tên tiếng Việt của vật phẩm
  const displayItem = generateDisplayName(labels, wasteType);
  const itemNote =
    displayItem && displayItem !== wasteType.name ? ` "${displayItem}"` : '';

  const fallbacks: Record<string, string> = {
    organic: `Vật phẩm${itemNote} thuộc nhóm rác hữu cơ — có thể phân hủy tự nhiên.\n\n✅ Bỏ vào thùng rác màu xanh lá.\n♻️ Có thể dùng ủ phân compost cho cây trồng.\n⚠️ Không để lẫn với rác tái chế hoặc rác nguy hại.`,
    recyclable: `Vật phẩm${itemNote} thuộc nhóm rác có thể tái chế.\n\n✅ Rửa sạch trước khi bỏ vào thùng tái chế màu xanh dương.\n♻️ Tái chế giúp tiết kiệm tài nguyên và giảm ô nhiễm.\n⚠️ Không bỏ khi còn dính dầu mỡ hoặc hóa chất.`,
    hazardous: `Vật phẩm${itemNote} thuộc nhóm rác nguy hại — cần xử lý đặc biệt.\n\n⛔ KHÔNG bỏ vào thùng rác thông thường.\n✅ Mang đến điểm thu gom chuyên dụng (siêu thị, cửa hàng điện máy).\n⚠️ Có thể gây hại nghiêm trọng cho môi trường và sức khỏe.`,
    general: `Vật phẩm${itemNote} thuộc nhóm rác thông thường không tái chế được.\n\n✅ Bỏ vào thùng rác màu xám.\n💡 Cân nhắc tìm phương án thay thế thân thiện hơn với môi trường.\n⚠️ Không bỏ vào thùng tái chế.`,
  };

  return fallbacks[wasteType.id] || fallbacks.general;
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
