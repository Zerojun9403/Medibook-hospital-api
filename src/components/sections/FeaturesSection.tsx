"use client";

import { features } from "@/lib/constants";
import { IconMap } from "@/components/icons/Icons";

export default function FeaturesSection() {
  return (
    <section className="py-[120px] bg-bg">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-[72px]">
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <span className="text-xs font-semibold tracking-[0.15em] text-accent uppercase block mb-4">
            Core Features
          </span>
          <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] font-bold text-primary-dark mb-4">
            핵심 기능
          </h2>
          <p className="text-base text-[var(--text-light)] max-w-[560px] mx-auto leading-[1.7]">
            서울성모병원, 인천공항 FIDS, 우리투자증권의 실무 경험을 녹여낸
            기능들입니다.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const IconComponent = IconMap[f.iconName];
            return (
              <div
                key={i}
                className="hover-lift bg-bg-card rounded-2xl p-8 border border-[var(--border)] cursor-default relative overflow-hidden group"
              >
                {/* Top accent bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-primary/[0.08] to-accent/[0.08] flex items-center justify-center text-primary mb-5">
                  <IconComponent />
                </div>
                <h3 className="text-lg font-bold text-primary-dark mb-2.5">
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--text-light)] leading-[1.65] mb-4">
                  {f.desc}
                </p>
                <div className="text-xs text-accent font-semibold tracking-[0.02em] px-3.5 py-2 bg-accent/[0.08] rounded-lg inline-block">
                  {f.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
