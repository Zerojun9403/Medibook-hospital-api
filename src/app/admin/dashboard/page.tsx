"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Calendar, Clock, Bell, Activity, ChevronRight, Shield } from "@/components/icons/Icons";
import { tokenManager } from "@/lib/api";

const API_BASE = "http://ec2-3-27-218-253.ap-southeast-2.compute.amazonaws.com:8080";

interface User {
    name: string;
    role: string;
    email?: string;
}

interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    birthdate: string;
    role: string;
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
    createdAt: string;
}

interface AdminStats {
    totalUsers: number;
    totalReservations: number;
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    CONFIRMED: { label: "?ïÏ†ï", color: "#2d9f6f", bg: "rgba(45,159,111,0.08)" },
    WAITING: { label: "?ÄÍ∏∞Ï§ë", color: "#e8a838", bg: "rgba(232,168,56,0.08)" },
    IN_PROGRESS: { label: "ÏßÑÎ£åÏ§?, color: "#2a6f97", bg: "rgba(42,111,151,0.08)" },
    COMPLETED: { label: "?ÑÎ£å", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
    CANCELLED: { label: "Ï∑®ÏÜå", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
};

const roleMap: Record<string, { label: string; color: string; bg: string }> = {
    ADMIN: { label: "Í¥ÄÎ¶¨Ïûê", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
    DOCTOR: { label: "?òÏÇ¨", color: "#2a6f97", bg: "rgba(42,111,151,0.08)" },
    PATIENT: { label: "?òÏûê", color: "#2d9f6f", bg: "rgba(45,159,111,0.08)" },
};

async function apiFetch(endpoint: string) {
    const token = tokenManager.getAccessToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${endpoint}`, { headers });
    const text = await res.text();
    if (!res.ok) throw new Error("?îÏ≤≠ ?§Ìå®");
    return text ? JSON.parse(text) : null;
}

export default function AdminDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [currentTime, setCurrentTime] = useState("");
    const [activeTab, setActiveTab] = useState<"overview" | "users" | "reservations">("overview");
    const [userSearch, setUserSearch] = useState("");
    const [resFilter, setResFilter] = useState("ALL");

    useEffect(() => {
        const u = localStorage.getItem("user");
        if (u) setUser(JSON.parse(u));

        setCurrentTime(
            new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })
        );

        loadData();
    }, []);

    const loadData = () => {
        apiFetch("/api/admin/stats").then(setStats).catch(() => { });
        apiFetch("/api/admin/users").then(setUsers).catch(() => setUsers([]));
        apiFetch("/api/admin/reservations").then(setReservations).catch(() => setReservations([]));
    };

    const filteredUsers = users.filter(
        (u) => u.name.includes(userSearch) || u.email.includes(userSearch)
    );

    const filteredReservations = resFilter === "ALL"
        ? reservations
        : reservations.filter((r) => r.status === resFilter);

    const todayStr = new Date().toISOString().split("T")[0];
    const todayReservations = reservations.filter((r) => r.reservationDate === todayStr);
    const patientCount = users.filter((u) => u.role === "PATIENT").length;
    const doctorCount = users.filter((u) => u.role === "DOCTOR").length;
    const confirmedCount = reservations.filter((r) => r.status === "CONFIRMED").length;
    const completedCount = reservations.filter((r) => r.status === "COMPLETED").length;
    const cancelledCount = reservations.filter((r) => r.status === "CANCELLED").length;

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
                            <div className="text-[9px] text-[#ef4444] font-semibold tracking-[0.12em]">ADMIN DASHBOARD</div>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ef4444]/10 to-accent/10 flex items-center justify-center text-[13px] font-bold text-[#ef4444]">
                                {user?.name?.charAt(0) || "A"}
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-[13px] font-semibold text-primary-dark">{user?.name} Í¥ÄÎ¶¨Ïûê</div>
                                <div className="text-[11px] text-[var(--text-muted)]">{user?.email}</div>
                            </div>
                        </div>
                        <button onClick={logout} className="text-[12px] text-[var(--text-muted)] hover:text-primary font-medium bg-transparent border-none cursor-pointer transition-colors">
                            Î°úÍ∑∏?ÑÏõÉ
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-[1200px] mx-auto px-6 py-8">
                {/* Title */}
                <div className="mb-8">
                    <div className="text-[13px] text-[#ef4444] font-semibold mb-1">{currentTime}</div>
                    <h1 className="text-[28px] font-bold text-primary-dark mb-1">Í¥ÄÎ¶¨Ïûê ?Ä?úÎ≥¥???õ°Ô∏?/h1>
                    <p className="text-[14px] text-[var(--text-light)]">?ÑÏ≤¥ ?úÏä§???ÑÌô©???ïÏù∏?òÍ≥† Í¥ÄÎ¶¨Ìïò?∏Ïöî</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: "?ë•", label: "?ÑÏ≤¥ ?åÏõê", value: `${stats?.totalUsers ?? 0}Î™?, color: "#1b4d6e", bg: "rgba(27,77,110,0.06)" },
                        { icon: "?ìÖ", label: "?ÑÏ≤¥ ?àÏïΩ", value: `${stats?.totalReservations ?? 0}Í±?, color: "#e8a838", bg: "rgba(232,168,56,0.06)" },
                        { icon: "?ë®?ç‚öïÔ∏?, label: "?òÏÇ¨", value: `${doctorCount}Î™?, color: "#2a6f97", bg: "rgba(42,111,151,0.06)" },
                        { icon: "?è•", label: "?òÏûê", value: `${patientCount}Î™?, color: "#2d9f6f", bg: "rgba(45,159,111,0.06)" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-[var(--border)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: stat.bg }}>
                                    {stat.icon}
                                </div>
                                <span className="text-[12px] text-[var(--text-muted)] font-medium">{stat.label}</span>
                            </div>
                            <div className="text-[22px] font-bold" style={{ color: stat.color }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { key: "overview" as const, label: "?ìä ?ÑÏ≤¥ ?ÑÌô©" },
                        { key: "users" as const, label: "?ë• ?åÏõê Í¥ÄÎ¶? },
                        { key: "reservations" as const, label: "?ìÖ ?àÏïΩ Í¥ÄÎ¶? },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all border-none ${activeTab === tab.key ? "bg-primary text-white" : "bg-white text-[var(--text-muted)] hover:text-primary"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Reservation Stats */}
                        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                            <h3 className="text-[15px] font-bold text-primary-dark mb-5">?àÏïΩ ?ÑÌô©</h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    { label: "?ïÏ†ï", count: confirmedCount, color: "#2d9f6f", total: reservations.length },
                                    { label: "?ÑÎ£å", count: completedCount, color: "#2a6f97", total: reservations.length },
                                    { label: "Ï∑®ÏÜå", count: cancelledCount, color: "#ef4444", total: reservations.length },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[13px] font-medium text-[var(--text)]">{item.label}</span>
                                            <span className="text-[13px] font-bold" style={{ color: item.color }}>{item.count}Í±?/span>
                                        </div>
                                        <div className="h-2 rounded-full bg-[var(--bg)] overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: item.total > 0 ? `${(item.count / item.total) * 100}%` : "0%",
                                                    background: item.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Today's Schedule */}
                        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                            <h3 className="text-[15px] font-bold text-primary-dark mb-5">?§Îäò???àÏïΩ</h3>
                            {todayReservations.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {todayReservations.map((res) => {
                                        const status = statusMap[res.status] || statusMap.WAITING;
                                        return (
                                            <div key={res.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg)]">
                                                <div className="text-[13px] font-bold text-primary">{res.reservationTime}</div>
                                                <div className="flex-1">
                                                    <div className="text-[12px] font-semibold text-primary-dark">{res.patientName} ??{res.doctorName}</div>
                                                    <div className="text-[11px] text-[var(--text-muted)]">{res.departmentName}</div>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ color: status.color, background: status.bg }}>
                                                    {status.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-[13px] text-[var(--text-muted)] text-center py-6">?§Îäò ?àÏïΩ???ÜÏäµ?àÎã§</p>
                            )}
                        </div>

                        {/* Recent Users */}
                        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                            <h3 className="text-[15px] font-bold text-primary-dark mb-5">ÏµúÍ∑º Í∞Ä???åÏõê</h3>
                            <div className="flex flex-col gap-3">
                                {users.slice(0, 5).map((u) => {
                                    const role = roleMap[u.role] || roleMap.PATIENT;
                                    return (
                                        <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg)]">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-[12px] font-bold text-primary">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[12px] font-semibold text-primary-dark">{u.name}</div>
                                                <div className="text-[11px] text-[var(--text-muted)]">{u.email}</div>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ color: role.color, background: role.bg }}>
                                                {role.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Reservations */}
                        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                            <h3 className="text-[15px] font-bold text-primary-dark mb-5">ÏµúÍ∑º ?àÏïΩ</h3>
                            <div className="flex flex-col gap-3">
                                {reservations.slice(0, 5).map((res) => {
                                    const status = statusMap[res.status] || statusMap.WAITING;
                                    return (
                                        <div key={res.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg)]">
                                            <div className="flex-1">
                                                <div className="text-[12px] font-semibold text-primary-dark">{res.patientName} ??{res.doctorName}</div>
                                                <div className="text-[11px] text-[var(--text-muted)]">{res.reservationDate} {res.reservationTime}</div>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ color: status.color, background: status.bg }}>
                                                {status.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                        <div className="flex items-center justify-between p-6 pb-4">
                            <div>
                                <h2 className="text-[16px] font-bold text-primary-dark">?åÏõê Î™©Î°ù</h2>
                                <p className="text-[12px] text-[var(--text-muted)] mt-0.5">Ï¥?{users.length}Î™?/p>
                            </div>
                            <input
                                type="text"
                                placeholder="?¥Î¶Ñ ?êÎäî ?¥Î©î??Í≤Ä??.."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-[var(--border)] text-[12px] outline-none focus:border-primary transition-all w-[200px] bg-[var(--bg)]"
                            />
                        </div>

                        <div className="px-6 pb-6">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-3 px-4 py-2 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide border-b border-[var(--border)] mb-2">
                                <div className="col-span-1">ID</div>
                                <div className="col-span-2">?¥Î¶Ñ</div>
                                <div className="col-span-4">?¥Î©î??/div>
                                <div className="col-span-2">?∞ÎùΩÏ≤?/div>
                                <div className="col-span-2">??ï†</div>
                                <div className="col-span-1">?ÅÌÉú</div>
                            </div>

                            {filteredUsers.map((u) => {
                                const role = roleMap[u.role] || roleMap.PATIENT;
                                return (
                                    <div key={u.id} className="grid grid-cols-12 gap-3 px-4 py-3 text-[12px] items-center hover:bg-[var(--bg)] rounded-lg transition-all">
                                        <div className="col-span-1 text-[var(--text-muted)] font-mono">#{u.id}</div>
                                        <div className="col-span-2 font-semibold text-primary-dark">{u.name}</div>
                                        <div className="col-span-4 text-[var(--text-light)] truncate">{u.email}</div>
                                        <div className="col-span-2 text-[var(--text-light)]">{u.phone || "-"}</div>
                                        <div className="col-span-2">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ color: role.color, background: role.bg }}>
                                                {role.label}
                                            </span>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredUsers.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-[14px] text-[var(--text-muted)]">Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ÜÏäµ?àÎã§</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Reservations Tab */}
                {activeTab === "reservations" && (
                    <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                        <div className="flex items-center justify-between p-6 pb-4">
                            <div>
                                <h2 className="text-[16px] font-bold text-primary-dark">?àÏïΩ Î™©Î°ù</h2>
                                <p className="text-[12px] text-[var(--text-muted)] mt-0.5">Ï¥?{reservations.length}Í±?/p>
                            </div>
                            <div className="flex gap-2">
                                {[
                                    { key: "ALL", label: "?ÑÏ≤¥" },
                                    { key: "CONFIRMED", label: "?ïÏ†ï" },
                                    { key: "COMPLETED", label: "?ÑÎ£å" },
                                    { key: "CANCELLED", label: "Ï∑®ÏÜå" },
                                ].map((f) => (
                                    <button
                                        key={f.key}
                                        onClick={() => setResFilter(f.key)}
                                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all border-none ${resFilter === f.key ? "bg-primary text-white" : "bg-[var(--bg)] text-[var(--text-muted)] hover:text-primary"}`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-3 px-4 py-2 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide border-b border-[var(--border)] mb-2">
                                <div className="col-span-2">?àÏïΩÏΩîÎìú</div>
                                <div className="col-span-2">?òÏûê</div>
                                <div className="col-span-2">?òÏÇ¨</div>
                                <div className="col-span-2">ÏßÑÎ£åÍ≥?/div>
                                <div className="col-span-2">?†Ïßú/?úÍ∞Ñ</div>
                                <div className="col-span-2">?ÅÌÉú</div>
                            </div>

                            {filteredReservations.map((res) => {
                                const status = statusMap[res.status] || statusMap.WAITING;
                                return (
                                    <div key={res.id} className="grid grid-cols-12 gap-3 px-4 py-3 text-[12px] items-center hover:bg-[var(--bg)] rounded-lg transition-all">
                                        <div className="col-span-2 text-[var(--text-muted)] font-mono text-[11px]">{res.reservationCode}</div>
                                        <div className="col-span-2 font-semibold text-primary-dark">{res.patientName}</div>
                                        <div className="col-span-2 text-[var(--text-light)]">{res.doctorName}</div>
                                        <div className="col-span-2 text-[var(--text-light)]">{res.departmentName}</div>
                                        <div className="col-span-2 text-[var(--text-light)]">
                                            <div>{res.reservationDate}</div>
                                            <div className="text-[11px] text-[var(--text-muted)]">{res.reservationTime}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ color: status.color, background: status.bg }}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredReservations.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-[14px] text-[var(--text-muted)]">?àÏïΩ???ÜÏäµ?àÎã§</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
