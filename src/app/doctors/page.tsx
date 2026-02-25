"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Search,
  Star,
  ChevronRight,
  Clock,
} from "@/components/icons/Icons";

const API_BASE = "/api";

interface Doctor {
  id: number;
  name: string;
  departmentName: string;
  specialty: string;
  education: string;
  bio: string;
  career: string;
  tags: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  available: boolean;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/doctors`)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        const depts = Array.from(
          new Set(data.map((d: Doctor) => d.departmentName)),
        ) as string[];
        setDepartments(["전체", ...depts]);
      })
      .catch(() => setDoctors([]));
  }, []);

  const filtered = doctors.filter((d) => {
    const matchDept =
      selectedDept === "전체" || d.departmentName === selectedDept;
    const tagList = d.tags || [];
    const matchSearch =
      !searchQuery ||
      d.name.includes(searchQuery) ||
      d.specialty.includes(searchQuery) ||
      tagList.some((t) => t.includes(searchQuery));
    return matchDept && matchSearch;
  });

  const getEmoji = (name: string) => {
    const female = ["이수민", "최은지", "한서윤", "강미래"];
    return female.includes(name) ? "👩‍⚕️" : "👨‍⚕️";
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[64px]">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
              <Heart size={16} />
            </div>
            <div className="font-serif text-lg font-bold text-primary-dark leading-tight">
              MediBook
            </div>
          </Link>
          <Link
            href="/"
            className="text-[13px] text-[var(--text-muted)] no-underline hover:text-primary transition-colors"
          >
            ← 홈으로
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary-dark to-primary py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="gold-line" />
            <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">
              Medical Staff
            </span>
          </div>
          <h1 className="font-serif text-[36px] font-bold text-white mb-3">
            의료진 소개
          </h1>
          <p className="text-[15px] text-white/50 max-w-[480px]">
            각 분야 최고의 전문의가 정확한 진단과 치료를 제공합니다
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-[360px]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="의료진 검색 (이름, 전문분야...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border-[1.5px] border-[var(--border)] text-[13px] outline-none focus:border-primary transition-all bg-white"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all border-none whitespace-nowrap ${selectedDept === dept ? "bg-primary text-white" : "bg-white text-[var(--text-light)] hover:bg-primary/[0.04] hover:text-primary"}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[13px] text-[var(--text-muted)] mb-6">
          총 <span className="text-primary font-bold">{filtered.length}</span>
          명의 의료진
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doctor) => {
            const tagList = doctor.tags || [];
            return (
              <div
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor)}
                className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="bg-gradient-to-r from-primary/[0.03] to-accent/[0.03] p-6 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-[var(--border)] flex items-center justify-center text-3xl shadow-sm group-hover:shadow-md transition-shadow">
                      {getEmoji(doctor.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[16px] font-bold text-primary-dark">
                          {doctor.name}
                        </span>
                        {doctor.available ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(45,159,111,0.08)] text-[#2d9f6f] font-semibold">
                            진료 가능
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(107,114,128,0.08)] text-[#6b7280] font-semibold">
                            진료 마감
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[var(--text-light)]">
                        {doctor.specialty}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-accent" />
                      <span className="text-[13px] font-bold text-primary-dark">
                        {doctor.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      리뷰 {doctor.reviewCount}개
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      ·
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      경력 {doctor.experienceYears}년
                    </span>
                  </div>

                  {doctor.bio && (
                    <p className="text-[12px] text-[var(--text-light)] leading-[1.7] mb-4 line-clamp-2">
                      {doctor.bio}
                    </p>
                  )}

                  {tagList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tagList.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-primary/[0.04] text-primary font-medium"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/booking?dept=${encodeURIComponent(doctor.departmentName)}&doctor=${encodeURIComponent(doctor.name)}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[12px] font-semibold no-underline transition-all ${doctor.available ? "bg-primary/[0.06] text-primary hover:bg-primary hover:text-white" : "bg-[var(--bg)] text-[var(--text-muted)] pointer-events-none"}`}
                  >
                    {doctor.available ? "예약하기" : "예약 마감"}{" "}
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-[16px] font-bold text-primary-dark mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-[13px] text-[var(--text-muted)]">
              다른 검색어나 진료과를 선택해보세요
            </p>
          </div>
        )}
      </div>

      {selectedDoctor && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          onClick={() => setSelectedDoctor(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl max-w-[520px] w-full max-h-[80vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary/[0.04] to-accent/[0.04] p-8 relative">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary cursor-pointer transition-all"
              >
                ✕
              </button>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-white border border-[var(--border)] flex items-center justify-center text-5xl shadow-sm">
                  {getEmoji(selectedDoctor.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-[22px] font-bold text-primary-dark">
                      {selectedDoctor.name}
                    </h2>
                    {selectedDoctor.available ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(45,159,111,0.08)] text-[#2d9f6f] font-semibold">
                        진료 가능
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(107,114,128,0.08)] text-[#6b7280] font-semibold">
                        진료 마감
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-[var(--text-light)]">
                    {selectedDoctor.departmentName} · {selectedDoctor.specialty}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  {
                    label: "평점",
                    value: selectedDoctor.rating.toFixed(1),
                    sub: `${selectedDoctor.reviewCount}개 리뷰`,
                  },
                  {
                    label: "경력",
                    value: `${selectedDoctor.experienceYears}년`,
                    sub: "임상 경험",
                  },
                  {
                    label: "학력",
                    value: "의학박사",
                    sub: selectedDoctor.education || "-",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="text-center p-3 rounded-xl bg-[var(--bg)]"
                  >
                    <div className="text-[16px] font-bold text-primary-dark">
                      {s.value}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {s.label}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate">
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>

              {selectedDoctor.bio && (
                <>
                  <h3 className="text-[13px] font-bold text-primary-dark mb-2">
                    소개
                  </h3>
                  <p className="text-[13px] text-[var(--text-light)] leading-[1.8] mb-5">
                    {selectedDoctor.bio}
                  </p>
                </>
              )}

              {selectedDoctor.tags && selectedDoctor.tags.length > 0 && (
                <>
                  <h3 className="text-[13px] font-bold text-primary-dark mb-2">
                    전문 분야
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedDoctor.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-accent/[0.08] text-accent font-semibold"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="btn-outline flex-1 !py-3 !text-[13px]"
                >
                  닫기
                </button>
                {selectedDoctor.available && (
                  <Link
                    href={`/booking?dept=${encodeURIComponent(selectedDoctor.departmentName)}&doctor=${encodeURIComponent(selectedDoctor.name)}`}
                    className="btn-accent flex-1 !py-3 !text-[13px] no-underline text-center"
                  >
                    이 의료진으로 예약 →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
