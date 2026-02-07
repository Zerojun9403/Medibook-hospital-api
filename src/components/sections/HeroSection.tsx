"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ChevronRight } from "@/components/icons/Icons";
import { stats } from "@/lib/constants";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => setIsConfirmed(false), 3000);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-bg-dark via-[#162A3A] to-primary">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient Orbs */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,169,110,0.15),transparent_70%)] blur-[60px] animate-float" />
      <div className="absolute bottom-[10%] -left-[5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(42,111,151,0.2),transparent_70%)] blur-[80px]" />

      <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-28 pb-20 relative z-[2] w-full">
        {/* Left - Text */}
        <div
          className="transition-all duration-[800ms] ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "200ms",
          }}
        >
          <div className="flex items-center gap-3 mb-7">
            <div className="h-px w-10 bg-accent" />
            <span className="text-accent text-[13px] font-semibold tracking-[0.15em] uppercase">
              Premium Healthcare Platform
            </span>
          </div>

          <h1 className="font-serif text-[clamp(36px,5vw,56px)] font-bold text-white leading-[1.15] mb-6">
            당신의 건강,
            <br />
            <span className="text-accent">스마트</span>하게
            <br />
            관리하세요
          </h1>

          <p className="text-[17px] text-white/[0.65] leading-[1.7] mb-10 max-w-[480px]">
            실시간 예약부터 스마트 대기열, 간편 결제까지. 3개 현장 경험을
            통합한 차세대 병원 예약 관리 시스템을 경험해보세요.
          </p>

          <div className="flex gap-4 flex-wrap mb-12">
            <Link href="/booking" className="btn-accent !px-8">
              지금 예약하기 →
            </Link>
            <Link href="/about" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 no-underline">
              서비스 둘러보기
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 border-t border-white/10 pt-7">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="transition-all duration-[600ms] ease-out"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${500 + i * 100}ms`,
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  paddingRight: i < 3 ? "16px" : 0,
                  paddingLeft: i > 0 ? "16px" : 0,
                }}
              >
                <div className="font-serif text-2xl font-bold text-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/[0.45] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Floating Card */}
        <div
          className="relative flex justify-center transition-all duration-[800ms] ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(40px)",
            transitionDelay: "500ms",
          }}
        >
          {/* Main Booking Card */}
          <div className="glass-card p-8 w-[360px] !bg-white/[0.08] !border-white/[0.12]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-[11px] text-accent font-semibold tracking-[0.1em] mb-1">
                  QUICK BOOKING
                </div>
                <div className="text-lg font-bold text-white">빠른 예약</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                <Calendar />
              </div>
            </div>

            {/* Select Department */}
            <div className="mb-4">
              <label className="text-xs text-white/50 font-medium block mb-1.5">
                진료과 선택
              </label>
              <div className="p-3 px-4 bg-white/[0.06] border border-white/10 rounded-[10px] text-white text-sm flex justify-between items-center">
                <span>내과</span>
                <ChevronRight />
              </div>
            </div>

            {/* Select Date */}
            <div className="mb-4">
              <label className="text-xs text-white/50 font-medium block mb-1.5">
                예약 날짜
              </label>
              <div className="p-3 px-4 bg-white/[0.06] border border-white/10 rounded-[10px] text-white text-sm flex justify-between items-center">
                <span>2026년 2월 9일 (월)</span>
                <Calendar size={18} />
              </div>
            </div>

            {/* Select Time */}
            <div className="mb-6">
              <label className="text-xs text-white/50 font-medium block mb-1.5">
                시간 선택
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["09:00", "10:30", "14:00"].map((t, i) => (
                  <div
                    key={t}
                    className={`p-2.5 text-center rounded-lg text-[13px] font-semibold cursor-pointer transition-all ${i === 1
                        ? "bg-accent text-primary-dark"
                        : "bg-white/[0.06] text-white border border-white/10 hover:bg-white/10"
                      }`}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="btn-accent w-full !py-3.5 !rounded-[10px] !text-[15px]"
            >
              예약 확정하기
            </button>
          </div>

          {/* Floating Notification - only shows after confirm */}
          <div
            className={`glass-card absolute top-5 -right-5 p-3 px-4 !bg-white/10 !border-white/15 flex items-center gap-2.5 transition-all duration-500 ${isConfirmed
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-3 pointer-events-none"
              }`}
          >
            <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-[13px] text-white font-medium">
              예약이 확정되었습니다
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
