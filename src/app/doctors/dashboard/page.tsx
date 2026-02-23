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

interface Reservation {
    id: number;
    reservationCode: string;
    patientName: string;
    patientId: number;
    doctorName: string;
    departmentName: string;
    reservationDate: string;
    reservationTime: string;
    status: string;
    symptom: string;
}

interface Prescription {
    id: number;
    patientName: string;
    doctorName: string;
    departmentName: string;
    reservationId: number | null;
    diagnosis: string;
    medicineName: string;
    dosage: string;
    instruction: string;
    startDate: string;
    endDate: string;
    memo: string;
    createdAt: string;
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    CONFIRMED: { label: "?�정", color: "#2d9f6f", bg: "rgba(45,159,111,0.08)" },
    WAITING: { label: "?�기중", color: "#e8a838", bg: "rgba(232,168,56,0.08)" },
    IN_PROGRESS: { label: "진료�?, color: "#2a6f97", bg: "rgba(42,111,151,0.08)" },
    COMPLETED: { label: "?�료", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
    CANCELLED: { label: "취소", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
};

async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = tokenManager.getAccessToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const text = await res.text();
    if (!res.ok) throw new Error(text ? JSON.parse(text).message : "?�청 ?�패");
    return text ? JSON.parse(text) : null;
}

export default function DoctorDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [currentTime, setCurrentTime] = useState("");
    const [greeting, setGreeting] = useState("");
    const [filter, setFilter] = useState<string>("ALL");
    const [activeTab, setActiveTab] = useState<"reservations" | "prescriptions">("reservations");

    // 처방 모달
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [prescriptionForm, setPrescriptionForm] = useState({
        diagnosis: "",
        medicineName: "",
        dosage: "",
        instruction: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        memo: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const u = localStorage.getItem("user");
        if (u) setUser(JSON.parse(u));

        const updateTime = () => {
            const now = new Date();
            const h = now.getHours();
            setGreeting(h < 12 ? "좋�? ?�침?�에?? : h < 18 ? "좋�? ?�후?�요" : "좋�? ?�?�이?�요");
            setCurrentTime(
                now.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        apiFetch("/api/reservations/doctor")
            .then((data) => setReservations(data || []))
            .catch(() => setReservations([]));

        apiFetch("/api/prescriptions/doctor")
            .then((data) => setPrescriptions(data || []))
            .catch(() => setPrescriptions([]));
    };

    const todayStr = new Date().toISOString().split("T")[0];
    const todayReservations = reservations.filter((r) => r.reservationDate === todayStr && r.status !== "CANCELLED");
    const upcomingReservations = reservations.filter((r) => r.reservationDate > todayStr && r.status !== "CANCELLED");
    const completedCount = reservations.filter((r) => r.status === "COMPLETED").length;
    const confirmedCount = reservations.filter((r) => r.status === "CONFIRMED").length;

    const filteredReservations = filter === "ALL"
        ? reservations.filter((r) => r.status !== "CANCELLED")
        : reservations.filter((r) => r.status === filter);

    const openPrescriptionModal = (res: Reservation) => {
        setSelectedReservation(res);
        setPrescriptionForm({
            diagnosis: "",
            medicineName: "",
            dosage: "",
            instruction: "",
            startDate: new Date().toISOString().split("T")[0],
            endDate: "",
            memo: "",
        });
        setShowPrescriptionModal(true);
    };

    const handlePrescriptionSubmit = async () => {
        if (!selectedReservation) return;
        if (!prescriptionForm.diagnosis || !prescriptionForm.medicineName || !prescriptionForm.dosage || !prescriptionForm.instruction || !prescriptionForm.endDate) {
            alert("?�수 ??��??모두 ?�력?�주?�요.");
            return;
        }

        setIsSubmitting(true);
        try {
            await apiFetch("/api/prescriptions", {
                method: "POST",
                body: JSON.stringify({
                    patientId: selectedReservation.patientId,
                    reservationId: selectedReservation.id,
                    ...prescriptionForm,
                }),
            });
            setShowPrescriptionModal(false);
            loadData();
            alert("?�약기록???�록?�었?�니??");
        } catch (error: any) {
            alert(error.message || "?�록???�패?�습?�다.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                <div className="text-[13px] font-semibold text-primary-dark">{user?.name} ?�문??/div>
                                <div className="text-[11px] text-[var(--text-muted)]">{user?.email}</div>
                            </div>
                        </div>

                        <button onClick={logout} className="text-[12px] text-[var(--text-muted)] hover:text-primary font-medium bg-transparent border-none cursor-pointer transition-colors">
                            로그?�웃
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-[1200px] mx-auto px-6 py-8">
                {/* Greeting */}
                <div className="mb-8">
                    <div className="text-[13px] text-accent font-semibold mb-1">{currentTime}</div>
                    <h1 className="text-[28px] font-bold text-primary-dark mb-1">
                        {greeting}, <span className="text-accent">{user?.name}</span> ?�문?�님 ?��
                    </h1>
                    <p className="text-[14px] text-[var(--text-light)]">?�늘??진료 ?�정???�인?�세??/p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: <Calendar size={20} />, label: "?�늘 진료", value: `${todayReservations.length}�?, color: "#1b4d6e", bg: "rgba(27,77,110,0.06)" },
                        { icon: <Clock size={20} />, label: "?�정 ?�약", value: `${confirmedCount}�?, color: "#e8a838", bg: "rgba(232,168,56,0.06)" },
                        { icon: <Activity size={20} />, label: "?�료 진료", value: `${completedCount}�?, color: "#2d9f6f", bg: "rgba(45,159,111,0.06)" },
                        { icon: <Shield size={20} />, label: "처방 기록", value: `${prescriptions.length}�?, color: "#6b7280", bg: "rgba(107,114,128,0.06)" },
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

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("reservations")}
                        className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all border-none ${activeTab === "reservations" ? "bg-primary text-white" : "bg-white text-[var(--text-muted)] hover:text-primary border border-[var(--border)]"}`}
                    >
                        ?�� ?�약 관�?                    </button>
                    <button
                        onClick={() => setActiveTab("prescriptions")}
                        className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all border-none ${activeTab === "prescriptions" ? "bg-primary text-white" : "bg-white text-[var(--text-muted)] hover:text-primary border border-[var(--border)]"}`}
                    >
                        ?�� ?�약 기록
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Reservations Tab */}
                        {activeTab === "reservations" && (
                            <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                                <div className="flex items-center justify-between p-6 pb-4">
                                    <div>
                                        <h2 className="text-[16px] font-bold text-primary-dark">?�약 목록</h2>
                                        <p className="text-[12px] text-[var(--text-muted)] mt-0.5">?�자 ?�약 ?�황</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {[
                                            { key: "ALL", label: "?�체" },
                                            { key: "CONFIRMED", label: "?�정" },
                                            { key: "COMPLETED", label: "?�료" },
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
                                                                <span className="text-[14px] font-bold text-primary-dark">{res.patientName} ?�자</span>
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

                                                        <div className="flex gap-2">
                                                            {res.status === "CONFIRMED" && (
                                                                <button
                                                                    onClick={async () => {
                                                                        if (!confirm(`${res.patientName} ?�자??진료�??�료 처리?�시겠습?�까?`)) return;
                                                                        try {
                                                                            await apiFetch(`/api/reservations/${res.id}/complete`, { method: "PATCH" });
                                                                            loadData();
                                                                        } catch (e: any) {
                                                                            alert(e.message || "처리 ?�패");
                                                                        }
                                                                    }}
                                                                    className="text-[11px] text-[#2d9f6f] hover:text-white hover:bg-[#2d9f6f] bg-[rgba(45,159,111,0.06)] border border-[#2d9f6f]/20 hover:border-[#2d9f6f] rounded-lg px-3 py-1.5 cursor-pointer transition-all font-semibold"
                                                                >
                                                                    ???�료
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => openPrescriptionModal(res)}
                                                                className="text-[11px] text-primary hover:text-white hover:bg-primary bg-primary/[0.06] border border-primary/20 hover:border-primary rounded-lg px-3 py-1.5 cursor-pointer transition-all font-semibold"
                                                            >
                                                                ?�� 처방
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <div className="text-4xl mb-3">?��</div>
                                            <p className="text-[14px] text-[var(--text-muted)]">?�약???�습?�다</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Prescriptions Tab */}
                        {activeTab === "prescriptions" && (
                            <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                                <div className="p-6 pb-4">
                                    <h2 className="text-[16px] font-bold text-primary-dark">?�약 기록</h2>
                                    <p className="text-[12px] text-[var(--text-muted)] mt-0.5">처방???�약 ?�역</p>
                                </div>

                                <div className="px-6 pb-6">
                                    {prescriptions.length > 0 ? (
                                        <div className="flex flex-col gap-4">
                                            {prescriptions.map((p) => (
                                                <div key={p.id} className="p-5 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[14px] font-bold text-primary-dark">{p.patientName} ?�자</span>
                                                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/[0.08] text-accent font-semibold">
                                                                {p.diagnosis}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] text-[var(--text-muted)]">
                                                            {p.createdAt?.split("T")[0]}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                                        <div>
                                                            <div className="text-[10px] text-[var(--text-muted)] mb-0.5">?�품�?/div>
                                                            <div className="text-[13px] font-semibold text-primary-dark">?�� {p.medicineName}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-[var(--text-muted)] mb-0.5">?�량</div>
                                                            <div className="text-[13px] font-semibold text-primary-dark">{p.dosage}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-[var(--text-muted)] mb-0.5">복용�?/div>
                                                            <div className="text-[13px] text-[var(--text)]">{p.instruction}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-[var(--text-muted)] mb-0.5">처방 기간</div>
                                                            <div className="text-[13px] text-[var(--text)]">{p.startDate} ~ {p.endDate}</div>
                                                        </div>
                                                    </div>

                                                    {p.memo && (
                                                        <div className="pt-3 border-t border-[var(--border)]">
                                                            <div className="text-[10px] text-[var(--text-muted)] mb-0.5">?�사 메모</div>
                                                            <div className="text-[12px] text-[var(--text-light)] leading-[1.6]">{p.memo}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <div className="text-4xl mb-3">?��</div>
                                            <p className="text-[14px] text-[var(--text-muted)] mb-2">?�약 기록???�습?�다</p>
                                            <p className="text-[12px] text-[var(--text-muted)]">?�약 목록?�서 ?�자�??�택?�여 처방?�세??/p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="flex flex-col gap-6">
                        {/* Today Schedule */}
                        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                            <h3 className="text-[15px] font-bold text-primary-dark mb-4">?�늘???�정</h3>
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
                                <p className="text-[12px] text-[var(--text-muted)]">?�늘 ?�정??진료가 ?�습?�다</p>
                            )}
                        </div>

                        {/* Upcoming */}
                        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                            <h3 className="text-[15px] font-bold text-primary-dark mb-4">?��??�는 ?�약</h3>
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
                                <p className="text-[12px] text-[var(--text-muted)]">?��??�는 ?�약???�습?�다</p>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-primary-dark to-primary rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield size={16} />
                                <span className="text-[12px] font-semibold text-accent tracking-wide">?�사 메뉴</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link href="/" className="flex items-center justify-between text-white/70 text-[13px] no-underline hover:text-white transition-colors py-2">
                                    ?�으�?<ChevronRight size={14} />
                                </Link>
                                <Link href="/doctors" className="flex items-center justify-between text-white/70 text-[13px] no-underline hover:text-white transition-colors py-2">
                                    ?�료�??�이지 <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Prescription Modal */}
            {
                showPrescriptionModal && selectedReservation && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={() => setShowPrescriptionModal(false)}>
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <div className="relative bg-white rounded-2xl max-w-[560px] w-full max-h-[90vh] overflow-y-auto animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="p-6 border-b border-[var(--border)]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-[18px] font-bold text-primary-dark">?�� ?�약 기록 ?�성</h2>
                                        <p className="text-[12px] text-[var(--text-muted)] mt-1">
                                            {selectedReservation.patientName} ?�자 · {selectedReservation.reservationDate}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowPrescriptionModal(false)}
                                        className="w-8 h-8 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary cursor-pointer transition-all"
                                    >
                                        ??                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 flex flex-col gap-4">
                                {/* 진단�?*/}
                                <div>
                                    <label className="block text-[12px] font-semibold text-primary-dark mb-1.5">진단�?*</label>
                                    <input
                                        type="text"
                                        placeholder="?? 급성 ?�염, 감기"
                                        value={prescriptionForm.diagnosis}
                                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-[var(--border)] text-[13px] outline-none focus:border-primary transition-all bg-[var(--bg)]"
                                    />
                                </div>

                                {/* ?�품�?+ ?�량 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[12px] font-semibold text-primary-dark mb-1.5">?�품�?*</label>
                                        <input
                                            type="text"
                                            placeholder="?? ?�목?�실�?
                                            value={prescriptionForm.medicineName}
                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicineName: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-[var(--border)] text-[13px] outline-none focus:border-primary transition-all bg-[var(--bg)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-primary-dark mb-1.5">?�량 *</label>
                                        <input
                                            type="text"
                                            placeholder="?? 500mg"
                                            value={prescriptionForm.dosage}
                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-[var(--border)] text-[13px] outline-none focus:border-primary transition-all bg-[var(--bg)]"
                                        />
                                    </div>
                                </div>

                                {/* 복용�?*/}
                                <div>
                                    <label className="block text-[12px] font-semibold text-primary-dark mb-1.5">복용�?*</label>
                                    <input
                                        type="text"
                                        placeholder="?? 1??3?? ?�후 30�?
                                        value={prescriptionForm.instruction}
                                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instruction: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-[var(--border)] text-[13px] outline-none focus:border-primary transition-all bg-[var(--bg)]"
                                    />
                                </div>

                                {/* 기간 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[12px] font-semibold text-primary-dark mb-1.5">?�작??*</label>
                                        <input
                                            type="date"
                                            value={prescriptionForm.startDate}
                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, startDate: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-[var(--border)] text-[13px] outline-none focus:border-primary transition-all bg-[var(--bg)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-primary-dark mb-1.5">종료??*</label>
                                        <input
                                            type="date"
                                            value={prescriptionForm.endDate}
                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, endDate: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-[var(--border)] text-[13px] outline-none focus:border-primary transition-all bg-[var(--bg)]"
                                        />
                                    </div>
                                </div>

                                {/* 메모 */}
                                <div>
                                    <label className="block text-[12px] font-semibold text-primary-dark mb-1.5">?�사 메모 (?�택)</label>
                                    <textarea
                                        placeholder="추�? 참고?�항???�력?�세??.."
                                        value={prescriptionForm.memo}
                                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, memo: e.target.value })}
                                        className="w-full h-20 px-4 py-2.5 rounded-xl border-[1.5px] border-[var(--border)] text-[13px] outline-none focus:border-primary transition-all resize-none bg-[var(--bg)] leading-[1.6]"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 pt-0 flex gap-3">
                                <button
                                    onClick={() => setShowPrescriptionModal(false)}
                                    className="btn-outline flex-1 !py-3 !text-[13px]"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handlePrescriptionSubmit}
                                    disabled={isSubmitting}
                                    className="btn-accent flex-1 !py-3 !text-[13px] !font-bold disabled:opacity-60"
                                >
                                    {isSubmitting ? "?�록 �?.." : "?�� 처방 ?�록"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
