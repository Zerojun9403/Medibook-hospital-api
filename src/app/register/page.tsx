"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Shield, ChevronRight, Mail } from "@/components/icons/Icons";
import { authAPI } from "@/lib/api";

// Icons
const User = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Lock = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Phone = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const Eye = ({ open }: { open: boolean }) => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Password strength checker
function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: "약함", color: "#ef4444", width: "20%" };
  if (score <= 2) return { level: "보통", color: "#E8A838", width: "40%" };
  if (score <= 3) return { level: "양호", color: "#2A6F97", width: "65%" };
  return { level: "강함", color: "#2D9F6F", width: "100%" };
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"patient" | "doctor" | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    birthdate: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [error, setError] = useState("");

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const strength = getPasswordStrength(form.password);
  const passwordMatch =
    form.passwordConfirm.length > 0 &&
    form.password === form.passwordConfirm;

  const allRequired = agreements.terms && agreements.privacy;
  const toggleAll = () => {
    const allChecked = agreements.terms && agreements.privacy && agreements.marketing;
    setAgreements({
      terms: !allChecked,
      privacy: !allChecked,
      marketing: !allChecked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        birthdate: form.birthdate,
        userType: userType || "patient",
      });
      if (res.success) {
        alert("회원가입이 완료되었습니다! 로그인해주세요.");
        window.location.href = "/login";
      }
    } catch (err: any) {
      setError(err.message || "회원가입에 실패했습니다");
      setIsLoading(false);
    }
  };

  // Shared input component
  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    icon,
    value,
    onChange,
    extra,
  }: {
    label: string;
    name: string;
    type?: string;
    placeholder: string;
    icon: React.ReactNode;
    value: string;
    onChange: (v: string) => void;
    extra?: React.ReactNode;
  }) => (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-primary-dark mb-2">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-[1.5px] transition-all duration-200 bg-white ${
          activeField === name
            ? "border-primary shadow-[0_0_0_3px_rgba(27,77,110,0.08)]"
            : "border-[var(--border)] hover:border-[var(--text-muted)]"
        }`}
      >
        <div
          className={`transition-colors ${
            activeField === name ? "text-primary" : "text-[var(--text-muted)]"
          }`}
        >
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setActiveField(name)}
          onBlur={() => setActiveField(null)}
          className="flex-1 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] bg-transparent outline-none font-medium"
          required
        />
        {extra}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-bg-dark via-[#162A3A] to-primary">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-[15%] right-[5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(200,169,110,0.12),transparent_70%)] blur-[80px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(42,111,151,0.15),transparent_70%)] blur-[60px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white border border-white/10">
              <Heart size={20} />
            </div>
            <div>
              <div className="font-serif text-xl font-bold text-white leading-tight">
                MediBook
              </div>
              <div className="text-[10px] text-accent font-semibold tracking-[0.12em]">
                PREMIUM HEALTHCARE
              </div>
            </div>
          </Link>

          {/* Steps Indicator */}
          <div className="max-w-[440px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-accent" />
              <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">
                Create Account
              </span>
            </div>
            <h1 className="font-serif text-[40px] font-bold text-white leading-[1.2] mb-5">
              쉽고 빠른
              <br />
              <span className="text-accent">회원가입</span>
            </h1>
            <p className="text-[16px] text-white/50 leading-[1.75] mb-10">
              3분이면 가입 완료. 가입 즉시 예약 서비스를
              <br />
              이용할 수 있습니다.
            </p>

            {/* Step Progress */}
            <div className="flex flex-col gap-3">
              {[
                { num: 1, title: "회원 유형 선택", desc: "환자 또는 의료진" },
                { num: 2, title: "기본 정보 입력", desc: "이름, 이메일, 연락처" },
                { num: 3, title: "약관 동의 & 완료", desc: "이용약관 및 개인정보" },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    step === s.num
                      ? "bg-white/[0.08] border border-accent/30"
                      : step > s.num
                      ? "bg-white/[0.03] border border-white/[0.04]"
                      : "bg-transparent border border-transparent"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-bold flex-shrink-0 transition-all ${
                      step > s.num
                        ? "bg-[var(--success)] text-white"
                        : step === s.num
                        ? "bg-accent text-primary-dark"
                        : "bg-white/[0.06] text-white/30"
                    }`}
                  >
                    {step > s.num ? <Check /> : s.num}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-semibold ${
                        step >= s.num ? "text-white/90" : "text-white/30"
                      }`}
                    >
                      {s.title}
                    </div>
                    <div className="text-xs text-white/35">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-white/25">
            © 2026 MediBook. Portfolio Project.
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL - Form ===== */}
      <div className="flex-1 flex items-center justify-center bg-[var(--bg)] px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
                <Heart size={18} />
              </div>
              <div className="font-serif text-lg font-bold text-primary-dark">
                MediBook
              </div>
            </Link>
          </div>

          {/* Mobile Step Indicator */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= s ? "bg-primary flex-[2]" : "bg-[var(--border)] flex-1"
                }`}
              />
            ))}
            <span className="text-xs text-[var(--text-muted)] ml-2 font-medium">
              {step}/3
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ===== STEP 1: User Type ===== */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <h2 className="text-[28px] font-bold text-primary-dark mb-2">
                  회원 유형 선택
                </h2>
                <p className="text-sm text-[var(--text-light)] mb-8">
                  어떤 유형으로 가입하시겠습니까?
                </p>

                <div className="flex flex-col gap-4 mb-8">
                  {[
                    {
                      type: "patient" as const,
                      icon: "🏥",
                      title: "환자",
                      desc: "진료 예약, 대기열 확인, 결제",
                      features: ["실시간 예약", "대기 순번 확인", "간편 결제", "알림 수신"],
                    },
                    {
                      type: "doctor" as const,
                      icon: "👨‍⚕️",
                      title: "의사 / 관리자",
                      desc: "스케줄 관리, 환자 조회, 통계",
                      features: ["스케줄 관리", "예약 현황 대시보드", "환자 정보 조회", "통계 분석"],
                    },
                  ].map((option) => (
                    <button
                      key={option.type}
                      type="button"
                      onClick={() => setUserType(option.type)}
                      className={`w-full text-left p-6 rounded-2xl border-[1.5px] transition-all duration-300 cursor-pointer bg-white ${
                        userType === option.type
                          ? "border-primary shadow-[0_0_0_3px_rgba(27,77,110,0.08)] bg-primary/[0.02]"
                          : "border-[var(--border)] hover:border-primary/30 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/[0.06] to-accent/[0.06] flex items-center justify-center text-2xl">
                          {option.icon}
                        </div>
                        <div>
                          <div className="text-base font-bold text-primary-dark">
                            {option.title}
                          </div>
                          <div className="text-xs text-[var(--text-light)]">
                            {option.desc}
                          </div>
                        </div>
                        <div
                          className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            userType === option.type
                              ? "border-primary bg-primary"
                              : "border-[var(--border)]"
                          }`}
                        >
                          {userType === option.type && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {option.features.map((f) => (
                          <span
                            key={f}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/[0.04] text-primary"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!userType}
                  onClick={() => setStep(2)}
                  className="btn-primary w-full !py-3.5 !text-[15px] !rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-2">
                    다음 단계
                    <ChevronRight size={16} />
                  </div>
                </button>
              </div>
            )}

            {/* ===== STEP 2: Personal Info ===== */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <h2 className="text-[28px] font-bold text-primary-dark mb-2">
                  기본 정보
                </h2>
                <p className="text-sm text-[var(--text-light)] mb-8">
                  로그인에 사용할 정보를 입력해주세요
                </p>

                <InputField
                  label="이름"
                  name="name"
                  placeholder="홍길동"
                  icon={<User />}
                  value={form.name}
                  onChange={(v) => update("name", v)}
                />

                <InputField
                  label="이메일"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  icon={<Mail size={20} />}
                  value={form.email}
                  onChange={(v) => update("email", v)}
                />

                <InputField
                  label="연락처"
                  name="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  icon={<Phone />}
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                />

                {/* Password */}
                <div className="mb-4">
                  <label className="block text-[13px] font-semibold text-primary-dark mb-2">
                    비밀번호
                  </label>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-[1.5px] transition-all duration-200 bg-white ${
                      activeField === "password"
                        ? "border-primary shadow-[0_0_0_3px_rgba(27,77,110,0.08)]"
                        : "border-[var(--border)] hover:border-[var(--text-muted)]"
                    }`}
                  >
                    <div className={`transition-colors ${activeField === "password" ? "text-primary" : "text-[var(--text-muted)]"}`}>
                      <Lock />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="8자 이상, 영문+숫자+특수문자"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      onFocus={() => setActiveField("password")}
                      onBlur={() => setActiveField(null)}
                      className="flex-1 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] bg-transparent outline-none font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[var(--text-muted)] hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                      <Eye open={showPassword} />
                    </button>
                  </div>
                  {/* Password Strength */}
                  {form.password && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: strength.width, background: strength.color }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: strength.color }}>
                        {strength.level}
                      </span>
                    </div>
                  )}
                </div>

                {/* Password Confirm */}
                <div className="mb-6">
                  <label className="block text-[13px] font-semibold text-primary-dark mb-2">
                    비밀번호 확인
                  </label>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-[1.5px] transition-all duration-200 bg-white ${
                      activeField === "passwordConfirm"
                        ? form.passwordConfirm && !passwordMatch
                          ? "border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
                          : "border-primary shadow-[0_0_0_3px_rgba(27,77,110,0.08)]"
                        : "border-[var(--border)] hover:border-[var(--text-muted)]"
                    }`}
                  >
                    <div className={`transition-colors ${activeField === "passwordConfirm" ? "text-primary" : "text-[var(--text-muted)]"}`}>
                      <Lock />
                    </div>
                    <input
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      value={form.passwordConfirm}
                      onChange={(e) => update("passwordConfirm", e.target.value)}
                      onFocus={() => setActiveField("passwordConfirm")}
                      onBlur={() => setActiveField(null)}
                      className="flex-1 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] bg-transparent outline-none font-medium"
                      required
                    />
                    {form.passwordConfirm && (
                      <div className={passwordMatch ? "text-[var(--success)]" : "text-red-400"}>
                        {passwordMatch ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  {form.passwordConfirm && !passwordMatch && (
                    <p className="text-[11px] text-red-400 mt-1.5 font-medium">
                      비밀번호가 일치하지 않습니다
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-outline !py-3.5 !px-6 !rounded-xl !text-[14px]"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={
                      !form.name || !form.email || !form.phone || !form.password || !passwordMatch
                    }
                    className="btn-primary flex-1 !py-3.5 !text-[15px] !rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-2">
                      다음 단계
                      <ChevronRight size={16} />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ===== STEP 3: Agreements ===== */}
            {step === 3 && (
              <div className="animate-fadeIn">
                <h2 className="text-[28px] font-bold text-primary-dark mb-2">
                  약관 동의
                </h2>
                <p className="text-sm text-[var(--text-light)] mb-8">
                  서비스 이용을 위한 약관에 동의해주세요
                </p>

                {/* Summary Card */}
                <div className="p-5 rounded-xl bg-primary/[0.03] border border-primary/[0.08] mb-6">
                  <div className="text-xs font-semibold text-primary-dark mb-3">
                    가입 정보 확인
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    <div>
                      <span className="text-[var(--text-muted)]">유형:</span>{" "}
                      <span className="font-medium text-[var(--text)]">
                        {userType === "patient" ? "환자" : "의사/관리자"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)]">이름:</span>{" "}
                      <span className="font-medium text-[var(--text)]">{form.name}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)]">이메일:</span>{" "}
                      <span className="font-medium text-[var(--text)]">{form.email}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)]">연락처:</span>{" "}
                      <span className="font-medium text-[var(--text)]">{form.phone}</span>
                    </div>
                  </div>
                </div>

                {/* All Check */}
                <button
                  type="button"
                  onClick={toggleAll}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-[1.5px] border-[var(--border)] bg-white mb-3 cursor-pointer transition-all hover:border-primary/30"
                >
                  <div
                    className={`w-5 h-5 rounded-md border-[1.5px] flex items-center justify-center transition-all ${
                      agreements.terms && agreements.privacy && agreements.marketing
                        ? "bg-primary border-primary"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {agreements.terms && agreements.privacy && agreements.marketing && (
                      <Check />
                    )}
                  </div>
                  <span className="text-[14px] font-bold text-primary-dark">
                    전체 동의
                  </span>
                </button>

                {/* Individual Checks */}
                <div className="flex flex-col gap-2 mb-8">
                  {[
                    { key: "terms" as const, label: "이용약관 동의", required: true },
                    { key: "privacy" as const, label: "개인정보처리방침 동의", required: true },
                    { key: "marketing" as const, label: "마케팅 정보 수신 동의", required: false },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setAgreements((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }))
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer bg-transparent border-none transition-all hover:bg-primary/[0.02]"
                    >
                      <div
                        className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-all ${
                          agreements[item.key]
                            ? "bg-primary border-primary"
                            : "border-[var(--border)]"
                        }`}
                      >
                        {agreements[item.key] && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[13px] text-[var(--text)] font-medium">
                        {item.label}
                      </span>
                      {item.required ? (
                        <span className="text-[11px] text-red-400 font-semibold ml-1">
                          필수
                        </span>
                      ) : (
                        <span className="text-[11px] text-[var(--text-muted)] ml-1">
                          선택
                        </span>
                      )}
                      <ChevronRight size={14} className="ml-auto text-[var(--text-muted)]" />
                    </button>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-outline !py-3.5 !px-6 !rounded-xl !text-[14px]"
                  >
                    이전
                  </button>
                  <button
                    type="submit"
                    disabled={!allRequired || isLoading}
                    className="btn-accent flex-1 !py-3.5 !text-[15px] !rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(15,45,66,0.3)" strokeWidth="3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="#0F2D42" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        가입 처리 중...
                      </div>
                    ) : (
                      "가입 완료"
                    )}
                  </button>
                </div>

                {/* Security */}
                <div className="mt-6 p-4 rounded-xl bg-primary/[0.03] border border-primary/[0.08]">
                  <div className="flex items-start gap-3">
                    <div className="text-primary mt-0.5 flex-shrink-0">
                      <Shield size={16} />
                    </div>
                    <p className="text-[11px] text-[var(--text-light)] leading-[1.6]">
                      개인정보는 BCrypt로 암호화되어 안전하게 저장되며,
                      의료법에 따라 엄격하게 관리됩니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--text-light)]">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold no-underline hover:text-accent transition-colors"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
