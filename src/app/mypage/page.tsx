"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Calendar, Clock, CreditCard, ChevronRight, Bell, Shield } from "@/components/icons/Icons";

interface User {
    name: string;
    role: string;
    email?: string;
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    CONFIRMED: { label: "확정", color: "#2d9f6f", bg: "rgba(45,159,111,0.08)" },
    WAITING: { label: "대기중", color: "#e8a838", bg: "rgba(232,168,56,0.08)" },
    IN_PROGRESS: { label: "진료중", color: "#2a6f97", bg: "rgba(42,111,151,0.08)" },
    COMPLETED: { label: "완료", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
    CANCELLED: { label: "취소", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
};

// Mock 예약 데이터
const mockReservations = [
    { id: 1, code: "RES-20260210-001", doctor: "김정현", dept: "내과", date: "2026-02-10", time: "10:00", status: "CONFIRMED", fee: 15000 },
    { id: 2, code: "RES-20260214-002", doctor: "최은지", dept: "피부과", date: "2026-02-14", time: "14:30", status: "WAITING", fee: 20000 },
    { id: 3, code: "RES-20260201-003", doctor: "이수민", dept: "소아과", date: "2026-02-01", time: "11:00", status: "COMPLETED", fee: 12000 },
    { id: 4, code: "RES-20260125-004", doctor: "박현우", dept: "정형외과", date: "2026-01-25", time: "09:30", status: "COMPLETED", fee: 25000 },
    { id: 5, code: "RES-20260120-005", doctor: "정민호", dept: "내과", date: "2026-01-20", time: "15:00", status: "CANCELLED", fee: 15000 },
];

const mockNotifications = [
    { id: 1, message: "2월 10일 내과 예약이 확정되었습니다", date: "2026-02-06", isRead: false },
    { id: 2, message: "피부과 예약 대기 중입니다", date: "2026-02-05", isRead: false },
    { id: 3, message: "2월 1일 소아과 진료가 완료되었습니다", date: "2026-02-01", isRead: true },
    { id: 4, message: "처방전이 발급되었습니다", date: "2026-01-25", isRead: true },
];

type Tab = "reservations" | "notifications" | "profile";

export default function MyPage() {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("reservations");
    const [filterStatus, setFilterStatus] = useState("전체");

    useEffect(() => {
        const u = localStorage.getItem("user");
        if (u) setUser(JSON.parse(u));
    }, []);

    const filteredReservations = filterStatus === "전체"
        ? mockReservations
        : mockReservations.filter((r) => r.status === filterStatus);

    const tabs: { key: Tab; label: string; icon: string; count?: number }[] = [
        { key: "reservations", label: "예약 내역", icon: "📅", count: mockReservations.filter((r) => r.status === "CONFIRMED" || r.status === "WAITING").length },
        { key: "notifications", label: "알림", icon: "🔔", count: mockNotifications.filter((n) => !n.isRead).length },
        { key: "profile", label: "내 정보", icon: "👤" },
    ];

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
                    <Link href="/patient/dashboard" className="text-[13px] text-[var(--text-muted)] no-underline hover:text-primary transition-colors">
                        ← 대시보드
                    </Link>
                </div>
            </header>

            <div className="max-w-[1200px] mx-auto px-6 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl border border-[var(--border)] p-6 mb-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-[28px] font-bold text-primary">
                            {user?.name?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-[22px] font-bold text-primary-dark">{user?.name || "사용자"}님</h1>
                            <p className="text-[13px] text-[var(--text-light)]">{user?.email} · {user?.role === "PATIENT" ? "일반 환자" : user?.role}</p>
                        </div>
                        <Link href="/booking" className="btn-accent !py-2.5 !px-5 !text-[12px] no-underline hidden sm:inline-flex">
                            새 예약 +
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold cursor-pointer transition-all border-none whitespace-nowrap ${activeTab === tab.key
                                    ? "bg-primary text-white"
                                    : "bg-white text-[var(--text-light)] hover:bg-primary/[0.04]"
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                            {tab.count && tab.count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "reservations" && (
                    <div className="animate-fadeIn">
                        {/* Status Filter */}
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                            {["전체", "CONFIRMED", "WAITING", "COMPLETED", "CANCELLED"].map((status) => {
                                const label = status === "전체" ? "전체" : statusMap[status]?.label || status;
                                return (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-lg text-[11px] font-semibold cursor-pointer transition-all border-none whitespace-nowrap ${filterStatus === status
                                                ? "bg-primary/10 text-primary"
                                                : "bg-white text-[var(--text-muted)] hover:text-primary"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Reservation List */}
                        <div className="flex flex-col gap-3">
                            {filteredReservations.map((res) => {
                                const status = statusMap[res.status] || statusMap.WAITING;
                                const isPast = res.status === "COMPLETED" || res.status === "CANCELLED";
                                return (
                                    <div key={res.id} className={`bg-white rounded-2xl border border-[var(--border)] p-5 transition-all ${isPast ? "opacity-70" : "hover:shadow-md"}`}>
                                        <div className="flex items-center gap-4">
                                            {/* Date Block */}
                                            <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${isPast ? "bg-[var(--bg)]" : "bg-gradient-to-br from-primary to-primary-light text-white"
                                                }`}>
                                                <div className={`text-[10px] font-medium ${isPast ? "text-[var(--text-muted)]" : "opacity-80"}`}>
                                                    {new Date(res.date).toLocaleDateString("ko-KR", { month: "short" })}
                                                </div>
                                                <div className={`text-[18px] font-bold leading-tight ${isPast ? "text-[var(--text-muted)]" : ""}`}>
                                                    {new Date(res.date).getDate()}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[14px] font-bold text-primary-dark">{res.doctor} 전문의</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ color: status.color, background: status.bg }}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div className="text-[12px] text-[var(--text-light)]">
                                                    {res.dept} · {res.time} · {res.code}
                                                </div>
                                            </div>

                                            {/* Fee & Action */}
                                            <div className="text-right flex-shrink-0 hidden sm:block">
                                                <div className="text-[14px] font-bold text-primary-dark">{res.fee.toLocaleString()}원</div>
                                                {!isPast && (
                                                    <button className="text-[11px] text-[var(--text-muted)] hover:text-[#ef4444] bg-transparent border-none cursor-pointer mt-1 transition-colors">
                                                        예약 취소
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredReservations.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-2xl border border-[var(--border)]">
                                <div className="text-5xl mb-4">📋</div>
                                <h3 className="text-[16px] font-bold text-primary-dark mb-2">예약 내역이 없습니다</h3>
                                <p className="text-[13px] text-[var(--text-muted)] mb-4">새로운 예약을 만들어보세요</p>
                                <Link href="/booking" className="btn-primary !py-2.5 !px-6 !text-[13px] no-underline">예약하기</Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "notifications" && (
                    <div className="animate-fadeIn flex flex-col gap-3">
                        {mockNotifications.map((noti) => (
                            <div key={noti.id} className={`bg-white rounded-xl border p-4 flex items-start gap-3 transition-all ${noti.isRead ? "border-[var(--border)] opacity-60" : "border-accent/20 bg-accent/[0.02]"
                                }`}>
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${noti.isRead ? "bg-[var(--border)]" : "bg-accent"}`} />
                                <div className="flex-1">
                                    <p className="text-[13px] text-[var(--text)] leading-[1.5]">{noti.message}</p>
                                    <span className="text-[11px] text-[var(--text-muted)] mt-1 block">{noti.date}</span>
                                </div>
                                {!noti.isRead && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold flex-shrink-0">NEW</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "profile" && (
                    <div className="animate-fadeIn max-w-[600px]">
                        <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                            <div className="p-6 border-b border-[var(--border)]">
                                <h3 className="text-[15px] font-bold text-primary-dark">기본 정보</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-5">
                                    {[
                                        { label: "이름", value: user?.name || "-" },
                                        { label: "이메일", value: user?.email || "-" },
                                        { label: "회원 유형", value: user?.role === "PATIENT" ? "일반 환자" : user?.role || "-" },
                                        { label: "가입일", value: "2026년 2월" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <span className="text-[13px] text-[var(--text-muted)]">{item.label}</span>
                                            <span className="text-[13px] font-semibold text-primary-dark">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-5 rounded-2xl bg-primary/[0.03] border border-primary/[0.08]">
                            <div className="flex items-start gap-3">
                                <Shield size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-[12px] font-semibold text-primary-dark mb-1">개인정보 보호</div>
                                    <p className="text-[11px] text-[var(--text-light)] leading-[1.6]">
                                        회원님의 개인정보는 BCrypt로 암호화되어 안전하게 보호됩니다.
                                        비밀번호 변경이나 계정 관련 문의는 고객센터로 연락해주세요.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
