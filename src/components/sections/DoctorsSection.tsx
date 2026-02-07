"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doctorAPI } from "@/lib/api";
import { doctorsData as fallbackDoctors } from "@/lib/constants";
import { Star } from "@/components/icons/Icons";

interface Doctor {
  id: number;
  name: string;
  departmentName: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
}

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    doctorAPI.getAll()
      .then((data) => setDoctors(data.slice(0, 3)))
      .catch(() => {
        setDoctors(fallbackDoctors.map((d, i) => ({
          id: i + 1,
          name: d.name,
          departmentName: d.dept,
          specialty: d.specialty,
          rating: d.rating,
          reviewCount: d.reviews,
          experienceYears: parseInt(d.exp),
        })));
      });
  }, []);

  const doctorEmoji = (index: number) => index % 2 === 0 ? "👨‍⚕️" : "👩‍⚕️";

  return (
    <section className="py-[120px] bg-bg">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <span className="text-xs font-semibold tracking-[0.15em] text-accent uppercase block mb-4">
            Medical Staff
          </span>
          <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] font-bold text-primary-dark">
            추천 의료진
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc, i) => (
            <div
              key={doc.id}
              className="hover-lift bg-bg-card rounded-2xl p-7 border border-[var(--border)]"
            >
              <div className="flex gap-4 mb-5">
                <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-primary/[0.06] to-accent/[0.06] flex items-center justify-center text-4xl flex-shrink-0">
                  {doctorEmoji(i)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-primary-dark">
                      {doc.name} 전문의
                    </h3>
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-accent-light text-primary-dark">
                      {doc.departmentName}
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--text-light)] mb-2">
                    {doc.specialty}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star />
                      <span className="text-sm font-bold text-primary-dark">
                        {doc.rating}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        ({doc.reviewCount})
                      </span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      경력 {doc.experienceYears}년
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Link
                  href={`/booking?dept=${encodeURIComponent(doc.departmentName)}&doctor=${encodeURIComponent(doc.name)}`}
                  className="btn-primary flex-1 !py-2.5 !text-[13px] !rounded-[10px] no-underline text-center"
                >
                  예약하기
                </Link>
                <Link href="/doctors" className="btn-outline !px-4 !py-2.5 !text-[13px] !rounded-[10px] no-underline">
                  프로필
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}