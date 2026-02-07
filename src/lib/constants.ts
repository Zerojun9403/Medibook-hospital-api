export const theme = {
  colors: {
    primary: "#1B4D6E",
    primaryLight: "#2A6F97",
    primaryDark: "#0F2D42",
    accent: "#C8A96E",
    accentLight: "#E5D5B0",
    bg: "#FAFAF8",
    bgCard: "#FFFFFF",
    bgDark: "#0F1923",
    text: "#1A1A1A",
    textLight: "#6B7280",
    textMuted: "#9CA3AF",
    border: "#E8E6E1",
    success: "#2D9F6F",
    warning: "#E8A838",
    glass: "rgba(255,255,255,0.72)",
  },
} as const;

// 진료과 데이터
export const departments = [
  { name: "내과", icon: "🫀", desc: "소화기, 호흡기, 순환기 질환 진료", doctors: 12, wait: "약 15분" },
  { name: "외과", icon: "🔬", desc: "일반외과, 흉부외과, 신경외과", doctors: 8, wait: "약 20분" },
  { name: "소아과", icon: "👶", desc: "영유아 및 청소년 전문 진료", doctors: 6, wait: "약 10분" },
  { name: "정형외과", icon: "🦴", desc: "근골격계 질환 및 스포츠 손상", doctors: 7, wait: "약 25분" },
  { name: "피부과", icon: "✨", desc: "피부질환 및 미용 피부 진료", doctors: 5, wait: "약 12분" },
  { name: "안과", icon: "👁️", desc: "눈 건강 검진 및 시력 교정", doctors: 4, wait: "약 18분" },
  { name: "치과", icon: "🦷", desc: "구강 건강 및 치아 교정", doctors: 9, wait: "약 22분" },
  { name: "산부인과", icon: "🤰", desc: "임산부 및 여성 건강 전문", doctors: 6, wait: "약 15분" },
];

// 핵심 기능 데이터
export const features = [
  {
    iconName: "Calendar" as const,
    title: "실시간 예약",
    desc: "잔여석을 확인하고 원하는 시간에 즉시 예약할 수 있습니다.",
    detail: "잔여석 확인 → 시간 선택 → 즉시 확정",
  },
  {
    iconName: "Queue" as const,
    title: "스마트 대기열",
    desc: "Redis 기반 공정한 선착순 시스템으로 대기 순번을 실시간 확인합니다.",
    detail: "Redis Queue · 실시간 순번 · 공정 선착순",
  },
  {
    iconName: "CreditCard" as const,
    title: "간편 결제",
    desc: "토스페이먼츠 연동으로 안전하고 빠른 결제를 지원합니다.",
    detail: "토스페이먼츠 · 자동 확인 · 환불 처리",
  },
  {
    iconName: "Bell" as const,
    title: "알림 시스템",
    desc: "이메일과 SMS로 예약 확인, 변경, 리마인더를 자동 발송합니다.",
    detail: "SendGrid · CoolSMS · 자동 리마인더",
  },
  {
    iconName: "Shield" as const,
    title: "보안 강화",
    desc: "개인정보 암호화, HTTPS, CSRF 방지로 의료 데이터를 보호합니다.",
    detail: "JWT · HTTPS · CSRF 방지 · 권한 관리",
  },
  {
    iconName: "Activity" as const,
    title: "통계 대시보드",
    desc: "의사/관리자를 위한 예약 현황, 환자 통계를 한눈에 확인합니다.",
    detail: "일별 · 월별 · 연별 통계 분석",
  },
];

// 의료진 데이터
export const doctorsData = [
  { name: "김정현", dept: "내과", specialty: "소화기내과 전문의", rating: 4.9, reviews: 342, exp: "15년", img: "👨‍⚕️" },
  { name: "이수민", dept: "소아과", specialty: "소아 알레르기 전문의", rating: 4.8, reviews: 287, exp: "12년", img: "👩‍⚕️" },
  { name: "박현우", dept: "정형외과", specialty: "스포츠 의학 전문의", rating: 4.9, reviews: 198, exp: "18년", img: "👨‍⚕️" },
];

// 통계 데이터
export const stats = [
  { value: "15,000+", label: "월간 예약 건수" },
  { value: "98.7%", label: "예약 처리율" },
  { value: "4.9", label: "환자 만족도" },
  { value: "< 3초", label: "평균 대기 응답" },
];

// 기술 스택
export const techStack = [
  "Next.js 14",
  "TypeScript",
  "Spring Boot",
  "Redis",
  "PostgreSQL",
  "WebSocket",
  "토스페이먼츠",
];
