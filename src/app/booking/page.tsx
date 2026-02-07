"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, Calendar, Clock, ChevronRight, Shield } from "@/components/icons/Icons";
import { departments } from "@/lib/constants";

const allDoctors = [
    { id: 1, name: "김정현", dept: "내과", specialty: "소화기내과 전문의", rating: 4.9, reviews: 342, exp: "15년", img: "👨‍⚕️", availableTimes: ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"] },
    { id: 2, name: "이수민", dept: "소아과", specialty: "소아 알레르기 전문의", rating: 4.8, reviews: 287, exp: "12년", img: "👩‍⚕️", availableTimes: ["09:00", "10:00", "10:30", "11:00", "14:00", "15:00", "15:30"] },
    { id: 3, name: "박현우", dept: "정형외과", specialty: "스포츠 의학 전문의", rating: 4.9, reviews: 198, exp: "18년", img: "👨‍⚕️", availableTimes: ["09:30", "10:00", "11:00", "11:30", "14:00", "14:30", "16:00"] },
    { id: 4, name: "최은지", dept: "피부과", specialty: "미용 피부 전문의", rating: 4.7, reviews: 156, exp: "10년", img: "👩‍⚕️", availableTimes: ["10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00"] },
    { id: 5, name: "정민호", dept: "내과", specialty: "호흡기내과 전문의", rating: 4.8, reviews: 231, exp: "13년", img: "👨‍⚕️", availableTimes: ["09:00", "09:30", "10:30", "11:00", "14:30", "15:00", "15:30"] },
    { id: 6, name: "한서윤", dept: "안과", specialty: "망막 전문의", rating: 4.9, reviews: 178, exp: "16년", img: "👩‍⚕️", availableTimes: ["09:00", "10:00", "10:30", "14:00", "14:30", "15:00"] },
    { id: 7, name: "윤재호", dept: "치과", specialty: "교정 전문의", rating: 4.6, reviews: 203, exp: "11년", img: "👨‍⚕️", availableTimes: ["09:30", "10:00", "10:30", "11:00", "14:00", "15:00", "16:00"] },
    { id: 8, name: "강미래", dept: "산부인과", specialty: "산과 전문의", rating: 4.8, reviews: 145, exp: "14년", img: "👩‍⚕️", availableTimes: ["09:00", "10:00", "11:00", "14:00", "14:30", "15:30"] },
    { id: 9, name: "오성민", dept: "외과", specialty: "일반외과 전문의", rating: 4.7, reviews: 189, exp: "17년", img: "👨‍⚕️", availableTimes: ["09:00", "09:30", "10:00", "14:00", "15:00", "16:00"] },
];

const dayHeaders = ["일", "월", "화", "수", "목", "금", "토"];

function getCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= lastDate; d++) days.push(d);
    return days;
}

