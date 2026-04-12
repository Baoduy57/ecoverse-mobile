import type {
  BinCode,
  IWasteBin,
  IWasteItemDetails,
  IPlacementRequest,
  IPlacementResponse,
} from '../../types';

export interface GameQuestion {
  item: IWasteItemDetails;
  options: string[];
}

export interface GameResultDetailItem {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  description?: string;
  correctType: string;
  correctBinCode: BinCode;
  userAnswer: string;
  code: BinCode;
  isCorrect: boolean;
  orderIndex?: number;
  color: string;
}

export interface AttemptSummaryPayload {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  duration: number;
  maxCombo: number;
  completed: boolean;
}

export interface AnswerSnapshotItem {
  item: IWasteItemDetails;
  userAnswerCode: BinCode;
  isCorrect: boolean;
}

const HEX_COLOR_REGEX = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;

const sortByOrderIndex = (a: GameResultDetailItem, b: GameResultDetailItem) =>
  (a.orderIndex ?? Number.MAX_SAFE_INTEGER) - (b.orderIndex ?? Number.MAX_SAFE_INTEGER);

export const getBinColor = (bin?: IWasteBin) => {
  if (!bin) return '#9E9E9E';
  if (HEX_COLOR_REGEX.test(bin.color_hex || '')) return bin.color_hex;
  if (HEX_COLOR_REGEX.test(bin.description || '')) return bin.description;
  return '#9E9E9E';
};

export const buildGameQuestions = (items: IWasteItemDetails[], bins: IWasteBin[]): GameQuestion[] =>
  items.map(item => ({
    item,
    options: bins.map(bin => bin.code),
  }));

export const computeTimeLimit = (itemCount: number) => Math.max(60, Math.min(180, itemCount * 12));

export const buildSummaryPayload = (
  score: number,
  correctAnswers: number,
  totalQuestions: number,
  duration: number,
  maxCombo: number
): AttemptSummaryPayload => ({
  score,
  correctAnswers,
  totalQuestions,
  duration,
  maxCombo,
  completed: true,
});

export const buildPlacementRequests = (answers: AnswerSnapshotItem[]): IPlacementRequest[] =>
  answers.map(answer => ({
    waste_item_id: answer.item.id,
    code: answer.userAnswerCode,
    is_correct: answer.isCorrect,
  }));

export const buildFallbackResults = (
  answers: AnswerSnapshotItem[],
  bins: IWasteBin[]
): GameResultDetailItem[] =>
  answers
    .map((answer, index) => {
      const userBin = bins.find(bin => bin.code === answer.userAnswerCode);
      const correctBin = bins.find(bin => bin.code === answer.item.correct_bin_code);

      return {
        id: answer.item.id,
        name: answer.item.name,
        icon: answer.item.image_url ? 'image' : 'recycle',
        imageUrl: answer.item.image_url,
        description: answer.item.description,
        correctType: correctBin?.display_name || answer.item.correct_bin_code,
        correctBinCode: answer.item.correct_bin_code,
        userAnswer: userBin?.display_name || answer.userAnswerCode,
        code: answer.userAnswerCode,
        isCorrect: answer.isCorrect,
        orderIndex: answer.item.order_index ?? index,
        color: getBinColor(userBin),
      };
    })
    .sort(sortByOrderIndex);

export const buildServerResults = (
  placements: IPlacementResponse[],
  bins: IWasteBin[]
): GameResultDetailItem[] =>
  placements
    .map(placement => {
      const userBin = bins.find(bin => bin.code === placement.code);
      const correctBin = bins.find(bin => bin.code === placement.waste_item.correct_bin_code);

      return {
        id: placement.waste_item.id,
        name: placement.waste_item.name,
        icon: placement.waste_item.image_url ? 'image' : 'recycle',
        imageUrl: placement.waste_item.image_url,
        description: placement.waste_item.description,
        correctType: correctBin?.display_name || placement.waste_item.correct_bin_code,
        correctBinCode: placement.waste_item.correct_bin_code,
        userAnswer: userBin?.display_name || placement.code,
        code: placement.code,
        isCorrect: placement.is_correct,
        orderIndex: placement.waste_item.order_index,
        color: getBinColor(userBin),
      };
    })
    .sort(sortByOrderIndex);
