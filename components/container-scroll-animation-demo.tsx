"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/42">
              Product preview
            </p>
            <h3 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
              See your dashboard in action
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#98a1b5] sm:text-base">
              A quick look at the workspace your team uses to generate, review,
              and publish content across every channel.
            </p>
            <span className="mt-6 inline-flex rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white/60">
              Built for focused publishing teams
            </span>
          </>
        }
        cardClassName="aspect-[2503/1321] h-auto border-[#7b7b7b] bg-[#2a2a2a] p-[14px] shadow-[0_28px_80px_rgba(15,23,42,0.22),0_18px_40px_rgba(15,23,42,0.12)] dark:border-[#7d7d7d] dark:bg-[#272727] dark:shadow-[0_28px_90px_rgba(0,0,0,0.5)] md:h-auto md:p-[18px]"
        frameClassName="rounded-[1.9rem] border-[10px] border-[#f3f4f6] bg-[#f8fafc] p-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:border-[#818181] dark:bg-[#232323] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:border-[14px] md:p-[18px]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.45rem] border border-[#d7dbe2] bg-[#111827] dark:border-[#2c2c2c] dark:bg-[#18181b]">
          <video
            src="/NewHomePageUpdate.mp4"
            aria-label="Post Genius dashboard preview"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover object-center"
            controls={false}
          />
        </div>
      </ContainerScroll>
    </div>
  );
}
