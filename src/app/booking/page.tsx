"use client";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, Calendar, Clock, ChevronRight, Shield } from "@/components/icons/Icons";
import { departmentAPI, doctorAPI, reservationAPI } from "@/lib/api";
import { departments as fallbackDepts } from "@/lib/constants";

interface Department {
    id: number;
    name: string;
    description: string;
    icon: string;
}

interface Doctor {
    id: number;
    name: string;
    departmentId: number;
    departmentName: string;
    specialty: string;
    rating: number;
    reviewCount: number;
    experienceYears: number;
    available: boolean;
}

const dayHeaders = ["일", "월", "화", "수", "목", "금", "토"];

function getCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= lastDate; d++) days.push(d);
    return days;
}

function BookingContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedDept, setSelectedDept] = useState<string | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [symptom, setSymptom] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [reservationResult, setReservationResult] = useState<any>(null);

    const today = new Date();
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth());

    const filteredDoctors = selectedDept
        ? doctors.filter((d) => d.departmentName === selectedDept)
        : doctors;
    const calendarDays = getCalendarDays(calYear, calMonth);

    const canGoPrev =
        calYear > today.getFullYear() ||
        (calYear === today.getFullYear() && calMonth > today.getMonth());
    const canGoNext =
        calYear < today.getFullYear() + 1 ||
        (calYear === today.getFullYear() + 1 && calMonth <= today.getMonth());
    const goNextMonth = () => {
        if (calMonth === 11) {
            setCalYear(calYear + 1);
            setCalMonth(0);
        } else setCalMonth(calMonth + 1);
    };
    const goPrevMonth = () => {
        if (calMonth === 0) {
            setCalYear(calYear - 1);
            setCalMonth(11);
        } else setCalMonth(calMonth - 1);
    };

    const doctorEmoji = (doctor: Doctor) => {
        const femaleNames = ["이수민", "최은지", "한서윤", "강미래"];
        return femaleNames.includes(doctor.name) ? "👩‍⚕️" : "👨‍⚕️";
    };

    // 진료과 로드
    useEffect(() => {
        departmentAPI
            .getAll()
            .then((data) => setDepartments(data))
            .catch(() => {
                setDepartments(
                    fallbackDepts.map((d, i) => ({
                        id: i + 1,
                        name: d.name,
                        description: d.desc,
                        icon: d.icon,
                    }))
                );
            });
    }, []);

    // 의사 로드
    useEffect(() => {
        doctorAPI
            .getAll()
            .then((data) => setDoctors(data))
            .catch(() => setDoctors([]));
    }, []);

    // 로그인 체크 + URL 파라미터 처리
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);

        const deptParam = searchParams.get("dept");
        const doctorParam = searchParams.get("doctor");

        if (deptParam && doctorParam && doctors.length > 0) {
            const foundDoctor = doctors.find(
                (d) => d.name === doctorParam && d.departmentName === deptParam
            );
            if (foundDoctor) {
                setSelectedDept(deptParam);
                setSelectedDoctor(foundDoctor);
                setStep(3);
                return;
            }
        }
        if (deptParam && departments.length > 0) {
            const found = departments.find((d) => d.name === deptParam);
            if (found) {
                setSelectedDept(deptParam);
                setStep(2);
            }
        }
    }, [searchParams, doctors, departments]);

    // 날짜 선택 시 예약 가능 시간 조회
    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            const dateStr = selectedDate.toISOString().split("T")[0];
            reservationAPI
                .getAvailableSlots(selectedDoctor.id, dateStr)
                .then((slots) => setAvailableSlots(slots))
                .catch(() =>
                    setAvailableSlots([
                        "09:00", "09:30", "10:00", "10:30", "11:00",
                        "14:00", "14:30", "15:00", "15:30", "16:00",
                    ])
                );
        }
    }, [selectedDoctor, selectedDate]);

    const handleSubmit = async () => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            window.location.href = "/login";
            return;
        }
        if (!selectedDoctor || !selectedDate || !selectedTime) return;

        setIsSubmitting(true);
        try {
            const dateStr = selectedDate.toISOString().split("T")[0];
            const result = await reservationAPI.create({
                doctorId: selectedDoctor.id,
                reservationDate: dateStr,
                reservationTime: selectedTime,
                symptom: symptom || undefined,
            });
            setReservationResult(result);
            setIsComplete(true);
        } catch (error: any) {
            alert(error.message || "예약에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
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
                    <p className="text-[14px] text-[var(--text-light)] mb-1">확인 알림이 곧 발송됩니다</p>
                    {reservationResult && (
                        <p className="text-[12px] text-accent font-semibold mb-6">
                            예약코드: {reservationResult.reservationCode}
                        </p>
                    )}
                    <div className="bg-[var(--bg)] rounded-xl p-5 mb-6 text-left">
                        <div className="flex flex-col gap-2.5">
                            {[
                                ["진료과", selectedDept],
                                ["담당의", `${selectedDoctor?.name} 전문의`],
                                [
                                    "날짜",
                                    selectedDate?.toLocaleDateString("ko-KR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        weekday: "short",
                                    }),
                                ],
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
                        const sn = i + 1;
                        const isActive = step === sn;
                        const isDone = step > sn;
                        return (
                            <div key={i} className="flex items-center gap-2 flex-shrink-0">
                                {i > 0 && <div className={`w-6 h-[2px] ${isDone ? "bg-accent" : "bg-[var(--border)]"}`} />}
                                <button
                                    onClick={() => isDone && setStep(sn)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all border-none cursor-pointer ${isActive ? "bg-primary text-white" : isDone ? "bg-accent/10 text-accent" : "bg-[var(--bg)] text-[var(--text-muted)]"}`}
                                >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : isDone ? "bg-accent text-white" : "bg-[var(--border)] text-[var(--text-muted)]"}`}>
                                        {isDone ? "✓" : sn}
                                    </span>
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
                            {departments.map((dept) => (
                                <button
                                    key={dept.id}
                                    onClick={() => {
                                        setSelectedDept(dept.name);
                                        setSelectedDoctor(null);
                                        setSelectedDate(null);
                                        setSelectedTime(null);
                                        setStep(2);
                                    }}
                                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 cursor-pointer transition-all bg-white text-center hover:-translate-y-1 hover:shadow-lg ${selectedDept === dept.name ? "border-primary bg-primary/[0.02]" : "border-[var(--border)] hover:border-primary/30"}`}
                                >
                                    <span className="text-4xl">{dept.icon}</span>
                                    <div>
                                        <div className="text-[14px] font-bold text-primary-dark">{dept.name}</div>
                                        <div className="text-[11px] text-[var(--text-muted)] mt-1">{dept.description}</div>
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
                                <p className="text-[13px] text-[var(--text-light)]">
                                    <span className="text-accent font-semibold">{selectedDept}</span> 전문 의료진
                                </p>
                            </div>
                            <button onClick={() => setStep(1)} className="text-[12px] text-[var(--text-muted)] hover:text-primary bg-transparent border-none cursor-pointer">← 진료과 변경</button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {filteredDoctors.map((doctor) => (
                                <button
                                    key={doctor.id}
                                    onClick={() => {
                                        setSelectedDoctor(doctor);
                                        setSelectedDate(null);
                                        setSelectedTime(null);
                                        setStep(3);
                                    }}
                                    className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all bg-white text-left hover:shadow-md w-full ${selectedDoctor?.id === doctor.id ? "border-primary" : "border-[var(--border)] hover:border-primary/30"}`}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/[0.06] to-accent/[0.06] flex items-center justify-center text-3xl flex-shrink-0">
                                        {doctorEmoji(doctor)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[15px] font-bold text-primary-dark">{doctor.name}</span>
                                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/[0.06] text-primary font-semibold">{doctor.departmentName}</span>
                                        </div>
                                        <div className="text-[12px] text-[var(--text-light)] mb-2">
                                            {doctor.specialty} · 경력 {doctor.experienceYears}년
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-accent text-[12px]">★</span>
                                            <span className="text-[12px] font-bold text-primary-dark">{doctor.rating}</span>
                                            <span className="text-[11px] text-[var(--text-muted)]">리뷰 {doctor.reviewCount}개</span>
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
                                <p className="text-[13px] text-[var(--text-light)]">
                                    <span className="text-accent font-semibold">{selectedDoctor?.name}</span> 전문의 · {selectedDept}
                                </p>
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
                                            <button
                                                key={`d${day}`}
                                                disabled={isDisabled}
                                                onClick={() => {
                                                    setSelectedDate(date);
                                                    setSelectedTime(null);
                                                }}
                                                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-[14px] font-semibold transition-all border-2 ${isSelected
                                                    ? "bg-primary border-primary text-white"
                                                    : isDisabled
                                                        ? "bg-transparent border-transparent text-[var(--border)] cursor-not-allowed"
                                                        : "bg-transparent border-transparent hover:bg-primary/[0.04] hover:border-primary/20 cursor-pointer"
                                                    } ${!isSelected && !isDisabled && isSaturday ? "text-[#3b82f6]" : ""} ${!isSelected && !isDisabled && !isSaturday ? "text-primary-dark" : ""}`}
                                            >
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
                                        {availableSlots.length > 0 ? (
                                            <>
                                                <div className="mb-5">
                                                    <div className="text-[11px] text-[var(--text-muted)] font-semibold mb-2 uppercase tracking-wide">오전</div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {availableSlots.filter((t) => parseInt(t) < 12).map((time) => (
                                                            <button key={time} onClick={() => setSelectedTime(time)}
                                                                className={`py-3 rounded-lg text-[13px] font-semibold cursor-pointer transition-all border-2 ${selectedTime === time ? "border-primary bg-primary text-white" : "border-[var(--border)] bg-[var(--bg)] text-primary-dark hover:border-primary/30"}`}>
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] text-[var(--text-muted)] font-semibold mb-2 uppercase tracking-wide">오후</div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {availableSlots.filter((t) => parseInt(t) >= 12).map((time) => (
                                                            <button key={time} onClick={() => setSelectedTime(time)}
                                                                className={`py-3 rounded-lg text-[13px] font-semibold cursor-pointer transition-all border-2 ${selectedTime === time ? "border-primary bg-primary text-white" : "border-[var(--border)] bg-[var(--bg)] text-primary-dark hover:border-primary/30"}`}>
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center h-40 text-[var(--text-muted)] text-[13px]">
                                                예약 가능한 시간이 없습니다
                                            </div>
                                        )}
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
                            <textarea
                                value={symptom}
                                onChange={(e) => setSymptom(e.target.value)}
                                placeholder="예: 3일 전부터 두통이 있고, 열이 37.5도 정도 됩니다..."
                                className="w-full h-32 px-4 py-3 rounded-xl border-[1.5px] border-[var(--border)] text-[13px] outline-none focus:border-primary transition-all resize-none leading-[1.7] bg-[var(--bg)]"
                            />
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
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/[0.06] to-accent/[0.06] flex items-center justify-center text-3xl">
                                        {selectedDoctor && doctorEmoji(selectedDoctor)}
                                    </div>
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
                                        {
                                            label: "날짜",
                                            value: selectedDate?.toLocaleDateString("ko-KR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                weekday: "long",
                                            }),
                                            icon: "📅",
                                        },
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
export default function BookingPage() {
    return (
        <Suspense fallback={<div>로딩중...</div>}>
            <BookingContent />
        </Suspense>
    );
}