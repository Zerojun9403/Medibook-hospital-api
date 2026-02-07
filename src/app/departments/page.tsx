"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Clock, Users, ChevronRight, Search } from "@/components/icons/Icons";
import { departments } from "@/lib/constants";

// 진료과 상세 정보
const deptDetails: Record<string, { fullDesc: string; services: string[]; hours: string }> = {
    "내과": {
        fullDesc: "소화기, 호흡기, 순환기, 내분비 등 내부 장기와 관련된 질환을 전문적으로 진료합니다. 만성 질환 관리와 건강검진도 함께 진행합니다.",
        services: ["일반 내과 진료", "건강검진", "만성질환 관리", "소화기 내시경", "호흡기 질환", "당뇨/고혈압 관리"],
        hours: "월~금 09:00-18:00 / 토 09:00-13:00",
    },
    "외과": {
        fullDesc: "수술이 필요한 질환에 대한 진단과 치료를 전문으로 합니다. 일반외과, 흉부외과, 혈관외과 등 다양한 분야를 다룹니다.",
        services: ["일반 외과 수술", "복강경 수술", "흉부외과", "혈관외과", "외상 치료", "상처 관리"],
        hours: "월~금 09:00-17:00 / 토 09:00-12:00",
    },
    "소아과": {
        fullDesc: "신생아부터 청소년까지 성장 과정에서 발생할 수 있는 다양한 질환을 전문적으로 진료하고 예방접종을 실시합니다.",
        services: ["영유아 검진", "예방접종", "소아 알레르기", "성장 발달 상담", "소아 감염 질환", "아토피 관리"],
        hours: "월~금 09:00-18:00 / 토 09:00-13:00",
    },
    "정형외과": {
        fullDesc: "뼈, 관절, 근육, 인대 등 근골격계 질환과 스포츠 손상을 전문적으로 진료합니다.",
        services: ["관절 질환", "스포츠 손상", "척추 질환", "골절 치료", "인공관절 수술", "물리치료"],
        hours: "월~금 09:00-18:00 / 토 09:00-13:00",
    },
    "피부과": {
        fullDesc: "각종 피부 질환의 진단과 치료, 알레르기 검사, 미용 피부 시술을 전문적으로 시행합니다.",
        services: ["아토피/습진", "여드름 치료", "피부 알레르기", "레이저 시술", "보톡스/필러", "피부 검진"],
        hours: "월~금 10:00-19:00 / 토 10:00-14:00",
    },
    "안과": {
        fullDesc: "눈의 각종 질환 진단과 치료, 시력 교정, 백내장/녹내장 수술을 전문으로 합니다.",
        services: ["시력 검사", "백내장 수술", "녹내장 치료", "라식/라섹", "안구건조증", "망막 질환"],
        hours: "월~금 09:00-18:00 / 토 09:00-13:00",
    },
    "치과": {
        fullDesc: "구강 건강 전반에 걸친 진료와 교정, 임플란트, 심미 치료를 전문적으로 시행합니다.",
        services: ["충치 치료", "치아 교정", "임플란트", "스케일링", "치아 미백", "사랑니 발치"],
        hours: "월~금 09:30-18:30 / 토 09:30-14:00",
    },
    "산부인과": {
        fullDesc: "여성 건강 전반을 관리하며, 임신과 출산, 부인과 질환을 전문적으로 진료합니다.",
        services: ["산전 검진", "임신/출산 관리", "부인과 질환", "자궁경부암 검사", "갱년기 관리", "피임 상담"],
        hours: "월~금 09:00-17:00 / 토 09:00-12:00",
    },
};

