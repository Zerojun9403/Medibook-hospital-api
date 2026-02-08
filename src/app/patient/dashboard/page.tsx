"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Calendar, Clock, Bell, CreditCard, Activity, ChevronRight, Shield } from "@/components/icons/Icons";
import { reservationAPI, userAPI } from "@/lib/api";

interface User {
  name: string;
  role: string;
  email?: string;
}

interface Reservation {
  id: number;
  reservationCode: string;
  doctorName: string;
  departmentName: string;
  reservationDate: string;
  reservationTime: string;
  status: string;
  symptom: string;
}

interface Stats {
  totalReservations: number;
  completedReservations: number;
  upcomingReservations: number;
  cancelledReservations: number;
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  CONFIRMED: { label: "확정", color: "#2d9f6f", bg: "rgba(45,159,111,0.08)" },
  WAITING: { label: "대기중", color: "#e8a838", bg: "rgba(232,168,56,0.08)" },
  IN_PROGRESS: { label: "진료중", color: "#2a6f97", bg: "rgba(42,111,151,0.08)" },
  COMPLETED: { label: "완료", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
  CANCELLED: { label: "취소", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
};

export default function PatientDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");

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

  // API에서 예약 목록 & 통계 가져오기
  useEffect(() => {
    reservationAPI.getMyReservations()
      .then((data) => setReservations(data))
      .catch(() => setReservations([]));

    userAPI.getStats()
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  const upcomingReservations = reservations.filter(
    (r) => r.status === "CONFIRMED" || r.status === "WAITING"
  );

  const recentActivity = reservations.slice(0, 3).map((r) => {
    const status = statusMap[r.status] || statusMap.WAITING;
    return {
      id: r.id,
      text: `${r.doctorName} 전문의 ${r.departmentName} - ${status.label}`,
      date: r.reservationDate,
    };
  });

  const handleCancel = async (id: number) => {
    if (!confirm("예약을 취소하시겠습니까?")) return;
    try {
      await reservationAPI.cancel(id);
      // 목록 새로고침
      const data = await reservationAPI.getMyReservations();
      setReservations(data);
      const statsData = await userAPI.getStats();
      setStats(statsData);
    } catch (error: any) {
      alert(error.message || "취소에 실패했습니다.");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[64px]">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
              <Heart size={16} />
            </div>
            <div>
              <div className="font-serif text-lg font-bold text-primary-dark leading-tight">MediBook</div>
              <div className="text-[9px] text-accent font-semibold tracking-[0.12em]">PREMIUM HEALTHCARE</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-[var(--bg)] transition-all bg-transparent border-none cursor-pointer text-[var(--text-light)]">
              <Bell size={20} />
              {upcomingReservations.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ef4444]" />
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-[13px] font-bold text-primary">
                {user?.name?.charAt(0) || "?"}
              </div>
              <div className="hidden sm:block">
                <div className="text-[13px] font-semibold text-primary-dark">{user?.name}님</div>
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
        {/* Greeting Section */}
        <div className="mb-8">
          <div className="text-[13px] text-accent font-semibold mb-1">{currentTime}</div>
          <h1 className="text-[28px] font-bold text-primary-dark mb-1">
            {greeting}, <span className="text-accent">{user?.name}</span>님 👋
          </h1>
          <p className="text-[14px] text-[var(--text-light)]">오늘의 건강 상태를 확인하고 예약을 관리하세요</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Calendar size={20} />, label: "전체 예약", value: `${stats?.totalReservations ?? 0}건`, color: "#1b4d6e", bg: "rgba(27,77,110,0.06)" },
            { icon: <Clock size={20} />, label: "예정 예약", value: `${stats?.upcomingReservations ?? 0}건`, color: "#e8a838", bg: "rgba(232,168,56,0.06)" },
            { icon: <Activity size={20} />, label: "완료", value: `${stats?.completedReservations ?? 0}건`, color: "#2d9f6f", bg: "rgba(45,159,111,0.06)" },
            { icon: <CreditCard size={20} />, label: "취소", value: `${stats?.cancelledReservations ?? 0}건`, color: "#6b7280", bg: "rgba(107,114,128,0.06)" },
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
          {/* Upcoming Reservations - 2 cols */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
              <div className="flex items-center justify-between p-6 pb-4">
                <div>
                  <h2 className="text-[16px] font-bold text-primary-dark">예정된 예약</h2>
                  <p className="text-[12px] text-[var(--text-muted)] mt-0.5">다가오는 진료 일정</p>
                </div>
                <Link href="/booking" className="btn-accent !py-2 !px-4 !text-[12px] no-underline">
                  새 예약 +
                </Link>
              </div>

              <div className="px-6 pb-6">
                {upcomingReservations.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {upcomingReservations.map((res) => {
                      const status = statusMap[res.status] || statusMap.WAITING;
                      return (
                        <div key={res.id} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-primary/20 transition-all group">
                          {/* Date Block */}
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-light flex flex-col items-center justify-center text-white flex-shrink-0">
                            <div className="text-[10px] font-medium opacity-80">
                              {new Date(res.reservationDate).toLocaleDateString("ko-KR", { month: "short" })}
                            </div>
                            <div className="text-[18px] font-bold leading-tight">
                              {new Date(res.reservationDate).getDate()}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[14px] font-bold text-primary-dark">{res.doctorName} 전문의</span>
                              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ color: status.color, background: status.bg }}>
                                {status.label}
                              </span>
                            </div>
                            <div className="text-[12px] text-[var(--text-light)]">
                              {res.departmentName} · {res.reservationDate} · {res.reservationTime}
                            </div>
                            {res.reservationCode && (
                              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                                예약코드: {res.reservationCode}
                              </div>
                            )}
                          </div>

                          {/* Cancel Button */}
                          <button
                            onClick={() => handleCancel(res.id)}
                            className="text-[11px] text-[var(--text-muted)] hover:text-[#ef4444] bg-transparent border border-[var(--border)] hover:border-[#ef4444]/30 rounded-lg px-3 py-1.5 cursor-pointer transition-all"
                          >
                            취소
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">📅</div>
                    <p className="text-[14px] text-[var(--text-muted)] mb-4">예정된 예약이 없습니다</p>
                    <Link href="/booking" className="btn-primary !py-2.5 !px-6 !text-[13px] no-underline">
                      예약하기
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
              <h3 className="text-[15px] font-bold text-primary-dark mb-4">빠른 메뉴</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "📅", label: "예약하기", href: "/booking" },
                  { icon: "🏥", label: "진료과", href: "/departments" },
                  { icon: "👨‍⚕️", label: "의료진", href: "/doctors" },
                  { icon: "📋", label: "진료기록", href: "/mypage" },
                ].map((item, i) => (
                  <Link key={i} href={item.href}
                    className="no-underline flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-accent/40 hover:shadow-sm transition-all cursor-pointer">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[11px] font-semibold text-[var(--text-light)]">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
              <h3 className="text-[15px] font-bold text-primary-dark mb-4">최근 활동</h3>
              <div className="flex flex-col gap-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="text-[12px] text-[var(--text)] leading-[1.5]">{item.text}</div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{item.date}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-[var(--text-muted)]">최근 활동이 없습니다</p>
                )}
              </div>
            </div>

            {/* Health Tip */}
            <div className="bg-gradient-to-br from-primary-dark to-primary rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} />
                <span className="text-[12px] font-semibold text-accent tracking-wide">오늘의 건강 팁</span>
              </div>
              <p className="text-[13px] text-white/70 leading-[1.7]">
                규칙적인 건강 검진은 질병의 조기 발견에 필수적입니다. 6개월마다 정기 검진을 받아보세요.
              </p>
              <Link href="/booking" className="inline-flex items-center gap-1 mt-3 text-accent text-[12px] font-semibold no-underline hover:text-accent-light transition-colors">
                검진 예약하기 <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
