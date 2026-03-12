import { ExamStatus, ScheduledExam } from '../types/exam';
import { QuizQuestion } from '../types/quiz';

export const MOCK_SCHEDULED_EXAMS: ScheduledExam[] = [
  {
    id: 'exam-2',
    title: 'Kiểm tra Phân loại rác thải',
    description:
      'Bài kiểm tra đang mở — hãy hoàn thành trước khi hết giờ! Kiểm tra kiến thức về phân loại rác và bảo vệ môi trường.',
    subject: 'Phân loại rác thải',
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // started 30 min ago
    endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(), // ends in 90 min
    questionCount: 15,
    duration: 20,
    status: ExamStatus.ACTIVE,
    createdBy: 'Trường THCS Xanh',
    totalPoints: 75,
  },
  {
    id: 'exam-1',
    title: 'Kiểm tra Môi trường học kỳ I',
    description:
      'Bài kiểm tra định kỳ về kiến thức môi trường và phân loại rác thải do nhà trường tổ chức.',
    subject: 'Môi trường & Tái chế',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    questionCount: 20,
    duration: 30,
    status: ExamStatus.UPCOMING,
    createdBy: 'Trường THCS Xanh',
    totalPoints: 100,
  },
];

// Set to empty array to simulate "no exam" state
// export const MOCK_SCHEDULED_EXAMS: ScheduledExam[] = [];

