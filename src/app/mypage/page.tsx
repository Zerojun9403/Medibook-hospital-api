"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Shield } from "@/components/icons/Icons";
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
    doctorName: string;
    departmentName: string;
    reservationDate: string;
    reservationTime: string;
    status: string;
    symptom: string;
    fee: number;
}

interface Payment {
    id: number;
    paymentCode: string;
    doctorName: string;
    departmentName: string;
    reservationDate: string;
    amount: number;
    method: string;
    status: string;
    createdAt: string;
}

interface Prescription {
    id: number;
    patientName: string;
    doctorName: string;
    departmentName: string;
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

const methodMap: Record<string, string> = {
    CARD: "?�� 카드", CASH: "?�� ?�금", TRANSFER: "?�� ?�체",
    KAKAO_PAY: "?�� 카카?�페??, NAVER_PAY: "?�� ?�이버페??,
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
    if (!res.ok) throw new Error("?�청 ?�패");
    return text ? JSON.parse(text) : null;
}

type Tab = "reservations" | "prescriptions" | "payments" | "profile";

export default function MyPage() {
    const [user, setUser] = useState<User | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>("reservations");
    const [filterStatus, setFilterStatus] = useState("?�체");

    useEffect(() => {
        const u = localStorage.getItem("user");
        if (u) setUser(JSON.parse(u));
        loadData();
    }, []);

    const loadData = () => {
        apiFetch("/api/reservations/my").then(setReservations).catch(() => setReservations([]));
        apiFetch("/api/payments/my").then(setPayments).catch(() => setPayments([]));
        apiFetch("/api/prescriptions/patient").then(setPrescriptions).catch(() => setPrescriptions([]));
    };

    const handleCancel = async (id: number) => {
        if (!confirm("?�약??취소?�시겠습?�까?")) return;
        try {
            await apiFetch(`/api/reservations/${id}/cancel`, { method: "PATCH" });
            loadData();
        } catch {
            alert("취소???�패?�습?�다.");
        }
    };

    const filteredReservations = filterStatus === "?�체"
        ? reservations
        : reservations.filter((r) => r.status === filterStatus);

    const upcomingCount = reservations.filter((r) => r.status === "CONFIRMED" || r.status === "WAITING").length;
    const totalPaid = payments.filter((p) => p.status === "COMPLETED").reduce((s, p) => s + p.amount, 0);

    const tabs: { key: Tab; label: string; icon: string; count?: number }[] = [
        { key: "reservations", label: "?�약 ?�역", icon: "?��", count: upcomingCount },
        { key: "prescriptions", label: "처방 기록", icon: "?��", count: prescriptions.length },
        { key: "payments", label: "결제 ?�역", icon: "?��", count: payments.length },
        { key: "profile", label: "???�보", icon: "?��" },
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
                        ???�?�보??                    </Link>
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
                            <h1 className="text-[22px] font-bold text-primary-dark">{user?.name || "?�용??}??/h1>
                            <p className="text-[13px] text-[var(--text-light)]">{user?.email} · {user?.role === "PATIENT" ? "?�반 ?�자" : user?.role}</p>
                        </div>
                        <div className="hidden sm:flex gap-2">
                            <Link href="/payment" className="btn-outline !py-2.5 !px-4 !text-[12px] no-underline">
                                ?�� 결제
                            </Link>
                            <Link href="/booking" className="btn-accent !py-2.5 !px-5 !text-[12px] no-underline">
                                ???�약 +
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-[var(--border)]">
                        <div className="text-center">
                            <div className="text-[18px] font-bold text-primary-dark">{reservations.length}</div>
                            <div className="text-[11px] text-[var(--text-muted)]">?�체 ?�약</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[18px] font-bold text-[#2d9f6f]">{prescriptions.length}</div>
                            <div className="text-[11px] text-[var(--text-muted)]">처방 기록</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[18px] font-bold text-accent">{totalPaid.toLocaleString()}??/div>
                            <div className="text-[11px] text-[var(--text-muted)]">�?결제??/div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold cursor-pointer transition-all border-none whitespace-nowrap ${activeTab === tab.key ? "bg-primary text-white" : "bg-white text-[var(--text-light)] hover:bg-primary/[0.04]"}`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                            {tab.count != null && tab.count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-accent/10 text-accent"}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Reservations Tab */}
                {activeTab === "reservations" && (
                    <div className="animate-fadeIn">
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                            {["?�체", "CONFIRMED", "WAITING", "COMPLETED", "CANCELLED"].map((status) => {
                                const label = status === "?�체" ? "?�체" : statusMap[status]?.label || status;
                                return (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-lg text-[11px] font-semibold cursor-pointer transition-all border-none whitespace-nowrap ${filterStatus === status ? "bg-primary/10 text-primary" : "bg-white text-[var(--text-muted)] hover:text-primary"}`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-3">
                            {filteredReservations.map((res) => {
                                const status = statusMap[res.status] || statusMap.WAITING;
                                const isPast = res.status === "COMPLETED" || res.status === "CANCELLED";
                                return (
                                    <div key={res.id} className={`bg-white rounded-2xl border border-[var(--border)] p-5 transition-all ${isPast ? "opacity-70" : "hover:shadow-md"}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${isPast ? "bg-[var(--bg)]" : "bg-gradient-to-br from-primary to-primary-light text-white"}`}>
                                                <div className={`text-[10px] font-medium ${isPast ? "text-[var(--text-muted)]" : "opacity-80"}`}>
                                                    {new Date(res.reservationDate).toLocaleDateString("ko-KR", { month: "short" })}
                                                </div>
                                                <div className={`text-[18px] font-bold leading-tight ${isPast ? "text-[var(--text-muted)]" : ""}`}>
                                                    {new Date(res.reservationDate).getDate()}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[14px] font-bold text-primary-dark">{res.doctorName} ?�문??/span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ color: status.color, background: status.bg }}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div className="text-[12px] text-[var(--text-light)]">
                                                    {res.departmentName} · {res.reservationTime} · {res.reservationCode}
                                                </div>
                                                {res.symptom && (
                                                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">증상: {res.symptom}</div>
                                                )}
                                            </div>

                                            <div className="text-right flex-shrink-0 hidden sm:block">
                                                {res.status === "COMPLETED" && (
                                                    <Link href="/payment" className="text-[11px] text-accent font-semibold no-underline hover:underline">
                                                        결제?�기 ??                                                    </Link>
                                                )}
                                                {(res.status === "CONFIRMED" || res.status === "WAITING") && (
                                                    <button
                                                        onClick={() => handleCancel(res.id)}
                                                        className="text-[11px] text-[var(--text-muted)] hover:text-[#ef4444] bg-transparent border-none cursor-pointer transition-colors"
                                                    >
                                                        ?�약 취소
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
                                <div className="text-5xl mb-4">?��</div>
                                <h3 className="text-[16px] font-bold text-primary-dark mb-2">?�약 ?�역???�습?�다</h3>
                                <p className="text-[13px] text-[var(--text-muted)] mb-4">?�로???�약??만들?�보?�요</p>
                                <Link href="/booking" className="btn-primary !py-2.5 !px-6 !text-[13px] no-underline">?�약?�기</Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Prescriptions Tab */}
                {activeTab === "prescriptions" && (
                    <div className="animate-fadeIn">
                        {prescriptions.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {prescriptions.map((p) => (
                                    <div key={p.id} className="bg-white rounded-2xl border border-[var(--border)] p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[14px] font-bold text-primary-dark">{p.doctorName} ?�문??/span>
                                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/[0.08] text-accent font-semibold">
                                                    {p.diagnosis}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-[var(--text-muted)]">{p.departmentName}</span>
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

                                        <div className="text-[11px] text-[var(--text-muted)] mt-3">{p.createdAt?.split("T")[0]}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-[var(--border)]">
                                <div className="text-5xl mb-4">?��</div>
                                <h3 className="text-[16px] font-bold text-primary-dark mb-2">처방 기록???�습?�다</h3>
                                <p className="text-[13px] text-[var(--text-muted)]">진료 ???�사가 처방?�면 ?�기???�시?�니??/p>
                            </div>
                        )}
                    </div>
                )}

                {/* Payments Tab */}
                {activeTab === "payments" && (
                    <div className="animate-fadeIn">
                        {payments.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {payments.map((p) => {
                                    const isPaid = p.status === "COMPLETED";
                                    return (
                                        <div key={p.id} className={`bg-white rounded-2xl border border-[var(--border)] p-5 ${!isPaid && "opacity-60"}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px] font-bold text-primary-dark">{p.doctorName} ?�문??/span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isPaid ? "bg-[rgba(45,159,111,0.08)] text-[#2d9f6f]" : "bg-[rgba(239,68,68,0.08)] text-[#ef4444]"}`}>
                                                        {isPaid ? "결제?�료" : "취소"}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-[var(--text-muted)]">{p.paymentCode}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-[12px] text-[var(--text-light)]">
                                                    {p.departmentName} · {p.reservationDate} · {methodMap[p.method] || p.method}
                                                </div>
                                                <div className="text-[15px] font-bold text-accent">{p.amount.toLocaleString()}??/div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-[var(--border)]">
                                <div className="text-5xl mb-4">?��</div>
                                <h3 className="text-[16px] font-bold text-primary-dark mb-2">결제 ?�역???�습?�다</h3>
                                <p className="text-[13px] text-[var(--text-muted)]">진료 ?�료 ??결제?�면 ?�기???�시?�니??/p>
                            </div>
                        )}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="animate-fadeIn max-w-[600px]">
                        <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                            <div className="p-6 border-b border-[var(--border)]">
                                <h3 className="text-[15px] font-bold text-primary-dark">기본 ?�보</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-5">
                                    {[
                                        { label: "?�름", value: user?.name || "-" },
                                        { label: "?�메??, value: user?.email || "-" },
                                        { label: "?�원 ?�형", value: user?.role === "PATIENT" ? "?�반 ?�자" : user?.role || "-" },
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
                                    <div className="text-[12px] font-semibold text-primary-dark mb-1">개인?�보 보호</div>
                                    <p className="text-[11px] text-[var(--text-light)] leading-[1.6]">
                                        ?�원?�의 개인?�보??BCrypt�??�호?�되???�전?�게 보호?�니??
                                        비�?번호 변경이??계정 관??문의??고객?�터�??�락?�주?�요.
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