export default function BookingPage() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [selectedDept, setSelectedDept] = useState<string | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<typeof allDoctors[0] | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [symptom, setSymptom] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const today = new Date();
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth());

    const filteredDoctors = selectedDept ? allDoctors.filter((d) => d.dept === selectedDept) : allDoctors;
    const calendarDays = getCalendarDays(calYear, calMonth);

    const canGoPrev = calYear > today.getFullYear() || (calYear === today.getFullYear() && calMonth > today.getMonth());
    const canGoNext = calYear < today.getFullYear() + 1 || (calYear === today.getFullYear() + 1 && calMonth <= today.getMonth());
    const goNextMonth = () => { if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); } else setCalMonth(calMonth + 1); };
    const goPrevMonth = () => { if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); } else setCalMonth(calMonth - 1); };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);

        const deptParam = searchParams.get("dept");
        const doctorParam = searchParams.get("doctor");

        if (deptParam && doctorParam) {
            // dept + doctor → 바로 step 3 (날짜/시간)
            const foundDoctor = allDoctors.find((d) => d.name === doctorParam && d.dept === deptParam);
            if (foundDoctor) {
                setSelectedDept(deptParam);
                setSelectedDoctor(foundDoctor);
                setStep(3);
                return;
            }
        }
        if (deptParam) {
            // dept만 → step 2 (의료진 선택)
            const found = departments.find((d) => d.name === deptParam);
            if (found) {
                setSelectedDept(deptParam);
                setStep(2);
            }
        }
    }, [searchParams]);

    const handleSubmit = () => {
        if (!isLoggedIn) { alert("로그인이 필요합니다."); window.location.href = "/login"; return; }
        setIsSubmitting(true);
        setTimeout(() => { setIsSubmitting(false); setIsComplete(true); }, 1500);
    };

    // 예약 완료
    if (isComplete) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
                <div className="bg-white rounded-2xl p-10 border border-[var(--border)] text-center max-w-[480px] w-full animate-scaleIn">
                    <div className="w-16 h-16 rounded-full bg-[rgba(45,159,111,0.1)] flex items-center justify-center mx-auto mb-5">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d9f6f" strokeWidth={2.5}><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <h2 className="text-[24px] font-bold text-primary-dark mb-2">예약이 완료되었습니다!</h2>
                    <p className="text-[14px] text-[var(--text-light)] mb-6">확인 알림이 곧 발송됩니다</p>
                    <div className="bg-[var(--bg)] rounded-xl p-5 mb-6 text-left">
                        <div className="flex flex-col gap-2.5">
                            {[
                                ["진료과", selectedDept],
                                ["담당의", `${selectedDoctor?.name} 전문의`],
                                ["날짜", selectedDate?.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" })],
                                ["시간", selectedTime],
                            ].map(([l, v], i) => (
                                <div key={i} className="flex justify-between text-[13px]">
                                    <span className="text-[var(--text-muted)]">{l}</span>
                                    <span className="font-semibold text-primary-dark">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/patient/dashboard" className="btn-outline flex-1 !py-3 !text-[13px] no-underline text-center">대시보드로</Link>
                        <Link href="/" className="btn-primary flex-1 !py-3 !text-[13px] no-underline text-center">홈으로</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            {/* Header */}
            <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
                <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[64px]">
                    <Link href="/" className="flex items-center gap-2.5 no-underline">
                        <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white"><Heart size={16} /></div>
                        <div className="font-serif text-lg font-bold text-primary-dark leading-tight">MediBook</div>
                    </Link>
                    <Link href="/" className="text-[13px] text-[var(--text-muted)] no-underline hover:text-primary transition-colors">← 홈으로</Link>
                </div>
            </header>

            <div className="max-w-[1200px] mx-auto px-6 py-8">
                {/* Title */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="gold-line" />
                        <span className="text-accent text-[12px] font-semibold tracking-[0.15em] uppercase">Online Reservation</span>
                    </div>
                    <h1 className="text-[28px] font-bold text-primary-dark">온라인 예약</h1>
                </div>

                {/* Step Progress */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                    {["진료과 선택", "의료진 선택", "날짜 / 시간", "증상 입력", "예약 확인"].map((label, i) => {
                        const sn = i + 1; const isActive = step === sn; const isDone = step > sn;
                        return (
                            <div key={i} className="flex items-center gap-2 flex-shrink-0">
                                {i > 0 && <div className={`w-6 h-[2px] ${isDone ? "bg-accent" : "bg-[var(--border)]"}`} />}
                                <button onClick={() => isDone && setStep(sn)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all border-none cursor-pointer ${isActive ? "bg-primary text-white" : isDone ? "bg-accent/10 text-accent" : "bg-[var(--bg)] text-[var(--text-muted)]"}`}>
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : isDone ? "bg-accent text-white" : "bg-[var(--border)] text-[var(--text-muted)]"}`}>{isDone ? "✓" : sn}</span>
                                    <span className="hidden sm:inline">{label}</span>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Step 1: Department */}
                {step === 1 && (
                    <div className="animate-fadeIn">
                        <h2 className="text-[18px] font-bold text-primary-dark mb-2">진료과를 선택하세요</h2>
                        <p className="text-[13px] text-[var(--text-light)] mb-6">어떤 진료를 받고 싶으신가요?</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {departments.map((dept, i) => (
                                <button key={i} onClick={() => { setSelectedDept(dept.name); setSelectedDoctor(null); setSelectedDate(null); setSelectedTime(null); setStep(2); }}
                                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 cursor-pointer transition-all bg-white text-center hover:-translate-y-1 hover:shadow-lg ${selectedDept === dept.name ? "border-primary bg-primary/[0.02]" : "border-[var(--border)] hover:border-primary/30"}`}>
                                    <span className="text-4xl">{dept.icon}</span>
                                    <div>
                                        <div className="text-[14px] font-bold text-primary-dark">{dept.name}</div>
                                        <div className="text-[11px] text-[var(--text-muted)] mt-1">{dept.desc}</div>
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] text-[var(--text-light)]">
                                        <span>전문의 {dept.doctors}명</span><span>·</span><span>대기 {dept.wait}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Doctor */}
                {step === 2 && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-[18px] font-bold text-primary-dark mb-1">의료진을 선택하세요</h2>
                                <p className="text-[13px] text-[var(--text-light)]"><span className="text-accent font-semibold">{selectedDept}</span> 전문 의료진</p>
                            </div>
                            <button onClick={() => setStep(1)} className="text-[12px] text-[var(--text-muted)] hover:text-primary bg-transparent border-none cursor-pointer">← 진료과 변경</button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {filteredDoctors.map((doctor) => (
                                <button key={doctor.id} onClick={() => { setSelectedDoctor(doctor); setSelectedDate(null); setSelectedTime(null); setStep(3); }}
                                    className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all bg-white text-left hover:shadow-md w-full ${selectedDoctor?.id === doctor.id ? "border-primary" : "border-[var(--border)] hover:border-primary/30"}`}>
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/[0.06] to-accent/[0.06] flex items-center justify-center text-3xl flex-shrink-0">{doctor.img}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[15px] font-bold text-primary-dark">{doctor.name}</span>
                                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/[0.06] text-primary font-semibold">{doctor.dept}</span>
                                        </div>
                                        <div className="text-[12px] text-[var(--text-light)] mb-2">{doctor.specialty} · 경력 {doctor.exp}</div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-accent text-[12px]">★</span>
                                            <span className="text-[12px] font-bold text-primary-dark">{doctor.rating}</span>
                                            <span className="text-[11px] text-[var(--text-muted)]">리뷰 {doctor.reviews}개</span>
                                            <span className="text-[11px] text-[var(--text-muted)]">·</span>
                                            <span className="text-[11px] text-[var(--success)] font-semibold">예약 가능</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-[var(--text-muted)]" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Calendar + Time */}
                {step === 3 && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-[18px] font-bold text-primary-dark mb-1">날짜와 시간을 선택하세요</h2>
                                <p className="text-[13px] text-[var(--text-light)]"><span className="text-accent font-semibold">{selectedDoctor?.name}</span> 전문의 · {selectedDept}</p>
                            </div>
                            <button onClick={() => setStep(2)} className="text-[12px] text-[var(--text-muted)] hover:text-primary bg-transparent border-none cursor-pointer">← 의료진 변경</button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {/* Monthly Calendar */}
                            <div className="lg:col-span-3 bg-white rounded-2xl border border-[var(--border)] p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <button onClick={goPrevMonth} disabled={!canGoPrev}
                                        className={`w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center bg-transparent cursor-pointer transition-all ${canGoPrev ? "hover:bg-primary/[0.04] text-primary-dark" : "text-[var(--border)] cursor-not-allowed"}`}>‹</button>
                                    <h3 className="text-[16px] font-bold text-primary-dark">{calYear}년 {calMonth + 1}월</h3>
                                    <button onClick={goNextMonth} disabled={!canGoNext}
                                        className={`w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center bg-transparent cursor-pointer transition-all ${canGoNext ? "hover:bg-primary/[0.04] text-primary-dark" : "text-[var(--border)] cursor-not-allowed"}`}>›</button>
                                </div>

                                <div className="grid grid-cols-7 mb-2">
                                    {dayHeaders.map((d, i) => (
                                        <div key={d} className={`text-center text-[11px] font-semibold py-2 ${i === 0 ? "text-[#ef4444]" : i === 6 ? "text-[#3b82f6]" : "text-[var(--text-muted)]"}`}>{d}</div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {calendarDays.map((day, i) => {
                                        if (day === null) return <div key={`e${i}`} />;
                                        const date = new Date(calYear, calMonth, day);
                                        const isSunday = date.getDay() === 0;
                                        const isSaturday = date.getDay() === 6;
                                        const isPast = date <= today && date.toDateString() !== today.toDateString();
                                        const isToday = date.toDateString() === today.toDateString();
                                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                                        const isDisabled = isPast || isSunday || isToday;

                                        return (
                                            <button key={`d${day}`} disabled={isDisabled} onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                                                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-[14px] font-semibold transition-all border-2 ${isSelected ? "bg-primary border-primary text-white"
                                                        : isDisabled ? "bg-transparent border-transparent text-[var(--border)] cursor-not-allowed"
                                                            : "bg-transparent border-transparent hover:bg-primary/[0.04] hover:border-primary/20 cursor-pointer"
                                                    } ${!isSelected && !isDisabled && isSaturday ? "text-[#3b82f6]" : ""} ${!isSelected && !isDisabled && !isSaturday ? "text-primary-dark" : ""}`}>
                                                {day}
                                                {isToday && <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-accent"}`} />}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border)]">
                                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]"><div className="w-2 h-2 rounded-full bg-accent" /> 오늘</div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]"><div className="w-3 h-3 rounded bg-primary" /> 선택됨</div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]"><span className="text-[var(--border)]">●</span> 예약 불가</div>
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--border)] p-6">
                                <h3 className="text-[14px] font-bold text-primary-dark mb-2 flex items-center gap-2"><Clock size={16} /> 시간 선택</h3>
                                {selectedDate ? (
                                    <div>
                                        <p className="text-[12px] text-accent font-semibold mb-5">
                                            {selectedDate.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}
                                        </p>
                                        <div className="mb-5">
                                            <div className="text-[11px] text-[var(--text-muted)] font-semibold mb-2 uppercase tracking-wide">오전</div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {selectedDoctor?.availableTimes.filter((t) => parseInt(t) < 12).map((time) => (
                                                    <button key={time} onClick={() => setSelectedTime(time)}
                                                        className={`py-3 rounded-lg text-[13px] font-semibold cursor-pointer transition-all border-2 ${selectedTime === time ? "border-primary bg-primary text-white" : "border-[var(--border)] bg-[var(--bg)] text-primary-dark hover:border-primary/30"}`}>{time}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] text-[var(--text-muted)] font-semibold mb-2 uppercase tracking-wide">오후</div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {selectedDoctor?.availableTimes.filter((t) => parseInt(t) >= 12).map((time) => (
                                                    <button key={time} onClick={() => setSelectedTime(time)}
                                                        className={`py-3 rounded-lg text-[13px] font-semibold cursor-pointer transition-all border-2 ${selectedTime === time ? "border-primary bg-primary text-white" : "border-[var(--border)] bg-[var(--bg)] text-primary-dark hover:border-primary/30"}`}>{time}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-60 text-[var(--text-muted)] text-[13px]">달력에서 날짜를 선택해주세요</div>
                                )}
                            </div>
                        </div>

                        {selectedDate && selectedTime && (
                            <div className="mt-6 flex justify-end">
                                <button onClick={() => setStep(4)} className="btn-primary !py-3 !px-8 !text-[14px]">다음 단계 →</button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Symptom */}
                {step === 4 && (
                    <div className="animate-fadeIn max-w-[640px]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-[18px] font-bold text-primary-dark mb-1">증상을 입력해주세요</h2>
                                <p className="text-[13px] text-[var(--text-light)]">사전 정보를 입력하면 더 빠른 진료가 가능합니다</p>
                            </div>
                            <button onClick={() => setStep(3)} className="text-[12px] text-[var(--text-muted)] hover:text-primary bg-transparent border-none cursor-pointer">← 시간 변경</button>
                        </div>
                        <div className="bg-white rounded-2xl border border-[var(--border)] p-6 mb-6">
                            <label className="block text-[13px] font-semibold text-primary-dark mb-3">증상 및 메모 (선택)</label>
                            <textarea value={symptom} onChange={(e) => setSymptom(e.target.value)} placeholder="예: 3일 전부터 두통이 있고, 열이 37.5도 정도 됩니다..."
                                className="w-full h-32 px-4 py-3 rounded-xl border-[1.5px] border-[var(--border)] text-[13px] outline-none focus:border-primary transition-all resize-none leading-[1.7] bg-[var(--bg)]" />
                            <div className="text-[11px] text-[var(--text-muted)] mt-2 text-right">{symptom.length}/500자</div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setStep(3)} className="btn-outline !py-3 !px-6 !text-[13px]">이전</button>
                            <button onClick={() => setStep(5)} className="btn-primary flex-1 !py-3 !text-[14px]">예약 확인 →</button>
                        </div>
                    </div>
                )}

                {/* Step 5: Confirm */}
                {step === 5 && (
                    <div className="animate-fadeIn max-w-[640px]">
                        <h2 className="text-[18px] font-bold text-primary-dark mb-6">예약 정보를 확인해주세요</h2>
                        <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden mb-6">
                            <div className="p-6 border-b border-[var(--border)]">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/[0.06] to-accent/[0.06] flex items-center justify-center text-3xl">{selectedDoctor?.img}</div>
                                    <div>
                                        <div className="text-[16px] font-bold text-primary-dark">{selectedDoctor?.name} 전문의</div>
                                        <div className="text-[12px] text-[var(--text-light)]">{selectedDept} · {selectedDoctor?.specialty}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-4">
                                    {[
                                        { label: "진료과", value: selectedDept, icon: "🏥" },
                                        { label: "날짜", value: selectedDate?.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }), icon: "📅" },
                                        { label: "시간", value: selectedTime, icon: "⏰" },
                                        { label: "증상", value: symptom || "입력하지 않음", icon: "📝" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="text-lg">{item.icon}</span>
                                            <div>
                                                <div className="text-[11px] text-[var(--text-muted)] mb-0.5">{item.label}</div>
                                                <div className="text-[13px] font-semibold text-primary-dark">{item.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mx-6 mb-6 p-4 rounded-xl bg-primary/[0.03] border border-primary/[0.08]">
                                <div className="flex items-start gap-3">
                                    <Shield size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <div className="text-[12px] font-semibold text-primary-dark mb-1">예약 안내</div>
                                        <p className="text-[11px] text-[var(--text-light)] leading-[1.6]">예약 확정 후 변경 및 취소는 진료 24시간 전까지 가능합니다. 예약 시간 10분 전까지 도착해주세요.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setStep(4)} className="btn-outline !py-3 !px-6 !text-[13px]">이전</button>
                            <button onClick={handleSubmit} disabled={isSubmitting} className="btn-accent flex-1 !py-3.5 !text-[14px] !font-bold disabled:opacity-60">
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(15,45,66,0.2)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#0f2d42" strokeWidth="3" strokeLinecap="round" /></svg>
                                        예약 처리 중...
                                    </span>
                                ) : "예약 확정하기"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
