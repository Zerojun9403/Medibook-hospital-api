"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Search, Star, ChevronRight, Clock } from "@/components/icons/Icons";

const allDoctors = [
    { id: 1, name: "김정현", dept: "내과", specialty: "소화기내과 전문의", rating: 4.9, reviews: 342, exp: "15년", education: "서울대학교 의과대학", bio: "소화기 질환 분야의 권위자로, 내시경 진단 및 치료에 풍부한 경험을 보유하고 있습니다.", tags: ["소화기", "내시경", "만성질환"], img: "👨‍⚕️", available: true },
    { id: 2, name: "이수민", dept: "소아과", specialty: "소아 알레르기 전문의", rating: 4.8, reviews: 287, exp: "12년", education: "연세대학교 의과대학", bio: "소아 알레르기와 면역 질환을 전문으로 진료하며, 아이들의 건강한 성장을 돕습니다.", tags: ["소아알레르기", "아토피", "천식"], img: "👩‍⚕️", available: true },
    { id: 3, name: "박현우", dept: "정형외과", specialty: "스포츠 의학 전문의", rating: 4.9, reviews: 198, exp: "18년", education: "고려대학교 의과대학", bio: "스포츠 손상과 관절 질환 분야에서 18년간의 풍부한 임상 경험을 가진 전문의입니다.", tags: ["스포츠손상", "관절", "재활"], img: "👨‍⚕️", available: true },
    { id: 4, name: "최은지", dept: "피부과", specialty: "미용 피부 전문의", rating: 4.7, reviews: 156, exp: "10년", education: "성균관대학교 의과대학", bio: "최신 레이저 기술과 피부 미용 시술의 전문가로, 피부 건강과 아름다움을 함께 추구합니다.", tags: ["미용", "레이저", "아토피"], img: "👩‍⚕️", available: true },
    { id: 5, name: "정민호", dept: "내과", specialty: "호흡기내과 전문의", rating: 4.8, reviews: 231, exp: "13년", education: "서울대학교 의과대학", bio: "호흡기 질환과 감염병 분야의 전문의로, 정확한 진단과 체계적인 치료를 제공합니다.", tags: ["호흡기", "감염병", "폐질환"], img: "👨‍⚕️", available: true },
    { id: 6, name: "한서윤", dept: "안과", specialty: "망막 전문의", rating: 4.9, reviews: 178, exp: "16년", education: "연세대학교 의과대학", bio: "망막 질환과 시력 교정 수술 분야에서 높은 성공률을 보유한 안과 전문의입니다.", tags: ["망막", "라식", "백내장"], img: "👩‍⚕️", available: false },
    { id: 7, name: "윤재호", dept: "치과", specialty: "교정 전문의", rating: 4.6, reviews: 203, exp: "11년", education: "서울대학교 치과대학", bio: "보이지 않는 교정과 심미 치료를 전문으로, 환자 맞춤형 교정 플랜을 제공합니다.", tags: ["교정", "임플란트", "심미치료"], img: "👨‍⚕️", available: true },
    { id: 8, name: "강미래", dept: "산부인과", specialty: "산과 전문의", rating: 4.8, reviews: 145, exp: "14년", education: "고려대학교 의과대학", bio: "임신과 출산 전 과정을 함께하며, 산모와 아기의 건강을 최우선으로 생각합니다.", tags: ["임신", "출산", "산전검진"], img: "👩‍⚕️", available: true },
    { id: 9, name: "오성민", dept: "외과", specialty: "일반외과 전문의", rating: 4.7, reviews: 189, exp: "17년", education: "성균관대학교 의과대학", bio: "복강경 수술의 전문가로, 최소 침습 수술을 통해 빠른 회복을 돕습니다.", tags: ["복강경", "최소침습", "외상"], img: "👨‍⚕️", available: true },
];

const deptList = ["전체", "내과", "외과", "소아과", "정형외과", "피부과", "안과", "치과", "산부인과"];

