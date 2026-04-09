import apiClient from './client';
import {
  StudentQuizAvailableParams,
  StudentQuizPage,
  StudentQuizPlacement,
  StudentQuizSubmitPayload,
  StudentQuizSubmitResult,
  StudentQuizTemplate,
} from '../../types/quiz';

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type SpringPage<T> = {
  content?: T[];
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
};

const toNullableString = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return value;
  }
  return null;
};

const mapQuestion = (question: any) => ({
  id: String(question?.id ?? ''),
  text: String(question?.text ?? ''),
  options: Array.isArray(question?.options)
    ? question.options.map((option: unknown) => String(option ?? ''))
    : [],
  correct_answer:
    typeof question?.correct_answer === 'string' ? String(question.correct_answer) : null,
  explanation: typeof question?.explanation === 'string' ? String(question.explanation) : null,
});

const mapTemplate = (template: any): StudentQuizTemplate => ({
  id: String(template?.id ?? ''),
  title: String(template?.title ?? ''),
  description: toNullableString(template?.description),
  question_count: Number(template?.question_count ?? 0),
  active: Boolean(template?.active),
  partner_id: toNullableString(template?.partner_id),
  partner_name: toNullableString(template?.partner_name),
  questions: Array.isArray(template?.questions) ? template.questions.map(mapQuestion) : null,
});

const mapPage = <TInput, TOutput>(
  page: SpringPage<TInput> | null | undefined,
  itemMapper: (item: TInput) => TOutput
): StudentQuizPage<TOutput> => ({
  content: Array.isArray(page?.content) ? page.content.map(itemMapper) : [],
  number: Number(page?.number ?? 0),
  size: Number(page?.size ?? 10),
  total_elements: Number(page?.totalElements ?? 0),
  total_pages: Number(page?.totalPages ?? 0),
  first: Boolean(page?.first ?? true),
  last: Boolean(page?.last ?? true),
});

const mapPlacement = (placement: any): StudentQuizPlacement => ({
  question_id: String(placement?.question_id ?? ''),
  question_text: String(placement?.question_text ?? ''),
  selected_answer:
    typeof placement?.selected_answer === 'string' ? String(placement.selected_answer) : null,
  correct_answer:
    typeof placement?.correct_answer === 'string' ? String(placement.correct_answer) : null,
  is_correct: Boolean(placement?.is_correct),
});

const mapSubmitResult = (raw: any): StudentQuizSubmitResult => {
  const totalQuestions = Number(raw?.total_questions ?? 0);
  const correctAmount = Number(raw?.correct_amount ?? 0);
  const computedScore =
    totalQuestions > 0
      ? Math.round((correctAmount / totalQuestions) * 100)
      : Number(raw?.score ?? 0);

  return {
    attempt_id: String(raw?.attempt_id ?? ''),
    quiz_template_id: String(raw?.quiz_template_id ?? ''),
    quiz_title: String(raw?.quiz_title ?? ''),
    student_id: String(raw?.student_id ?? ''),
    student_name: toNullableString(raw?.student_name),
    score: computedScore,
    correct_amount: correctAmount,
    wrong_amount: totalQuestions - correctAmount,
    total_questions: totalQuestions,
    duration: Number(raw?.duration ?? 0),
    attempt_number: Number(raw?.attempt_number ?? 1),
    completed: Boolean(raw?.completed),
    placements: Array.isArray(raw?.placements) ? raw.placements.map(mapPlacement) : [],
    created_at: String(raw?.created_at ?? ''),
  };
};

export const quizApi = {
  getAvailable: async (
    params?: StudentQuizAvailableParams
  ): Promise<StudentQuizPage<StudentQuizTemplate>> => {
    const response = await apiClient.get<ApiEnvelope<SpringPage<any>>>('/quiz/available', {
      params: {
        partnerId: params?.partnerId ?? undefined,
        title: params?.title ?? undefined,
        page: params?.page ?? 1,
        size: params?.size ?? 10,
      },
    });

    return mapPage(response.data?.data, mapTemplate);
  },

  startQuiz: async (templateId: string): Promise<StudentQuizTemplate> => {
    const response = await apiClient.get<ApiEnvelope<any>>(`/quiz/${templateId}/start`);
    return mapTemplate(response.data?.data);
  },

  submitQuiz: async (payload: StudentQuizSubmitPayload): Promise<StudentQuizSubmitResult> => {
    const normalizedPayload: StudentQuizSubmitPayload = {
      quiz_template_id: payload.quiz_template_id,
      duration: Math.max(0, Math.round(payload.duration)),
      answers: payload.answers.map(answer => ({
        question_id: answer.question_id,
        selected_answer: answer.selected_answer,
      })),
    };

    const response = await apiClient.post<ApiEnvelope<any>>('/quiz/submit', normalizedPayload);
    return mapSubmitResult(response.data?.data);
  },

  getMyAttempts: async (page = 0, size = 10): Promise<StudentQuizPage<StudentQuizSubmitResult>> => {
    const response = await apiClient.get<ApiEnvelope<SpringPage<any>>>('/quiz/my-attempts', {
      params: { page, size },
    });

    return mapPage(response.data?.data, mapSubmitResult);
  },
};
