import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediBook - 프리미엄 병원 예약/관리 시스템",
  description:
    "실시간 예약, 스마트 대기열, 간편 결제까지. 3개 현장 경험을 통합한 차세대 병원 예약 관리 시스템.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