export default function DoctorsPage() {
    const [selectedDept, setSelectedDept] = useState("전체");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState<typeof allDoctors[0] | null>(null);

    const filtered = allDoctors.filter((d) => {
        const matchDept = selectedDept === "전체" || d.dept === selectedDept;
        const matchSearch = d.name.includes(searchQuery) || d.specialty.includes(searchQuery) || d.tags.some((t) => t.includes(searchQuery));
        return matchDept && matchSearch;
    });

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            {/* Header */}
            <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
                <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[64px]">
                    <Link href="/" className="flex items-center gap-2.5 no-underline">
                        <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
                            <Heart size={16} />
                        </div>
                        <div className="font-serif text-lg font-bold text-primary-dark leading-tight">MediBook</div>
                    </Link>
                    <Link href="/" className="text-[13px] text-[var(--text-muted)] no-underline hover:text-primary transition-colors">
                        ← 홈으로
                    </Link>
                </div>
            </header>

            {/* Hero Banner */}
            <section className="bg-gradient-to-br from-primary-dark to-primary py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="gold-line" />
                        <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">Medical Staff</span>
                    </div>
                    <h1 className="font-serif text-[36px] font-bold text-white mb-3">의료진 소개</h1>
                    <p className="text-[15px] text-white/50 max-w-[480px]">
                        각 분야 최고의 전문의가 정확한 진단과 치료를 제공합니다
                    </p>
                </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-6 py-10">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {/* Search */}
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

                    {/* Department Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {deptList.map((dept) => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDept(dept)}
                                className={`px-4 py-2.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all border-none whitespace-nowrap ${selectedDept === dept
                                        ? "bg-primary text-white"
                                        : "bg-white text-[var(--text-light)] hover:bg-primary/[0.04] hover:text-primary"
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-[13px] text-[var(--text-muted)] mb-6">
                    총 <span className="text-primary font-bold">{filtered.length}</span>명의 의료진
                </div>

                {/* Doctor Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((doctor) => (
                        <div
                            key={doctor.id}
                            onClick={() => setSelectedDoctor(doctor)}
                            className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            {/* Card Top */}
                            <div className="bg-gradient-to-r from-primary/[0.03] to-accent/[0.03] p-6 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white border border-[var(--border)] flex items-center justify-center text-3xl shadow-sm group-hover:shadow-md transition-shadow">
                                        {doctor.img}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[16px] font-bold text-primary-dark">{doctor.name}</span>
                                            {doctor.available ? (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(45,159,111,0.08)] text-[#2d9f6f] font-semibold">진료 가능</span>
                                            ) : (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(107,114,128,0.08)] text-[#6b7280] font-semibold">진료 마감</span>
                                            )}
                                        </div>
                                        <div className="text-[12px] text-[var(--text-light)]">{doctor.specialty}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 pt-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-accent" />
                                        <span className="text-[13px] font-bold text-primary-dark">{doctor.rating}</span>
                                    </div>
                                    <span className="text-[11px] text-[var(--text-muted)]">리뷰 {doctor.reviews}개</span>
                                    <span className="text-[11px] text-[var(--text-muted)]">·</span>
                                    <span className="text-[11px] text-[var(--text-muted)]">경력 {doctor.exp}</span>
                                </div>

                                <p className="text-[12px] text-[var(--text-light)] leading-[1.7] mb-4 line-clamp-2">
                                    {doctor.bio}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {doctor.tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-primary/[0.04] text-primary font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Action */}
                                <Link
                                    href={`/booking?dept=${encodeURIComponent(doctor.dept)}&doctor=${encodeURIComponent(doctor.name)}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[12px] font-semibold no-underline transition-all ${doctor.available
                                            ? "bg-primary/[0.06] text-primary hover:bg-primary hover:text-white"
                                            : "bg-[var(--bg)] text-[var(--text-muted)] pointer-events-none"
                                        }`}
                                >
                                    {doctor.available ? "예약하기" : "예약 마감"} <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-[16px] font-bold text-primary-dark mb-2">검색 결과가 없습니다</h3>
                        <p className="text-[13px] text-[var(--text-muted)]">다른 검색어나 진료과를 선택해보세요</p>
                    </div>
                )}
            </div>

            {/* Doctor Detail Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={() => setSelectedDoctor(null)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div
                        className="relative bg-white rounded-2xl max-w-[520px] w-full max-h-[80vh] overflow-y-auto animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-primary/[0.04] to-accent/[0.04] p-8 relative">
                            <button
                                onClick={() => setSelectedDoctor(null)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary cursor-pointer transition-all"
                            >
                                ✕
                            </button>
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 rounded-2xl bg-white border border-[var(--border)] flex items-center justify-center text-5xl shadow-sm">
                                    {selectedDoctor.img}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-[22px] font-bold text-primary-dark">{selectedDoctor.name}</h2>
                                        {selectedDoctor.available ? (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(45,159,111,0.08)] text-[#2d9f6f] font-semibold">진료 가능</span>
                                        ) : (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(107,114,128,0.08)] text-[#6b7280] font-semibold">진료 마감</span>
                                        )}
                                    </div>
                                    <div className="text-[13px] text-[var(--text-light)]">{selectedDoctor.dept} · {selectedDoctor.specialty}</div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[
                                    { label: "평점", value: selectedDoctor.rating.toString(), sub: `${selectedDoctor.reviews}개 리뷰` },
                                    { label: "경력", value: selectedDoctor.exp, sub: "임상 경험" },
                                    { label: "학력", value: "의학박사", sub: selectedDoctor.education },
                                ].map((s, i) => (
                                    <div key={i} className="text-center p-3 rounded-xl bg-[var(--bg)]">
                                        <div className="text-[16px] font-bold text-primary-dark">{s.value}</div>
                                        <div className="text-[10px] text-[var(--text-muted)]">{s.label}</div>
                                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate">{s.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Bio */}
                            <h3 className="text-[13px] font-bold text-primary-dark mb-2">소개</h3>
                            <p className="text-[13px] text-[var(--text-light)] leading-[1.8] mb-5">
                                {selectedDoctor.bio}
                            </p>

                            {/* Tags */}
                            <h3 className="text-[13px] font-bold text-primary-dark mb-2">전문 분야</h3>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedDoctor.tags.map((tag, i) => (
                                    <span key={i} className="text-[11px] px-3 py-1.5 rounded-full bg-accent/[0.08] text-accent font-semibold">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="flex gap-3">
                                <button onClick={() => setSelectedDoctor(null)} className="btn-outline flex-1 !py-3 !text-[13px]">
                                    닫기
                                </button>
                                {selectedDoctor.available && (
                                    <Link href={`/booking?dept=${encodeURIComponent(selectedDoctor.dept)}&doctor=${encodeURIComponent(selectedDoctor.name)}`} className="btn-accent flex-1 !py-3 !text-[13px] no-underline text-center">
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
