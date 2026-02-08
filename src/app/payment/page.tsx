"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ChevronRight, Shield } from "@/components/icons/Icons";
import { tokenManager } from "@/lib/api";

const API_BASE = "http://localhost:8080";

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
    patientName: string;
    reservationId: number;
    reservationCode: string;
    doctorName: string;
    departmentName: string;
    reservationDate: string;
    amount: number;
    method: string;
    status: string;
    createdAt: string;
}

const methodMap: Record<string, string> = {
    CARD: "💳 카드결제",
    CASH: "💵 현금결제",
    TRANSFER: "🏦 계좌이체",
    KAKAO_PAY: "🟡 카카오페이",
    NAVER_PAY: "🟢 네이버페이",
};

const paymentStatusMap: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "대기", color: "#e8a838", bg: "rgba(232,168,56,0.08)" },
    COMPLETED: { label: "완료", color: "#2d9f6f", bg: "rgba(45,159,111,0.08)" },
    CANCELLED: { label: "취소", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
    REFUNDED: { label: "환불", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
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
    if (!res.ok) throw new Error(text ? JSON.parse(text).message || "요청 실패" : "요청 실패");
    return text ? JSON.parse(text) : null;
}

export default function PaymentPage() {
    const [activeTab, setActiveTab] = useState<"pay" | "history">("pay");
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
    const [selectedMethod, setSelectedMethod] = useState("CARD");
    const [isProcessing, setIsProcessing] = useState(false);
    const [paySuccess, setPaySuccess] = useState<Payment | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        apiFetch("/api/reservations/my")
            .then((data) => setReservations(data || []))
            .catch(() => setReservations([]));

        apiFetch("/api/payments/my")
            .then((data) => setPayments(data || []))
            .catch(() => setPayments([]));
    };

    // 결제 가능한 예약: COMPLETED 상태이고 아직 결제 안 된 것
    const paidReservationIds = payments.filter((p) => p.status !== "CANCELLED").map((p) => p.reservationId);
    const unpaidReservations = reservations.filter(
        (r) => r.status === "COMPLETED" && !paidReservationIds.includes(r.id)
    );

    const openPayModal = (res: Reservation) => {
        setSelectedRes(res);
        setSelectedMethod("CARD");
        setPaySuccess(null);
        setShowPayModal(true);
    };

    const handlePay = async () => {
        if (!selectedRes) return;
        setIsProcessing(true);
        try {
            const amount = selectedRes.fee || 30000;
            const result = await apiFetch("/api/payments", {
                method: "POST",
                body: JSON.stringify({
                    reservationId: selectedRes.id,
                    amount,
                    method: selectedMethod,
                }),
            });
            setPaySuccess(result);
            loadData();
        } catch (e: any) {
            alert(e.message || "결제에 실패했습니다.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancelPayment = async (paymentId: number) => {
        if (!confirm("결제를 취소하시겠습니까?")) return;
        try {
            await apiFetch(`/api/payments/${paymentId}/cancel`, { method: "PATCH" });
            loadData();
        } catch (e: any) {
            alert(e.message || "취소에 실패했습니다.");
        }
    };

    const totalPaid = payments.filter((p) => p.status === "COMPLETED").reduce((sum, p) => sum + p.amount, 0);

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
                        ← 대시보드로
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-dark to-primary py-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px w-8 bg-accent" />
                        <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">Payment</span>
                    </div>
                    <h1 className="font-serif text-[32px] font-bold text-white mb-2">진료비 결제</h1>
                    <p className="text-[14px] text-white/50">진료 완료된 예약의 결제를 진행하세요</p>
                </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: "💳", label: "미결제 진료", value: `${unpaidReservations.length}건`, color: "#e8a838" },
                        { icon: "✅", label: "결제 완료", value: `${payments.filter((p) => p.status === "COMPLETED").length}건`, color: "#2d9f6f" },
                        { icon: "💰", label: "총 결제액", value: `${totalPaid.toLocaleString()}원`, color: "#1b4d6e" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-[var(--border)]">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="text-xl">{stat.icon}</div>
                                <span className="text-[12px] text-[var(--text-muted)] font-medium">{stat.label}</span>
                            </div>
                            <div className="text-[22px] font-bold" style={{ color: stat.color }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("pay")}
                        className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all border-none ${activeTab === "pay" ? "bg-primary text-white" : "bg-white text-[var(--text-muted)] hover:text-primary"}`}
                    >
                        💳 결제하기
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-all border-none ${activeTab === "history" ? "bg-primary text-white" : "bg-white text-[var(--text-muted)] hover:text-primary"}`}
                    >
                        📋 결제 내역
                    </button>
                </div>

                {/* Pay Tab */}
                {activeTab === "pay" && (
                    <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                        <div className="p-6 pb-4">
                            <h2 className="text-[16px] font-bold text-primary-dark">미결제 진료</h2>
                            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">진료 완료 후 결제가 필요한 예약</p>
                        </div>
                        <div className="px-6 pb-6">
                            {unpaidReservations.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {unpaidReservations.map((res) => (
                                        <div key={res.id} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex flex-col items-center justify-center flex-shrink-0">
                                                <div className="text-[10px] font-medium text-accent/80">
                                                    {new Date(res.reservationDate).toLocaleDateString("ko-KR", { month: "short" })}
                                                </div>
                                                <div className="text-[18px] font-bold text-accent leading-tight">
                                                    {new Date(res.reservationDate).getDate()}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[14px] font-bold text-primary-dark">{res.doctorName} 전문의</span>
                                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(45,159,111,0.08)] text-[#2d9f6f] font-semibold">
                                                        진료완료
                                                    </span>
                                                </div>
                                                <div className="text-[12px] text-[var(--text-light)]">{res.departmentName} · {res.reservationDate}</div>
                                                <div className="text-[13px] font-bold text-accent mt-0.5">{(res.fee || 30000).toLocaleString()}원</div>
                                            </div>

                                            <button
                                                onClick={() => openPayModal(res)}
                                                className="text-[12px] text-white bg-accent hover:bg-accent/90 border-none rounded-lg px-4 py-2 cursor-pointer transition-all font-semibold"
                                            >
                                                결제하기 →
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-4xl mb-3">✅</div>
                                    <p className="text-[14px] font-semibold text-primary-dark mb-1">미결제 진료가 없습니다</p>
                                    <p className="text-[12px] text-[var(--text-muted)]">모든 진료비가 결제 완료되었습니다</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                        <div className="p-6 pb-4">
                            <h2 className="text-[16px] font-bold text-primary-dark">결제 내역</h2>
                            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">총 {payments.length}건</p>
                        </div>
                        <div className="px-6 pb-6">
                            {payments.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {payments.map((p) => {
                                        const status = paymentStatusMap[p.status] || paymentStatusMap.PENDING;
                                        return (
                                            <div key={p.id} className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[14px] font-bold text-primary-dark">{p.doctorName} 전문의</span>
                                                        <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ color: status.color, background: status.bg }}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] text-[var(--text-muted)]">{p.paymentCode}</span>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                                                    <div>
                                                        <div className="text-[10px] text-[var(--text-muted)] mb-0.5">진료과</div>
                                                        <div className="text-[12px] text-[var(--text)]">{p.departmentName}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-[var(--text-muted)] mb-0.5">진료일</div>
                                                        <div className="text-[12px] text-[var(--text)]">{p.reservationDate}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-[var(--text-muted)] mb-0.5">결제 수단</div>
                                                        <div className="text-[12px] text-[var(--text)]">{methodMap[p.method] || p.method}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-[var(--text-muted)] mb-0.5">결제 금액</div>
                                                        <div className="text-[14px] font-bold text-accent">{p.amount.toLocaleString()}원</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] text-[var(--text-muted)]">{p.createdAt?.split("T")[0]}</span>
                                                    {p.status === "COMPLETED" && (
                                                        <button
                                                            onClick={() => handleCancelPayment(p.id)}
                                                            className="text-[11px] text-[#ef4444] bg-[rgba(239,68,68,0.06)] border border-[#ef4444]/20 rounded-lg px-3 py-1 cursor-pointer transition-all font-semibold hover:bg-[#ef4444] hover:text-white hover:border-[#ef4444]"
                                                        >
                                                            결제 취소
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-4xl mb-3">💳</div>
                                    <p className="text-[14px] text-[var(--text-muted)]">결제 내역이 없습니다</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {showPayModal && selectedRes && !paySuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={() => setShowPayModal(false)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl max-w-[480px] w-full overflow-hidden animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-[var(--border)]">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[18px] font-bold text-primary-dark">💳 진료비 결제</h2>
                                <button onClick={() => setShowPayModal(false)} className="w-8 h-8 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary cursor-pointer transition-all">
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* 결제 정보 */}
                            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] mb-5">
                                <div className="text-[12px] text-[var(--text-muted)] mb-3">결제 정보</div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-[var(--text-light)]">예약코드</span>
                                        <span className="font-medium text-primary-dark">{selectedRes.reservationCode}</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-[var(--text-light)]">담당의</span>
                                        <span className="font-medium text-primary-dark">{selectedRes.doctorName} ({selectedRes.departmentName})</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-[var(--text-light)]">진료일</span>
                                        <span className="font-medium text-primary-dark">{selectedRes.reservationDate}</span>
                                    </div>
                                    <div className="border-t border-[var(--border)] my-1" />
                                    <div className="flex justify-between text-[15px]">
                                        <span className="font-semibold text-primary-dark">결제 금액</span>
                                        <span className="font-bold text-accent">{(selectedRes.fee || 30000).toLocaleString()}원</span>
                                    </div>
                                </div>
                            </div>

                            {/* 결제 수단 */}
                            <div className="mb-5">
                                <div className="text-[12px] font-semibold text-primary-dark mb-3">결제 수단 선택</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { key: "CARD", label: "💳 카드결제" },
                                        { key: "KAKAO_PAY", label: "🟡 카카오페이" },
                                        { key: "NAVER_PAY", label: "🟢 네이버페이" },
                                        { key: "TRANSFER", label: "🏦 계좌이체" },
                                    ].map((m) => (
                                        <button
                                            key={m.key}
                                            onClick={() => setSelectedMethod(m.key)}
                                            className={`p-3 rounded-xl text-[12px] font-semibold cursor-pointer transition-all border-[1.5px] ${selectedMethod === m.key
                                                ? "border-primary bg-primary/[0.04] text-primary"
                                                : "border-[var(--border)] bg-white text-[var(--text-light)] hover:border-primary/30"
                                                }`}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 보안 안내 */}
                            <div className="p-3 rounded-lg bg-primary/[0.03] border border-primary/[0.08] mb-5">
                                <div className="flex items-start gap-2">
                                    <Shield size={14} className="text-primary mt-0.5 flex-shrink-0" />
                                    <p className="text-[11px] text-[var(--text-light)] leading-[1.6]">
                                        모든 결제 정보는 암호화되어 안전하게 처리됩니다.
                                    </p>
                                </div>
                            </div>

                            {/* 버튼 */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPayModal(false)}
                                    className="btn-outline flex-1 !py-3 !text-[13px]"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handlePay}
                                    disabled={isProcessing}
                                    className="btn-accent flex-1 !py-3 !text-[13px] !font-bold disabled:opacity-60"
                                >
                                    {isProcessing ? "결제 처리중..." : `${(selectedRes.fee || 30000).toLocaleString()}원 결제하기`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Success Modal */}
            {showPayModal && paySuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={() => setShowPayModal(false)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl max-w-[420px] w-full overflow-hidden animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-[rgba(45,159,111,0.1)] flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">✅</span>
                            </div>
                            <h2 className="text-[20px] font-bold text-primary-dark mb-2">결제 완료!</h2>
                            <p className="text-[13px] text-[var(--text-light)] mb-5">진료비 결제가 성공적으로 처리되었습니다</p>

                            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] mb-5 text-left">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-[var(--text-muted)]">결제코드</span>
                                        <span className="font-mono font-bold text-primary">{paySuccess.paymentCode}</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-[var(--text-muted)]">결제수단</span>
                                        <span className="font-medium text-[var(--text)]">{methodMap[paySuccess.method]}</span>
                                    </div>
                                    <div className="flex justify-between text-[15px] border-t border-[var(--border)] pt-2 mt-1">
                                        <span className="font-semibold text-primary-dark">결제금액</span>
                                        <span className="font-bold text-accent">{paySuccess.amount.toLocaleString()}원</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowPayModal(false)}
                                className="btn-primary w-full !py-3 !text-[14px]"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
