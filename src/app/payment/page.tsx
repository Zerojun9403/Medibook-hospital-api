"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Shield } from "@/components/icons/Icons";
import { tokenManager } from "@/lib/api";

const API_BASE = "/api";

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

const paymentStatusMap: Record<
  string,
  { label: string; color: string; bg: string }
> = {
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
  if (!res.ok)
    throw new Error(
      text ? JSON.parse(text).message || "요청 실패" : "요청 실패",
    );
  return text ? JSON.parse(text) : null;
}

declare global {
  interface Window {
    TossPayments: any;
  }
}

export default function PaymentPage() {
  const [activeTab, setActiveTab] = useState<"pay" | "history">("pay");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tossClientKey, setTossClientKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [payResult, setPayResult] = useState<"success" | "fail" | null>(null);
  const [payResultMsg, setPayResultMsg] = useState("");

  useEffect(() => {
    loadData();
    loadTossKey();
    loadTossScript();
    handlePaymentResult();
  }, []);

  const loadData = () => {
    apiFetch("/reservations/my")
      .then(setReservations)
      .catch(() => setReservations([]));
    apiFetch("/payments/my")
      .then(setPayments)
      .catch(() => setPayments([]));
  };

  const loadTossKey = async () => {
    try {
      const data = await apiFetch("/payments/toss/client-key");
      setTossClientKey(data.clientKey);
    } catch {}
  };

  const loadTossScript = () => {
    if (document.getElementById("toss-sdk")) return;
    const script = document.createElement("script");
    script.id = "toss-sdk";
    script.src = "https://js.tosspayments.com/v1/payment";
    document.head.appendChild(script);
  };

  const handlePaymentResult = () => {
    const params = new URLSearchParams(window.location.search);
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = params.get("amount");

    if (paymentKey && orderId && amount) {
      confirmPayment(paymentKey, orderId, amount);
      window.history.replaceState({}, "", "/payment");
    }

    const code = params.get("code");
    const message = params.get("message");
    if (code && message) {
      setPayResult("fail");
      setPayResultMsg(message);
      window.history.replaceState({}, "", "/payment");
    }
  };

  const confirmPayment = async (
    paymentKey: string,
    orderId: string,
    amount: string,
  ) => {
    try {
      await apiFetch("/payments/toss/confirm", {
        method: "POST",
        body: JSON.stringify({ paymentKey, orderId, amount }),
      });
      setPayResult("success");
      setPayResultMsg("결제가 성공적으로 완료되었습니다!");
      loadData();
    } catch (e: any) {
      setPayResult("fail");
      setPayResultMsg(e.message || "결제 확인에 실패했습니다.");
    }
  };

  const paidReservationIds = payments
    .filter((p) => p.status !== "CANCELLED")
    .map((p) => p.reservationId);
  const unpaidReservations = reservations.filter(
    (r) => r.status === "COMPLETED" && !paidReservationIds.includes(r.id),
  );

  const handleTossPay = async (res: Reservation) => {
    if (!tossClientKey || !window.TossPayments) {
      alert("결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsProcessing(true);

    try {
      const tossPayments = window.TossPayments(tossClientKey);
      const amount = res.fee || 30000;
      const orderId = `ORDER_${res.id}_${Date.now()}`;

      await tossPayments.requestPayment("카드", {
        amount,
        orderId,
        orderName: `${res.departmentName} 진료비 - ${res.doctorName}`,
        customerName: res.patientName,
        successUrl: `${window.location.origin}/payment?`,
        failUrl: `${window.location.origin}/payment?`,
      });
    } catch (e: any) {
      if (e.code !== "USER_CANCEL") {
        alert(e.message || "결제 요청에 실패했습니다.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelPayment = async (paymentId: number) => {
    if (!confirm("결제를 취소하시겠습니까?")) return;
    try {
      await apiFetch(`/payments/${paymentId}/cancel`, { method: "PATCH" });
      loadData();
    } catch (e: any) {
      alert(e.message || "취소에 실패했습니다.");
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[64px]">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
              <Heart size={16} />
            </div>
            <div className="font-serif text-lg font-bold text-primary-dark leading-tight">
              MediBook
            </div>
          </Link>
          <Link
            href="/patient/dashboard"
            className="text-[13px] text-[var(--text-muted)] no-underline hover:text-primary transition-colors"
          >
            ← 대시보드로
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary py-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">
              Payment
            </span>
          </div>
          <h1 className="font-serif text-[32px] font-bold text-white mb-2">
            진료비 결제
          </h1>
          <p className="text-[14px] text-white/50">
            토스페이먼츠를 통한 안전한 결제
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Payment Result Banner */}
        {payResult === "success" && (
          <div className="mb-6 p-5 rounded-2xl bg-[rgba(45,159,111,0.06)] border border-[#2d9f6f]/20 flex items-center gap-4">
            <div className="text-3xl">✅</div>
            <div>
              <div className="text-[15px] font-bold text-[#2d9f6f]">
                결제 완료!
              </div>
              <div className="text-[13px] text-[var(--text-light)]">
                {payResultMsg}
              </div>
            </div>
            <button
              onClick={() => setPayResult(null)}
              className="ml-auto text-[var(--text-muted)] bg-transparent border-none cursor-pointer text-lg"
            >
              ✕
            </button>
          </div>
        )}
        {payResult === "fail" && (
          <div className="mb-6 p-5 rounded-2xl bg-[rgba(239,68,68,0.06)] border border-[#ef4444]/20 flex items-center gap-4">
            <div className="text-3xl">❌</div>
            <div>
              <div className="text-[15px] font-bold text-[#ef4444]">
                결제 실패
              </div>
              <div className="text-[13px] text-[var(--text-light)]">
                {payResultMsg}
              </div>
            </div>
            <button
              onClick={() => setPayResult(null)}
              className="ml-auto text-[var(--text-muted)] bg-transparent border-none cursor-pointer text-lg"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: "🏥",
              label: "미결제 진료",
              value: `${unpaidReservations.length}건`,
              color: "#e8a838",
            },
            {
              icon: "✅",
              label: "결제 완료",
              value: `${payments.filter((p) => p.status === "COMPLETED").length}건`,
              color: "#2d9f6f",
            },
            {
              icon: "💰",
              label: "총 결제액",
              value: `${totalPaid.toLocaleString()}원`,
              color: "#1b4d6e",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-[var(--border)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-xl">{stat.icon}</div>
                <span className="text-[12px] text-[var(--text-muted)] font-medium">
                  {stat.label}
                </span>
              </div>
              <div
                className="text-[22px] font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
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
              <h2 className="text-[16px] font-bold text-primary-dark">
                미결제 진료
              </h2>
              <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                진료 완료 후 결제가 필요한 예약 · 토스페이먼츠 결제
              </p>
            </div>
            <div className="px-6 pb-6">
              {unpaidReservations.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {unpaidReservations.map((res) => (
                    <div
                      key={res.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex flex-col items-center justify-center flex-shrink-0">
                        <div className="text-[10px] font-medium text-accent/80">
                          {new Date(res.reservationDate).toLocaleDateString(
                            "ko-KR",
                            { month: "short" },
                          )}
                        </div>
                        <div className="text-[18px] font-bold text-accent leading-tight">
                          {new Date(res.reservationDate).getDate()}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[14px] font-bold text-primary-dark">
                            {res.doctorName} 전문의
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(45,159,111,0.08)] text-[#2d9f6f] font-semibold">
                            진료완료
                          </span>
                        </div>
                        <div className="text-[12px] text-[var(--text-light)]">
                          {res.departmentName} · {res.reservationDate}
                        </div>
                        <div className="text-[13px] font-bold text-accent mt-0.5">
                          {(res.fee || 30000).toLocaleString()}원
                        </div>
                      </div>

                      <button
                        onClick={() => handleTossPay(res)}
                        disabled={isProcessing}
                        className="text-[12px] text-white bg-[#3182F6] hover:bg-[#2270E0] border-none rounded-lg px-4 py-2.5 cursor-pointer transition-all font-semibold disabled:opacity-50 flex items-center gap-2"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            width="24"
                            height="24"
                            rx="4"
                            fill="white"
                            fillOpacity="0.2"
                          />
                          <path
                            d="M7 10h10M7 14h6"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        {isProcessing ? "처리중..." : "토스로 결제"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">✨</div>
                  <p className="text-[14px] font-semibold text-primary-dark mb-1">
                    미결제 진료가 없습니다
                  </p>
                  <p className="text-[12px] text-[var(--text-muted)]">
                    모든 진료비가 결제 완료되었습니다
                  </p>
                </div>
              )}
            </div>

            {/* Toss Payments 안내 */}
            <div className="mx-6 mb-6 p-4 rounded-xl bg-[#3182F6]/[0.04] border border-[#3182F6]/10">
              <div className="flex items-start gap-3">
                <Shield
                  size={16}
                  className="text-[#3182F6] mt-0.5 flex-shrink-0"
                />
                <div>
                  <div className="text-[12px] font-semibold text-primary-dark mb-1">
                    토스페이먼츠 안전결제
                  </div>
                  <p className="text-[11px] text-[var(--text-light)] leading-[1.6]">
                    카드, 간편결제 등 다양한 결제 수단을 지원합니다. 모든 결제
                    정보는 토스페이먼츠에 의해 암호화되어 안전하게 처리됩니다.
                    <span className="text-[#3182F6] font-semibold">
                      {" "}
                      (테스트 모드)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="p-6 pb-4">
              <h2 className="text-[16px] font-bold text-primary-dark">
                결제 내역
              </h2>
              <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                총 {payments.length}건
              </p>
            </div>
            <div className="px-6 pb-6">
              {payments.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {payments.map((p) => {
                    const status =
                      paymentStatusMap[p.status] || paymentStatusMap.PENDING;
                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold text-primary-dark">
                              {p.doctorName} 전문의
                            </span>
                            <span
                              className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                              style={{
                                color: status.color,
                                background: status.bg,
                              }}
                            >
                              {status.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-[var(--text-muted)]">
                            {p.paymentCode}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                          <div>
                            <div className="text-[10px] text-[var(--text-muted)] mb-0.5">
                              진료과
                            </div>
                            <div className="text-[12px] text-[var(--text)]">
                              {p.departmentName}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-[var(--text-muted)] mb-0.5">
                              진료일
                            </div>
                            <div className="text-[12px] text-[var(--text)]">
                              {p.reservationDate}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-[var(--text-muted)] mb-0.5">
                              결제 수단
                            </div>
                            <div className="text-[12px] text-[var(--text)]">
                              {methodMap[p.method] || p.method}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-[var(--text-muted)] mb-0.5">
                              결제 금액
                            </div>
                            <div className="text-[14px] font-bold text-accent">
                              {p.amount.toLocaleString()}원
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[var(--text-muted)]">
                            {p.createdAt?.split("T")[0]}
                          </span>
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
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-[14px] text-[var(--text-muted)]">
                    결제 내역이 없습니다
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
