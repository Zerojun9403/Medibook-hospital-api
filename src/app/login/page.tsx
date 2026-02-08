"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Mail, Shield, ChevronRight } from "@/components/icons/Icons";
import { authAPI } from "@/lib/api";

// Eye icon for password visibility toggle
const Eye = ({ open }: { open: boolean }) => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
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

// Lock icon
const Lock = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// User icon
const User = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await authAPI.login(email, password);
      if (res.success) {
        const role = res.data.role;
        if (role === "DOCTOR" || role === "ADMIN") {
          window.location.href = "/doctor/dashboard";
        } else {
          window.location.href = "/patient/dashboard";
        }
      }
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ===== LEFT PANEL - Visual / Branding ===== */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-bg-dark via-[#162A3A] to-primary">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Gradient Orbs */}
        <div className="absolute top-[15%] right-[5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(200,169,110,0.12),transparent_70%)] blur-[80px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(42,111,151,0.15),transparent_70%)] blur-[60px]" />

        {/* Content */}
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

          {/* Center Message */}
          <div className="max-w-[440px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-accent" />
              <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">
                Welcome Back
              </span>
            </div>
            <h1 className="font-serif text-[42px] font-bold text-white leading-[1.2] mb-5">
              건강한 일상의
              <br />
              시작,{" "}
              <span className="text-accent">MediBook</span>
            </h1>
            <p className="text-[16px] text-white/50 leading-[1.75] mb-10">
              실시간 예약과 스마트 대기열로 더 이상 병원에서
              <br />
              긴 시간을 기다리지 않아도 됩니다.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: <Shield size={18} />,
                  title: "보안 인증",
                  desc: "JWT + Spring Security 기반 안전한 인증",
                },
                {
                  icon: <Mail size={18} />,
                  title: "알림 연동",
                  desc: "로그인 시 예약 알림을 자동으로 수신",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/90">
                      {item.title}
                    </div>
                    <div className="text-xs text-white/40">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="text-xs text-white/25">
            © 2026 MediBook. Portfolio Project.
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL - Login Form ===== */}
      <div className="flex-1 flex items-center justify-center bg-[var(--bg)] px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
                <Heart size={18} />
              </div>
              <div className="font-serif text-lg font-bold text-primary-dark">
                MediBook
              </div>
            </Link>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-[28px] font-bold text-primary-dark mb-2">
              로그인
            </h2>
            <p className="text-sm text-[var(--text-light)]">
              계정에 로그인하여 예약을 관리하세요
            </p>
          </div>

          {/* Social Login */}
          <div className="flex gap-3 mb-6">
            {[
              {
                name: "카카오",
                bg: "#FEE500",
                color: "#191919",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919">
                    <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.724 1.8 5.113 4.508 6.459-.2.743-.723 2.693-.828 3.109-.13.516.189.51.398.371.164-.108 2.609-1.77 3.668-2.49.73.108 1.482.164 2.254.164 5.523 0 10-3.463 10-7.613C22 6.463 17.523 3 12 3z" />
                  </svg>
                ),
              },
              {
                name: "네이버",
                bg: "#03C75A",
                color: "#fff",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                    <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                  </svg>
                ),
              },
              {
                name: "Google",
                bg: "#fff",
                color: "#333",
                border: true,
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                ),
              },
            ].map((social) => (
              <button
                key={social.name}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: social.bg,
                  color: social.color,
                  border: social.border
                    ? "1.5px solid var(--border)"
                    : "none",
                }}
              >
                {social.icon}
                <span className="hidden sm:inline">{social.name}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-muted)] font-medium">
              또는 이메일로 로그인
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-primary-dark mb-2">
                이메일
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-[1.5px] transition-all duration-200 bg-white ${activeField === "email"
                  ? "border-primary shadow-[0_0_0_3px_rgba(27,77,110,0.08)]"
                  : "border-[var(--border)] hover:border-[var(--text-muted)]"
                  }`}
              >
                <div
                  className={`transition-colors ${activeField === "email"
                    ? "text-primary"
                    : "text-[var(--text-muted)]"
                    }`}
                >
                  <User />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  className="flex-1 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] bg-transparent outline-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[13px] font-semibold text-primary-dark">
                  비밀번호
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-accent font-semibold no-underline hover:text-primary transition-colors"
                >
                  비밀번호 찾기
                </Link>
              </div>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-[1.5px] transition-all duration-200 bg-white ${activeField === "password"
                  ? "border-primary shadow-[0_0_0_3px_rgba(27,77,110,0.08)]"
                  : "border-[var(--border)] hover:border-[var(--text-muted)]"
                  }`}
              >
                <div
                  className={`transition-colors ${activeField === "password"
                    ? "text-primary"
                    : "text-[var(--text-muted)]"
                    }`}
                >
                  <Lock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5 mb-7">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center cursor-pointer transition-all duration-200 ${rememberMe
                  ? "bg-primary border-primary"
                  : "bg-white border-[var(--border)]"
                  }`}
              >
                {rememberMe && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={3}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span className="text-[13px] text-[var(--text-light)] font-medium">
                로그인 상태 유지
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-500 text-[13px]">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full !py-3.5 !text-[15px] !rounded-xl relative overflow-hidden disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="3"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  로그인 중...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  로그인
                  <ChevronRight size={16} />
                </div>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--text-light)]">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold no-underline hover:text-accent transition-colors"
              >
                회원가입
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 rounded-xl bg-primary/[0.03] border border-primary/[0.08]">
            <div className="flex items-start gap-3">
              <div className="text-primary mt-0.5 flex-shrink-0">
                <Shield size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-primary-dark mb-1">
                  안전한 로그인
                </div>
                <p className="text-[11px] text-[var(--text-light)] leading-[1.6]">
                  모든 통신은 HTTPS로 암호화되며, 비밀번호는 BCrypt로
                  안전하게 저장됩니다. JWT 토큰 기반 인증으로 세션을
                  보호합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
