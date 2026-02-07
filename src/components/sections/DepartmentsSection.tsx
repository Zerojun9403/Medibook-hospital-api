"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { departmentAPI } from "@/lib/api";
import { departments as fallbackDepts } from "@/lib/constants";

interface Department {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export default function DepartmentsSection() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    departmentAPI.getAll()
      .then((data) => setDepartments(data))
      .catch(() => {
        // API 실패 시 기존 하드코딩 데이터 사용
        setDepartments(fallbackDepts.map((d, i) => ({
          id: i + 1,
          name: d.name,
          description: d.desc,
          icon: d.icon,
        })));
      });
  }, []);

  return (
    <section className="py-[120px] bg-gradient-to-b from-[#F5F4F0] to-bg">
      <div className="section-container">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {departments.map((dept) => (
            <Link
              key={dept.id}
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
                </div>
              </div>
              <p className="text-[13px] text-[var(--text-light)] leading-[1.55] mb-3.5">
                {dept.description}
              </p>
              <div className="flex justify-between items-center pt-3.5 border-t border-[var(--border)]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                  <span className="text-xs text-[var(--success)] font-semibold">
                    예약 가능
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}