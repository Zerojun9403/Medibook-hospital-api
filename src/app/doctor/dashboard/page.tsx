"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Calendar, Clock, Bell, Activity, ChevronRight, Shield } from "@/components/icons/Icons";
import { tokenManager } from "@/lib/api";

interface User {
    name: string;
    role: string;
    email?: string;
}

interface Reservation {
    id: number;
    reservationCode: string;
    patientName: string;
    doctorName: string;
    departmentName: string;
    reservationDate: string;
    reservationTime: string;
    status: string;
    symptom: string;
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    CONFIRMED: { label: "확정", color: "#2d9f6f", bg: "rgba(45,159,111,0.08)" },
    WAITING: { label: "대기중", color: "#e8a838", bg: "rgba(232,168,56,0.08)" },
    IN_PROGRESS: { label: "진료중", color: "#2a6f97", bg: "rgba(42,111,151,0.08)" },
    COMPLETED: { label: "완료", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
    CANCELLED: { label: "취소", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
};

async function fetchDoctorReservations(token: string): Promise<Reservation[]> {
    const res = await fetch("http://localhost:8080/api/reservations/doctor", {
        headers: { Authorization: `Bearer ${token}` },
    });
    const text = await res.text();
    if (!res.ok) throw new Error("조회 실패");
    return text ? JSON.parse(text) : [];
}

export default function DoctorDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [currentTime, setCurrentTime] = useState("");
    const [greeting, setGreeting] = useState("");
    const [filter, setFilter] = useState<string>("ALL");

    useEffect(() => {
        const u = localStorage.getItem("user");
        if (u) setUser(JSON.parse(u));

        const updateTime = () => {
            const now = new Date();
            const h = now.getHours();
            setGreeting(h < 12 ? "좋은 아침이에요" : h < 18 ? "좋은 오후예요" : "좋은 저녁이에요");
            setCurrentTime(
                now.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const token = tokenManager.getAccessToken();
        if (token) {
            fetchDoctorReservations(token)
                .then((data) => setReservations(data))
                .catch(() => setReservations([]));
        }
    }, []);

    const todayStr = new Date().toISOString().split("T")[0];
    const todayReservations = reservations.filter((r) => r.reservationDate === todayStr && r.status !== "CANCELLED");
    const upcomingReservations = reservations.filter((r) => r.reservationDate > todayStr && r.status !== "CANCELLED");
    const completedCount = reservations.filter((r) => r.status === "COMPLETED").length;
    const confirmedCount = reservations.filter((r) => r.status === "CONFIRMED").length;

    const filteredReservations = filter === "ALL"
        ? reservations.filter((r) => r.status !== "CANCELLED")
        : reservations.filter((r) => r.status === filter);

    const logout = () => {
        tokenManager.clear();
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            {/* Header */}
            <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
                <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[64px]">
                    <Link href="/" className="flex items-center gap-2.5 no-underline">
                        <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
                            <Heart size={16} />
                        </div>
                        <div>
                            <div className="font-serif text-lg font-bold text-primary-dark leading-tight">MediBook</div>
                            <div className="text-[9px] text-accent font-semibold tracking-[0.12em]">DOCTOR DASHBOARD</div>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-lg hover:bg-[var(--bg)] transition-all bg-transparent border-none cursor-pointer text-[var(--text-light)]">
                            <Bell size={20} />
                            {todayReservations.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ef4444]" />
                            )}
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-[13px] font-bold text-primary">
                                {user?.name?.charAt(0) || "?"}
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-[13px] font-semibold text-primary-dark">{user?.name} 전문의</div>
                                <div className="text-[11px] text-[var(--text-muted)]">{user?.email}</div>
                            </div>
                        </div>

                        <button onClick={logout} className="text-[12px] text-[var(--text-muted)] hover:text-primary font-medium bg-transparent border-none cursor-pointer transition-colors">
                            로그아웃
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-[1200px] mx-auto px-6 py-8">
                {/* Greeting */}
                <div className="mb-8">
                    <div className="text-[13px] text-accent font-semibold mb-1">{currentTime}</div>
                    <h1 className="text-[28px] font-bold text-primary-dark mb-1">
                        {greeting}, <span className="text-accent">{user?.name}</span> 전문의님 🩺
                    </h1>
                    <p className="text-[14px] text-[var(--text-light)]">오늘의 진료 일정을 확인하세요</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: <Calendar size={20} />, label: "오늘 진료", value: `${todayReservations.length}건`, color: "#1b4d6e", bg: "rgba(27,77,110,0.06)" },
                        { icon: <Clock size={20} />, label: "예정 예약", value: `${confirmedCount}건`, color: "#e8a838", bg: "rgba(232,168,56,0.06)" },
                        { icon: <Activity size={20} />, label: "완료 진료", value: `${completedCount}건`, color: "#2d9f6f", bg: "rgba(45,159,111,0.06)" },
                        { icon: <Shield size={20} />, label: "전체 예약", value: `${reservations.length}건`, color: "#6b7280", bg: "rgba(107,114,128,0.06)" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-[var(--border)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg, color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <span className="text-[12px] text-[var(--text-muted)] font-medium">{stat.label}</span>
                            </div>
                            <div className="text-[22px] font-bold" style={{ color: stat.color }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main - Reservation List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                            <div className="flex items-center justify-between p-6 pb-4">
                                <div>
                                    <h2 className="text-[16px] font-bold text-primary-dark">예약 목록</h2>
                                    <p className="text-[12px] text-[var(--text-muted)] mt-0.5">환자 예약 현황</p>
                                </div>
                                <div className="flex gap-2">
                                    {[
                                        { key: "ALL", label: "전체" },
                                        { key: "CONFIRMED", label: "확정" },
                                        { key: "COMPLETED", label: "완료" },
                                    ].map((f) => (
                                        <button
                                            key={f.key}
                                            onClick={() => setFilter(f.key)}
                                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all border-none ${filter === f.key ? "bg-primary text-white" : "bg-[var(--bg)] text-[var(--text-muted)] hover:text-primary"}`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                {filteredReservations.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {filteredReservations.map((res) => {
                                            const status = statusMap[res.status] || statusMap.WAITING;
                                            return (
                                                <div key={res.id} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-primary/20 transition-all group">
                                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-light flex flex-col items-center justify-center text-white flex-shrink-0">
                                                        <div className="text-[10px] font-medium opacity-80">
                                                            {new Date(res.reservationDate).toLocaleDateString("ko-KR", { month: "short" })}
                                                        </div>
                                                        <div className="text-[18px] font-bold leading-tight">
                                                            {new Date(res.reservationDate).getDate()}
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[14px] font-bold text-primary-dark">{res.patientName} 환자</span>
                                                            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ color: status.color, background: status.bg }}>
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                        <div className="text-[12px] text-[var(--text-light)]">
                                                            {res.reservationDate} · {res.reservationTime}
                                                        </div>
                                                        {res.symptom && (
                                                            <div className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
                                                                증상: {res.symptom}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="text-[11px] text-[var(--text-muted)]">
                                                        {res.reservationCode}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="text-4xl mb-3">📋</div>
                                        <p className="text-[14px] text-[var(--text-muted)]">예약이 없습니다</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="flex flex-col gap-6">
                        {/* Today Schedule */}
                        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                            <h3 className="text-[15px] font-bold text-primary-dark mb-4">오늘의 일정</h3>
                            {todayReservations.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {todayReservations.map((res) => (
                                        <div key={res.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg)]">
                                            <div className="text-[14px] font-bold text-primary">{res.reservationTime}</div>
                                            <div className="flex-1">
                                                <div className="text-[12px] font-semibold text-primary-dark">{res.patientName}</div>
                                                {res.symptom && (
                                                    <div className="text-[11px] text-[var(--text-muted)] truncate">{res.symptom}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[12px] text-[var(--text-muted)]">오늘 예정된 진료가 없습니다</p>
                            )}
                        </div>

                        {/* Upcoming */}
                        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                            <h3 className="text-[15px] font-bold text-primary-dark mb-4">다가오는 예약</h3>
                            {upcomingReservations.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {upcomingReservations.slice(0, 5).map((res) => (
                                        <div key={res.id} className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                            <div>
                                                <div className="text-[12px] text-[var(--text)] leading-[1.5]">
                                                    {res.patientName} · {res.reservationDate} {res.reservationTime}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[12px] text-[var(--text-muted)]">다가오는 예약이 없습니다</p>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-primary-dark to-primary rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield size={16} />
                                <span className="text-[12px] font-semibold text-accent tracking-wide">의사 메뉴</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link href="/" className="flex items-center justify-between text-white/70 text-[13px] no-underline hover:text-white transition-colors py-2">
                                    홈으로 <ChevronRight size={14} />
                                </Link>
                                <Link href="/doctors" className="flex items-center justify-between text-white/70 text-[13px] no-underline hover:text-white transition-colors py-2">
                                    의료진 페이지 <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
