"use client";

import Link from "next/link";
import { Heart, Shield, Users, Calendar, Activity, Star, ChevronRight } from "@/components/icons/Icons";

export default function AboutPage() {
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

            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-dark to-primary py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                <div className="absolute top-[15%] right-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(200,169,110,0.1),transparent_70%)] blur-[80px]" />
                <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="gold-line" />
                        <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">About MediBook</span>
                    </div>
                    <h1 className="font-serif text-[42px] font-bold text-white leading-[1.2] mb-4">
                        환자 중심의<br /><span className="text-accent">스마트 의료</span> 서비스
                    </h1>
                    <p className="text-[16px] text-white/50 max-w-[520px] leading-[1.8]">
                        MediBook은 최신 IT 기술과 의료 서비스를 결합하여 환자에게 최상의 의료 경험을 제공합니다
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 bg-white border-b border-[var(--border)]">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: "2018", label: "설립 연도", suffix: "년" },
                            { value: "52", label: "전문 의료진", suffix: "명" },
                            { value: "15,000+", label: "월간 진료 건수", suffix: "" },
                            { value: "4.9", label: "환자 만족도", suffix: "/5.0" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-[28px] font-bold text-primary-dark">
                                    {stat.value}<span className="text-accent text-[16px]">{stat.suffix}</span>
                                </div>
                                <div className="text-[12px] text-[var(--text-muted)] mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-6">
                {/* Mission & Vision */}
                <section className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="gold-line" />
                                <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">Our Mission</span>
                            </div>
                            <h2 className="text-[24px] font-bold text-primary-dark mb-4">미션</h2>
                            <p className="text-[14px] text-[var(--text-light)] leading-[1.9] mb-6">
                                MediBook은 "더 나은 의료 접근성"을 미션으로 디지털 기술을 활용하여 환자와 의료진 간의 소통을 혁신하고, 대기 시간 없는 효율적인 의료 서비스를 구현합니다.
                            </p>
                            <div className="flex flex-col gap-3">
                                {["환자 중심의 편리한 예약 시스템", "실시간 대기열로 시간 낭비 제로", "안전하고 투명한 의료 서비스"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                        <span className="text-[13px] text-[var(--text)]">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="gold-line" />
                                <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">Our Vision</span>
                            </div>
                            <h2 className="text-[24px] font-bold text-primary-dark mb-4">비전</h2>
                            <p className="text-[14px] text-[var(--text-light)] leading-[1.9] mb-6">
                                대한민국 1위 스마트 병원 예약 플랫폼으로 성장하여, 모든 환자가 쉽고 빠르게 최적의 의료 서비스를 받을 수 있는 환경을 만들겠습니다.
                            </p>
                            <div className="bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] rounded-2xl p-6 border border-primary/[0.08]">
                                <div className="text-accent text-[32px] font-serif font-bold mb-2">&ldquo;</div>
                                <p className="text-[14px] text-primary-dark leading-[1.8] italic">
                                    기술은 사람을 위해 존재합니다. MediBook은 환자의 시간과 건강을 가장 소중히 여기는 플랫폼이 되겠습니다.
                                </p>
                                <div className="mt-3 text-[12px] text-[var(--text-muted)]">— MediBook 대표</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-16 border-t border-[var(--border)]">
                    <div className="text-center mb-12">
                        <div className="gold-line mx-auto mb-4" />
                        <h2 className="text-[24px] font-bold text-primary-dark mb-2">핵심 가치</h2>
                        <p className="text-[14px] text-[var(--text-light)]">MediBook이 추구하는 4가지 핵심 가치</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Heart size={24} />, title: "환자 중심", desc: "모든 서비스 설계의 중심에 환자를 놓습니다. 편의성과 접근성을 최우선으로 합니다.", color: "#ef4444" },
                            { icon: <Shield size={24} />, title: "신뢰와 안전", desc: "최고 수준의 보안 기술로 환자의 개인정보와 의료 데이터를 보호합니다.", color: "#1b4d6e" },
                            { icon: <Activity size={24} />, title: "기술 혁신", desc: "최신 기술을 적극 도입하여 의료 서비스의 효율성과 품질을 높입니다.", color: "#2d9f6f" },
                            { icon: <Users size={24} />, title: "소통과 협력", desc: "환자, 의료진, 관리자 모두가 원활하게 소통하는 플랫폼을 구축합니다.", color: "#c8a96e" },
                        ].map((value, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-[var(--border)] p-7 hover-lift text-center">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${value.color}10`, color: value.color }}>
                                    {value.icon}
                                </div>
                                <h3 className="text-[15px] font-bold text-primary-dark mb-2">{value.title}</h3>
                                <p className="text-[12px] text-[var(--text-light)] leading-[1.7]">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Facilities */}
                <section className="py-16 border-t border-[var(--border)]">
                    <div className="text-center mb-12">
                        <div className="gold-line mx-auto mb-4" />
                        <h2 className="text-[24px] font-bold text-primary-dark mb-2">시설 안내</h2>
                        <p className="text-[14px] text-[var(--text-light)]">최신 시설과 편안한 환경으로 최상의 의료 서비스를 제공합니다</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { floor: "5F", name: "수술실 · 회복실", desc: "최신 수술 장비와 쾌적한 회복 환경", icon: "🏥" },
                            { floor: "4F", name: "검사실 · 영상의학과", desc: "MRI, CT, X-ray 등 첨단 검사 장비", icon: "🔬" },
                            { floor: "3F", name: "외래 진료실", desc: "8개 진료과 전문 진료실 운영", icon: "🩺" },
                            { floor: "2F", name: "접수 · 대기 라운지", desc: "온라인 접수 키오스크, 카페 라운지", icon: "☕" },
                            { floor: "1F", name: "로비 · 약국", desc: "안내 데스크, 원내 약국 운영", icon: "💊" },
                            { floor: "B1-B3", name: "주차장", desc: "환자 2시간 무료, 발렛파킹 지원", icon: "🅿️" },
                        ].map((facility, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-[var(--border)] p-6 flex items-start gap-4 hover:shadow-sm transition-all">
                                <div className="w-12 h-12 rounded-xl bg-primary/[0.06] flex items-center justify-center text-2xl flex-shrink-0">
                                    {facility.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold">{facility.floor}</span>
                                        <span className="text-[14px] font-bold text-primary-dark">{facility.name}</span>
                                    </div>
                                    <p className="text-[12px] text-[var(--text-light)]">{facility.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="py-16 border-t border-[var(--border)]">
                    <div className="text-center mb-12">
                        <div className="gold-line mx-auto mb-4" />
                        <h2 className="text-[24px] font-bold text-primary-dark mb-2">기술 스택</h2>
                        <p className="text-[14px] text-[var(--text-light)]">MediBook을 구동하는 기술</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: "Next.js 14", category: "Frontend", color: "#000" },
                            { name: "TypeScript", category: "Language", color: "#3178c6" },
                            { name: "Tailwind CSS", category: "Styling", color: "#06b6d4" },
                            { name: "Spring Boot", category: "Backend", color: "#6db33f" },
                            { name: "PostgreSQL", category: "Database", color: "#336791" },
                            { name: "Redis", category: "Cache / Queue", color: "#dc382d" },
                            { name: "JWT", category: "Authentication", color: "#000" },
                            { name: "WebSocket", category: "Real-time", color: "#1b4d6e" },
                        ].map((tech, i) => (
                            <div key={i} className="bg-white rounded-xl border border-[var(--border)] p-4 text-center hover:shadow-sm transition-all">
                                <div className="text-[14px] font-bold text-primary-dark mb-1">{tech.name}</div>
                                <div className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block" style={{ background: `${tech.color}10`, color: tech.color }}>
                                    {tech.category}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-br from-primary-dark to-primary">
                <div className="max-w-[1200px] mx-auto px-6 text-center">
                    <h2 className="font-serif text-[28px] font-bold text-white mb-3">지금 바로 예약하세요</h2>
                    <p className="text-white/50 mb-8 text-[14px]">간편한 온라인 예약으로 대기 없는 진료를 경험하세요</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/booking" className="btn-accent !py-3.5 !px-8 !text-[14px] no-underline">
                            예약하기 →
                        </Link>
                        <Link href="/location" className="btn-outline !py-3.5 !px-8 !text-[14px] !text-white !border-white/30 hover:!bg-white/10 hover:!text-white no-underline">
                            찾아오시는 길
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
