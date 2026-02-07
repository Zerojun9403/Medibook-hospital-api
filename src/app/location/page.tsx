"use client";

import Link from "next/link";
import { Heart, Clock, Phone, MapPin } from "@/components/icons/Icons";

export default function LocationPage() {
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
            <section className="bg-gradient-to-br from-primary-dark to-primary py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="gold-line" />
                        <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">Location</span>
                    </div>
                    <h1 className="font-serif text-[36px] font-bold text-white mb-3">찾아오시는 길</h1>
                    <p className="text-[15px] text-white/50">편리한 교통편으로 쉽게 방문하실 수 있습니다</p>
                </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Map Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                            {/* Embedded Map Placeholder */}
                            <div className="relative w-full h-[400px] bg-[#e8e6e1] flex items-center justify-center">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.354!2d127.028!3d37.4979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDI5JzUyLjQiTiAxMjfCsDAxJzQxLjAiRQ!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0"
                                />
                                {/* Fallback */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                                    <div className="text-center">
                                        <div className="text-5xl mb-3">📍</div>
                                        <p className="text-[14px] font-semibold text-primary-dark">서울시 강남구 테헤란로 123</p>
                                        <p className="text-[12px] text-[var(--text-muted)]">MediBook 빌딩 2-5층</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address Bar */}
                            <div className="p-5 flex items-center justify-between border-t border-[var(--border)]">
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-primary" />
                                    <div>
                                        <div className="text-[14px] font-bold text-primary-dark">서울특별시 강남구 테헤란로 123</div>
                                        <div className="text-[12px] text-[var(--text-muted)]">MediBook 빌딩 2-5층 (우: 06133)</div>
                                    </div>
                                </div>
                                <a
                                    href="https://map.naver.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-outline !py-2 !px-4 !text-[11px] no-underline hidden sm:inline-flex"
                                >
                                    네이버 지도 →
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Info Sidebar */}
                    <div className="flex flex-col gap-6">
                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                            <h3 className="text-[15px] font-bold text-primary-dark mb-5">연락처</h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    { icon: "📞", label: "대표전화", value: "02-1234-5678", sub: "평일 09:00 - 18:00" },
                                    { icon: "🚨", label: "응급실", value: "02-1234-9999", sub: "24시간 운영" },
                                    { icon: "📠", label: "팩스", value: "02-1234-5679", sub: "" },
                                    { icon: "📧", label: "이메일", value: "info@medibook.kr", sub: "" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="text-lg">{item.icon}</span>
                                        <div>
                                            <div className="text-[11px] text-[var(--text-muted)] mb-0.5">{item.label}</div>
                                            <div className="text-[14px] font-bold text-primary-dark">{item.value}</div>
                                            {item.sub && <div className="text-[11px] text-[var(--text-muted)]">{item.sub}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                            <h3 className="text-[15px] font-bold text-primary-dark mb-5 flex items-center gap-2">
                                <Clock size={16} /> 진료 시간
                            </h3>
                            <div className="flex flex-col gap-3">
                                {[
                                    { day: "월 - 금", time: "09:00 - 18:00", active: true },
                                    { day: "토요일", time: "09:00 - 13:00", active: true },
                                    { day: "일요일", time: "휴진", active: false },
                                    { day: "공휴일", time: "휴진", active: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-none">
                                        <span className="text-[13px] text-[var(--text)]">{item.day}</span>
                                        <span className={`text-[13px] font-semibold ${item.active ? "text-primary" : "text-[var(--text-muted)]"}`}>
                                            {item.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 rounded-lg bg-[var(--warning)]/[0.06] border border-[var(--warning)]/[0.15]">
                                <p className="text-[11px] text-[var(--text-light)]">
                                    ⚠️ 점심시간: 12:30 - 13:30 (토요일 제외)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transportation */}
                <div className="mt-10">
                    <h2 className="text-[20px] font-bold text-primary-dark mb-6">교통 안내</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            {
                                icon: "🚇",
                                title: "지하철",
                                lines: [
                                    "2호선 강남역 3번 출구 도보 5분",
                                    "신분당선 강남역 5번 출구 도보 3분",
                                    "9호선 신논현역 1번 출구 도보 8분",
                                ],
                            },
                            {
                                icon: "🚌",
                                title: "버스",
                                lines: [
                                    "간선: 140, 144, 145, 471",
                                    "지선: 3412, 4412",
                                    "광역: 9404, 9408",
                                    "강남역 정류장 하차",
                                ],
                            },
                            {
                                icon: "🚗",
                                title: "자가용 / 주차",
                                lines: [
                                    "건물 지하 1-3층 주차장 이용",
                                    "진료 환자 2시간 무료 주차",
                                    "이후 30분당 1,000원",
                                    "발렛파킹 서비스 운영",
                                ],
                            },
                        ].map((transport, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-[var(--border)] p-6 hover:shadow-sm transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">{transport.icon}</span>
                                    <h3 className="text-[15px] font-bold text-primary-dark">{transport.title}</h3>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {transport.lines.map((line, j) => (
                                        <div key={j} className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                            <span className="text-[12px] text-[var(--text-light)] leading-[1.5]">{line}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
