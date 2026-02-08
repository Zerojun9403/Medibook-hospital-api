"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "@/components/icons/Icons";
import { useAuth } from "@/hooks/useAuth";
import { authAPI } from "@/lib/api";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/booking", label: "예약하기" },
  { href: "/departments", label: "진료과" },
  { href: "/doctors", label: "의료진" },
  { href: "/mypage", label: "마이페이지" },
  { href: "/about", label: "병원소개" },
  { href: "/location", label: "찾아오시는길" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoggedIn, isDoctor } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[rgba(250,250,248,0.92)] backdrop-blur-xl border-b border-[var(--border)]"
        : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="section-container flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
            <Heart size={20} />
          </div>
          <div>
            <div className="font-serif text-xl font-bold text-primary-dark leading-tight">
              MediBook
            </div>
            <div className="text-[10px] text-accent font-semibold tracking-[0.12em]">
              PREMIUM HEALTHCARE
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[var(--text-light)] no-underline text-sm font-medium px-4 py-2 rounded-md hover:text-primary hover:bg-[rgba(27,77,110,0.06)] transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          {isLoggedIn ? (
            <>
              <Link
                href={isDoctor ? "/doctor/dashboard" : "/patient/dashboard"}
                className="text-primary no-underline text-sm font-semibold px-4 py-2 rounded-md hover:text-accent transition-all"
              >
                {user?.name}님
              </Link>
              <button
                onClick={() => authAPI.logout()}
                className="btn-outline !px-5 !py-2 !text-[13px]"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[var(--text-light)] no-underline text-sm font-medium px-4 py-2 rounded-md hover:text-primary transition-all"
              >
                로그인
              </Link>
              <Link href="/register" className="btn-primary !px-6 !py-2.5 !text-[13px]">
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-primary-dark bg-transparent border-none cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[var(--border)] animate-fadeIn">
          <div className="section-container py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--text)] no-underline text-sm font-medium px-4 py-3 rounded-lg hover:bg-[rgba(27,77,110,0.06)] transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-[var(--border)] mt-2 pt-3 flex gap-3">
              {isLoggedIn ? (
                <>
                  <Link href={isDoctor ? "/doctor/dashboard" : "/patient/dashboard"} className="btn-outline flex-1 !py-2.5 !text-[13px] text-center">
                    {user?.name}님
                  </Link>
                  <button onClick={() => authAPI.logout()} className="btn-primary flex-1 !py-2.5 !text-[13px]">
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-outline flex-1 !py-2.5 !text-[13px] text-center">
                    로그인
                  </Link>
                  <Link href="/register" className="btn-primary flex-1 !py-2.5 !text-[13px] text-center">
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
