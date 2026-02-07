"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-[100px] bg-gradient-to-br from-primary-dark to-primary relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(200,169,110,0.08),transparent_70%)]" />

      <div className="section-container text-center relative z-[2]">
        <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-bold text-white mb-5">
          지금 바로 시작하세요
        </h2>
        <p className="text-[17px] text-white/60 max-w-[520px] mx-auto mb-10 leading-[1.7]">
          회원가입 후 3분 안에 첫 예약을 완료할 수 있습니다.
          <br />
          더 나은 의료 경험이 여기서 시작됩니다.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="btn-accent !px-10 !py-4 !text-base">
            무료로 시작하기
          </Link>
          <button className="btn-outline !border-white/25 !text-white !px-10 !py-4 !text-base hover:!bg-white/10">
            데모 체험하기
          </button>
        </div>
      </div>
    </section>
  );
}
