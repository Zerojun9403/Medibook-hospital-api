"use client";

import { Heart, Phone, Mail, MapPin } from "@/components/icons/Icons";
import { techStack } from "@/lib/constants";

const footerLinks = [
  {
    title: "서비스",
    items: ["실시간 예약", "진료과 안내", "의료진 소개", "대기열 현황"],
  },
  {
    title: "고객지원",
    items: ["자주 묻는 질문", "공지사항", "이용가이드", "문의하기"],
  },
  {
    title: "정책",
    items: ["이용약관", "개인정보처리방침", "예약/취소 정책", "접근성 안내"],
  },
];

export default function Footer() {
  return (
    <>
      {/* Tech Stack Banner */}
      <section className="py-[60px] bg-[#F5F4F0]">
        <div className="section-container">
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-50">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-sm font-semibold text-primary-dark tracking-[0.05em] whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-dark pt-20 pb-10 text-white/50">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-[60px]">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
                  <Heart size={18} />
                </div>
                <div className="font-serif text-lg font-bold text-white">
                  MediBook
                </div>
              </div>
              <p className="text-[13px] leading-[1.7] max-w-[280px] mb-5">
                3개 현장 경험을 통합한 차세대 병원 예약/관리 시스템. 실시간
                예약, 스마트 대기열, 보안까지 한 번에.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[13px]">
                  <Phone size={16} /> 02-1234-5678
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <Mail size={16} /> contact@medibook.kr
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <MapPin size={16} /> 서울시 강남구 테헤란로 123
                </div>
              </div>
            </div>

            {/* Link Columns */}
            {footerLinks.map((col) => (
              <div key={col.title}>
                <h4 className="text-[13px] font-bold text-white tracking-[0.05em] mb-5">
                  {col.title}
                </h4>
                <ul className="list-none flex flex-col gap-3">
                  {col.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-white/[0.45] no-underline text-[13px] hover:text-accent transition-colors duration-200"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/[0.08] pt-7 flex justify-between items-center flex-wrap gap-4">
            <p className="text-xs text-white/30">
              © 2026 MediBook. All rights reserved. Portfolio Project.
            </p>
            <div className="flex gap-5">
              {["Next.js", "Spring Boot", "Redis", "PostgreSQL"].map((t) => (
                <span
                  key={t}
                  className="text-[11px] text-white/25 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
