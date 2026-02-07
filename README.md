# 🏥 MediBook - 병원 예약/관리 시스템

> 3개 경력을 하나로 통합한 실무 수준 예약 시스템 (포트폴리오 프로젝트)

## 🚀 빠른 시작

```bash
# 1. 프로젝트 폴더로 이동
cd medibook-hospital

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 **http://localhost:3000** 을 열면 됩니다.

## 📁 프로젝트 구조

```
medibook-hospital/
├── src/
│   ├── app/
│   │   ├── globals.css          # 글로벌 스타일 + Tailwind
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   └── page.tsx             # 메인 페이지
│   ├── components/
│   │   ├── icons/
│   │   │   └── Icons.tsx        # SVG 아이콘 컴포넌트
│   │   └── sections/
│   │       ├── Header.tsx       # 헤더/네비게이션
│   │       ├── HeroSection.tsx  # 히어로 섹션
│   │       ├── FeaturesSection.tsx  # 핵심 기능
│   │       ├── DepartmentsSection.tsx  # 진료과 안내
│   │       ├── DoctorsSection.tsx  # 추천 의료진
│   │       ├── CTASection.tsx   # CTA 섹션
│   │       └── Footer.tsx       # 푸터
│   └── lib/
│       └── constants.ts         # 데이터 & 디자인 토큰
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

## 🎨 디자인 시스템

| 토큰 | 값 | 용도 |
|------|-----|------|
| Primary | `#1B4D6E` | 메인 브랜드 색상 (네이비) |
| Accent | `#C8A96E` | 강조 색상 (골드) |
| BG Dark | `#0F1923` | 히어로/푸터 배경 |
| Success | `#2D9F6F` | 성공/가용 상태 |
| Font Heading | Playfair Display | 제목용 세리프 |
| Font Body | Noto Sans KR | 본문용 산세리프 |

## 🛠 기술 스택 (Frontend)

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (애니메이션 예정)

## 📌 다음 단계

- [ ] 로그인/회원가입 페이지
- [ ] 예약 페이지 (캘린더 + 시간 선택)
- [ ] 의사/관리자 대시보드
- [ ] 마이페이지 (예약 내역)
- [ ] 백엔드 연동 (Spring Boot)