export default function DepartmentsPage() {
    const [selectedDept, setSelectedDept] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = departments.filter(
        (d) => d.name.includes(searchQuery) || d.desc.includes(searchQuery)
    );

    const detail = selectedDept ? deptDetails[selectedDept] : null;

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
                        <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">Departments</span>
                    </div>
                    <h1 className="font-serif text-[36px] font-bold text-white mb-3">진료과 안내</h1>
                    <p className="text-[15px] text-white/50 max-w-[480px]">
                        각 분야 최고의 전문의가 환자 맞춤형 진료를 제공합니다
                    </p>
                </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-6 py-10">
                {/* Search */}
                <div className="relative max-w-[400px] mb-8">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="진료과 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-[1.5px] border-[var(--border)] text-[13px] outline-none focus:border-primary transition-all bg-white"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Department List */}
                    <div className="lg:col-span-1">
                        <div className="flex flex-col gap-3">
                            {filtered.map((dept, i) => {
                                const isSelected = selectedDept === dept.name;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDept(dept.name)}
                                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all text-left w-full border-2 ${isSelected
                                                ? "bg-primary border-primary text-white"
                                                : "bg-white border-[var(--border)] hover:border-primary/30 hover:shadow-sm"
                                            }`}
                                    >
                                        <span className="text-3xl flex-shrink-0">{dept.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-[14px] font-bold ${isSelected ? "text-white" : "text-primary-dark"}`}>
                                                {dept.name}
                                            </div>
                                            <div className={`text-[11px] mt-0.5 ${isSelected ? "text-white/60" : "text-[var(--text-muted)]"}`}>
                                                전문의 {dept.doctors}명 · 대기 {dept.wait}
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className={isSelected ? "text-white/50" : "text-[var(--text-muted)]"} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Department Detail */}
                    <div className="lg:col-span-2">
                        {selectedDept && detail ? (
                            <div className="animate-fadeIn">
                                {/* Detail Header */}
                                <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden mb-6">
                                    <div className="bg-gradient-to-r from-primary/[0.04] to-accent/[0.04] p-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-20 h-20 rounded-2xl bg-white border border-[var(--border)] flex items-center justify-center text-5xl shadow-sm">
                                                {departments.find((d) => d.name === selectedDept)?.icon}
                                            </div>
                                            <div>
                                                <h2 className="text-[24px] font-bold text-primary-dark mb-1">{selectedDept}</h2>
                                                <div className="flex items-center gap-4 text-[12px] text-[var(--text-light)]">
                                                    <span className="flex items-center gap-1"><Users size={14} /> 전문의 {departments.find((d) => d.name === selectedDept)?.doctors}명</span>
                                                    <span className="flex items-center gap-1"><Clock size={14} /> 대기 {departments.find((d) => d.name === selectedDept)?.wait}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <p className="text-[14px] text-[var(--text-light)] leading-[1.8] mb-6">
                                            {detail.fullDesc}
                                        </p>

                                        {/* Services */}
                                        <h3 className="text-[14px] font-bold text-primary-dark mb-3">주요 진료 항목</h3>
                                        <div className="grid grid-cols-2 gap-2 mb-6">
                                            {detail.services.map((service, i) => (
                                                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-[var(--bg)] text-[12px]">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                                    <span className="text-[var(--text)]">{service}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Hours */}
                                        <h3 className="text-[14px] font-bold text-primary-dark mb-3">진료 시간</h3>
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/[0.03] border border-primary/[0.08]">
                                            <Clock size={16} className="text-primary flex-shrink-0" />
                                            <span className="text-[13px] text-primary-dark">{detail.hours}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="flex gap-3">
                                    <Link href={`/doctors`} className="btn-outline flex-1 !py-3 !text-[13px] no-underline text-center">
                                        {selectedDept} 의료진 보기
                                    </Link>
                                    <Link href={`/booking`} className="btn-accent flex-1 !py-3 !text-[13px] no-underline text-center">
                                        예약하기 →
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[400px] bg-white rounded-2xl border border-[var(--border)]">
                                <div className="text-center">
                                    <div className="text-5xl mb-4">🏥</div>
                                    <h3 className="text-[16px] font-bold text-primary-dark mb-2">진료과를 선택해주세요</h3>
                                    <p className="text-[13px] text-[var(--text-muted)]">왼쪽 목록에서 진료과를 클릭하면 상세 정보를 확인할 수 있습니다</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