// Mock exam questions for exam-2 (Phân loại rác thải)
export const MOCK_EXAM_QUESTIONS: QuizQuestion[] = [
  {
    id: 'eq1',
    questionNumber: 1,
    totalQuestions: 15,
    question: 'Vỏ lon nhôm nên bỏ vào thùng rác nào?',
    options: [
      { id: 'a', text: 'Rác tái chế', icon: 'recycle' },
      { id: 'b', text: 'Rác hữu cơ', icon: 'leaf' },
      { id: 'c', text: 'Rác thông thường', icon: 'trash-can' },
      { id: 'd', text: 'Rác nguy hại', icon: 'biohazard' },
    ],
    correctOptionId: 'a',
    points: 5,
    explanation: 'Lon nhôm là vật liệu tái chế, nên phân loại vào thùng rác tái chế.',
  },
  {
    id: 'eq2',
    questionNumber: 2,
    totalQuestions: 15,
    question: 'Vỏ trái cây và thức ăn thừa thuộc loại rác nào?',
    options: [
      { id: 'a', text: 'Rác tái chế', icon: 'recycle' },
      { id: 'b', text: 'Rác hữu cơ', icon: 'leaf' },
      { id: 'c', text: 'Rác thông thường', icon: 'trash-can' },
      { id: 'd', text: 'Rác nguy hại', icon: 'biohazard' },
    ],
    correctOptionId: 'b',
    points: 5,
    explanation: 'Thức ăn thừa và vỏ trái cây là rác hữu cơ, có thể tạo phân compost.',
  },
  {
    id: 'eq3',
    questionNumber: 3,
    totalQuestions: 15,
    question: 'Pin cũ và ắc quy xe máy nên được xử lý như thế nào?',
    options: [
      { id: 'a', text: 'Bỏ vào rác tái chế', icon: 'recycle' },
      { id: 'b', text: 'Chôn xuống đất', icon: 'shovel' },
      { id: 'c', text: 'Đem đến điểm thu gom rác nguy hại', icon: 'biohazard' },
      { id: 'd', text: 'Đốt bỏ', icon: 'fire' },
    ],
    correctOptionId: 'c',
    points: 5,
    explanation: 'Pin và ắc quy chứa chất độc hại, phải đem đến điểm thu gom rác nguy hại.',
  },
  {
    id: 'eq4',
    questionNumber: 4,
    totalQuestions: 15,
    question: 'Hành động nào giúp giảm thiểu rác nhựa hiệu quả nhất?',
    options: [
      { id: 'a', text: 'Dùng túi vải thay túi nilon', icon: 'bag-personal' },
      { id: 'b', text: 'Mua nhiều đồ nhựa dùng một lần', icon: 'shopping' },
      { id: 'c', text: 'Đốt rác nhựa', icon: 'fire' },
      { id: 'd', text: 'Chôn rác nhựa', icon: 'shovel' },
    ],
    correctOptionId: 'a',
    points: 5,
    explanation: 'Sử dụng túi vải thay thế túi nilon giúp giảm lượng rác nhựa một lần đáng kể.',
  },
  {
    id: 'eq5',
    questionNumber: 5,
    totalQuestions: 15,
    question: 'Chai nhựa PET (loại nước khoáng) có thể tái chế thành sản phẩm nào?',
    options: [
      { id: 'a', text: 'Xăng dầu', icon: 'gas-station' },
      { id: 'b', text: 'Sợi vải polyester', icon: 'tshirt-crew' },
      { id: 'c', text: 'Thức ăn chăn nuôi', icon: 'cow' },
      { id: 'd', text: 'Phân bón', icon: 'sprout' },
    ],
    correctOptionId: 'b',
    points: 5,
    explanation: 'Chai nhựa PET được tái chế thành sợi polyester để sản xuất vải, quần áo.',
  },
  {
    id: 'eq6',
    questionNumber: 6,
    totalQuestions: 15,
    question: 'Màu XANH LÁ của thùng rác thường dùng để đựng loại rác nào?',
    options: [
      { id: 'a', text: 'Rác nguy hại', icon: 'biohazard' },
      { id: 'b', text: 'Rác tái chế', icon: 'recycle' },
      { id: 'c', text: 'Rác hữu cơ', icon: 'leaf' },
      { id: 'd', text: 'Rác thông thường', icon: 'trash-can' },
    ],
    correctOptionId: 'c',
    points: 5,
    explanation: 'Thùng rác màu xanh lá thường dùng để đựng rác hữu cơ, thực phẩm.',
  },
  {
    id: 'eq7',
    questionNumber: 7,
    totalQuestions: 15,
    question: 'Giấy báo cũ và thùng carton thuộc loại rác nào?',
    options: [
      { id: 'a', text: 'Rác tái chế', icon: 'recycle' },
      { id: 'b', text: 'Rác hữu cơ', icon: 'leaf' },
      { id: 'c', text: 'Rác nguy hại', icon: 'biohazard' },
      { id: 'd', text: 'Rác thông thường', icon: 'trash-can' },
    ],
    correctOptionId: 'a',
    points: 5,
    explanation: 'Giấy báo và thùng carton là rác tái chế, có thể ép và tái chế thành giấy mới.',
  },
  {
    id: 'eq8',
    questionNumber: 8,
    totalQuestions: 15,
    question: 'Khí CO₂ dư thừa trong khí quyển gây ra hiện tượng gì?',
    options: [
      { id: 'a', text: 'Mưa axit', icon: 'weather-pouring' },
      { id: 'b', text: 'Hiệu ứng nhà kính', icon: 'home-thermometer' },
      { id: 'c', text: 'Lỗ thủng tầng ozone', icon: 'circle-off-outline' },
      { id: 'd', text: 'Bão từ', icon: 'weather-tornado' },
    ],
    correctOptionId: 'b',
    points: 5,
    explanation:
      'CO₂ và các khí nhà kính giữ nhiệt trong khí quyển, gây hiệu ứng nhà kính và biến đổi khí hậu.',
  },
  {
    id: 'eq9',
    questionNumber: 9,
    totalQuestions: 15,
    question: 'Phương pháp "3R" trong bảo vệ môi trường là gì?',
    options: [
      { id: 'a', text: 'Recycle – Reuse – Reduce', icon: 'recycle' },
      { id: 'b', text: 'Run – Ride – Row', icon: 'run' },
      { id: 'c', text: 'Read – Research – Report', icon: 'book-open' },
      { id: 'd', text: 'Rebuild – Repair – Restore', icon: 'tools' },
    ],
    correctOptionId: 'a',
    points: 5,
    explanation:
      '3R là: Reduce (giảm thiểu), Reuse (tái sử dụng), Recycle (tái chế) — ba nguyên tắc cốt lõi bảo vệ môi trường.',
  },
  {
    id: 'eq10',
    questionNumber: 10,
    totalQuestions: 15,
    question: 'Nước thải sinh hoạt chưa qua xử lý xả vào sông gây hậu quả gì?',
    options: [
      { id: 'a', text: 'Tăng lượng cá', icon: 'fish' },
      { id: 'b', text: 'Ô nhiễm nguồn nước', icon: 'water-off' },
      { id: 'c', text: 'Làm sạch sông', icon: 'water-check' },
      { id: 'd', text: 'Không ảnh hưởng gì', icon: 'close-circle-outline' },
    ],
    correctOptionId: 'b',
    points: 5,
    explanation:
      'Nước thải chứa vi khuẩn, hóa chất gây ô nhiễm nguồn nước và ảnh hưởng hệ sinh thái.',
  },
  {
    id: 'eq11',
    questionNumber: 11,
    totalQuestions: 15,
    question: 'Đèn huỳnh quang (đèn tuýp) hỏng nên được xử lý như thế nào?',
    options: [
      { id: 'a', text: 'Bỏ vào thùng rác thông thường', icon: 'trash-can' },
      { id: 'b', text: 'Tái chế cùng chai nhựa', icon: 'recycle' },
      { id: 'c', text: 'Đem đến điểm thu gom rác nguy hại', icon: 'biohazard' },
      { id: 'd', text: 'Đập vỡ để tiết kiệm chỗ', icon: 'hammer' },
    ],
    correctOptionId: 'c',
    points: 5,
    explanation: 'Đèn huỳnh quang chứa thủy ngân độc hại, phải thu gom và xử lý đúng nơi quy định.',
  },
  {
    id: 'eq12',
    questionNumber: 12,
    totalQuestions: 15,
    question: 'Túi nilon mất bao lâu để phân hủy trong môi trường tự nhiên?',
    options: [
      { id: 'a', text: '1–5 năm', icon: 'calendar' },
      { id: 'b', text: '10–20 năm', icon: 'calendar-range' },
      { id: 'c', text: '100–1000 năm', icon: 'timer-sand' },
      { id: 'd', text: 'Tự phân hủy ngay sau 1 ngày', icon: 'timer' },
    ],
    correctOptionId: 'c',
    points: 5,
    explanation:
      'Túi nilon cần từ 100 đến 1000 năm để phân hủy hoàn toàn, gây ô nhiễm nghiêm trọng.',
  },
  {
    id: 'eq13',
    questionNumber: 13,
    totalQuestions: 15,
    question: 'Hành động nào KHÔNG giúp tiết kiệm nước?',
    options: [
      { id: 'a', text: 'Tắt vòi nước khi đánh răng', icon: 'toothbrush' },
      { id: 'b', text: 'Dùng vòi hoa sen thay bồn tắm', icon: 'shower' },
      { id: 'c', text: 'Để vòi nước chảy khi rửa bát', icon: 'water-pump' },
      { id: 'd', text: 'Tái sử dụng nước rửa rau tưới cây', icon: 'watering-can' },
    ],
    correctOptionId: 'c',
    points: 5,
    explanation: 'Để vòi nước chảy liên tục khi rửa bát lãng phí rất nhiều nước.',
  },
  {
    id: 'eq14',
    questionNumber: 14,
    totalQuestions: 15,
    question: 'Loại năng lượng nào sau đây là năng lượng tái tạo?',
    options: [
      { id: 'a', text: 'Than đá', icon: 'lightning-bolt' },
      { id: 'b', text: 'Dầu mỏ', icon: 'oil' },
      { id: 'c', text: 'Năng lượng mặt trời', icon: 'white-balance-sunny' },
      { id: 'd', text: 'Khí đốt tự nhiên', icon: 'gas-burner' },
    ],
    correctOptionId: 'c',
    points: 5,
    explanation: 'Năng lượng mặt trời là nguồn tái tạo vô hạn, sạch và không tạo ra khí thải.',
  },
  {
    id: 'eq15',
    questionNumber: 15,
    totalQuestions: 15,
    question: 'Rác thải điện tử (điện thoại, máy tính cũ) cần được xử lý như thế nào?',
    options: [
      { id: 'a', text: 'Chôn xuống đất', icon: 'shovel' },
      { id: 'b', text: 'Đốt để tái chế kim loại', icon: 'fire' },
      { id: 'c', text: 'Thu gom tại điểm tái chế điện tử', icon: 'recycle' },
      { id: 'd', text: 'Bỏ chung với rác thông thường', icon: 'trash-can' },
    ],
    correctOptionId: 'c',
    points: 5,
    explanation:
      'Rác thải điện tử chứa kim loại nặng độc hại, phải đưa đến điểm thu gom tái chế chuyên biệt.',
  },
];
