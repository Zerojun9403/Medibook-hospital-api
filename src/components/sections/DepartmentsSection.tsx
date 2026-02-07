"use client";

import Link from "next/link";
import { departments } from "@/lib/constants";

export default function DepartmentsSection() {
  return (
    <section className="py-[120px] bg-gradient-to-b from-[#F5F4F0] to-bg">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-14 flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="text-xs font-semibold tracking-[0.15em] text-accent uppercase">
                Departments
              </span>
            </div>
            <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] font-bold text-primary-dark">
              진료과 안내
            </h2>
          </div>
          <Link href="/departments" className="btn-outline !px-6 !py-2.5 !text-[13px] no-underline">
            전체 진료과 보기 →
          </Link>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {departments.map((dept, i) => (
            <Link
              key={i}
              href={`/booking?dept=${encodeURIComponent(dept.name)}`}
              className="hover-glow bg-bg-card rounded-[14px] p-6 border border-[var(--border)] cursor-pointer transition-all duration-300 no-underline"
            >
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/[0.06] to-accent/[0.06] flex items-center justify-center text-2xl">
                  {dept.icon}
                </div>
                <div>
                  <div className="text-base font-bold text-primary-dark">
                    {dept.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    전문의 {dept.doctors}명
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-[var(--text-light)] leading-[1.55] mb-3.5">
                {dept.desc}
              </p>
              <div className="flex justify-between items-center pt-3.5 border-t border-[var(--border)]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                  <span className="text-xs text-[var(--success)] font-semibold">
                    예약 가능
                  </span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">
                  대기 {dept.wait}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
