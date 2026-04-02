"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Clock3, MessageCircleWarning, Zap } from "lucide-react";

const cards = [
  {
    number: "01",
    title: "Writing Hours",
    description:
      "Rewriting the same idea for every channel slows momentum and kills consistency.",
    accent: "#6366f1",
    icon: Clock3,
  },
  {
    number: "02",
    title: "Inconsistent Tone",
    description:
      "One post sounds sharp, the next sounds off. Brand trust drops when voice keeps changing.",
    accent: "#ec4899",
    icon: MessageCircleWarning,
  },
  {
    number: "03",
    title: "Algorithm Fatigue",
    description:
      "Every platform rewards different structure, hooks, and formatting. Manual work does not scale.",
    accent: "#14b8a6",
    icon: Zap,
  },
];

type CardVars = CSSProperties & {
  "--accent": string;
  "--accent-9": string;
  "--accent-10": string;
  "--accent-12": string;
  "--accent-13": string;
  "--accent-20": string;
  "--accent-25": string;
  "--accent-55": string;
};

type CardState = {
  isActive: boolean;
  spotlightX: number;
  spotlightY: number;
  rotateX: number;
  rotateY: number;
};

function hexToRgba(hex: string, alpha: number) {
  const cleaned = hex.replace("#", "");
  const value = Number.parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function BrokenCard({
  accent,
  description,
  icon: Icon,
  number,
  title,
}: {
  accent: string;
  description: string;
  icon: LucideIcon;
  number: string;
  title: string;
}) {
  const [state, setState] = useState<CardState>({
    isActive: false,
    spotlightX: 0,
    spotlightY: 0,
    rotateX: 0,
    rotateY: 0,
  });

  const style = {
    "--accent": accent,
    "--accent-9": hexToRgba(accent, 0.09),
    "--accent-10": hexToRgba(accent, 0.1),
    "--accent-12": hexToRgba(accent, 0.12),
    "--accent-13": hexToRgba(accent, 0.13),
    "--accent-20": hexToRgba(accent, 0.2),
    "--accent-25": hexToRgba(accent, 0.25),
    "--accent-55": hexToRgba(accent, 0.55),
    transform: `perspective(800px) rotateX(${state.rotateX}deg) rotateY(${state.rotateY}deg) translateY(${state.isActive ? "-4px" : "0px"})`,
    transition: state.isActive
      ? "transform 0.05s ease, box-shadow 0.3s ease, border-color 0.3s ease"
      : "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, border-color 0.3s ease",
  } as CardVars;

  const lightBackgroundImage = `linear-gradient(180deg, rgba(255,255,255,0.98), rgba(243,247,255,0.94)), radial-gradient(circle at ${state.spotlightX}px ${state.spotlightY}px, ${hexToRgba(accent, 0.55)}, ${hexToRgba(accent, 0.1)} 50%, transparent 70%)`;
  const darkBackgroundImage = `linear-gradient(180deg, rgba(12,12,23,0.98), rgba(8,8,18,0.96)), radial-gradient(circle at ${state.spotlightX}px ${state.spotlightY}px, ${hexToRgba(accent, 0.55)}, ${hexToRgba(accent, 0.1)} 50%, transparent 70%)`;

  const spotlightStyle = {
    left: state.spotlightX,
    top: state.spotlightY,
    background: "radial-gradient(circle, var(--accent-13) 0%, transparent 70%)",
  } as CSSProperties;

  const borderGlowStyle = {
    opacity: state.isActive ? 1 : 0,
    backgroundImage: `radial-gradient(circle at ${state.spotlightX}px ${state.spotlightY}px, ${hexToRgba(accent, 0.55)}, ${hexToRgba(accent, 0.1)} 50%, transparent 70%)`,
    transition: "opacity 0.3s ease",
    padding: "1px",
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
  } as CSSProperties;

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = (x - rect.width / 2) / (rect.width / 2);
    const dy = (y - rect.height / 2) / (rect.height / 2);

    setState({
      isActive: true,
      spotlightX: x,
      spotlightY: y,
      rotateX: -dy * 5,
      rotateY: dx * 5,
    });
  };

  const handleLeave = () => {
    setState((current) => ({
      ...current,
      isActive: false,
      rotateX: 0,
      rotateY: 0,
    }));
  };

  return (
    <article
      className="group relative rounded-[1.75rem]"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ perspective: "800px" }}
    >
      <div
        className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,247,255,0.94))] p-6 shadow-[0_14px_40px_rgba(15,23,42,0.08)] will-change-transform dark:border-white/[0.07] dark:shadow-[0_18px_48px_rgba(0,0,0,0.28)] sm:p-7"
        style={style}
      >
        <div className="absolute inset-0 dark:hidden" style={{ backgroundImage: lightBackgroundImage }} />
        <div className="absolute inset-0 hidden dark:block" style={{ backgroundImage: darkBackgroundImage }} />

        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[1.75rem]"
          style={borderGlowStyle}
        />

        <div
          className="pointer-events-none absolute z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={spotlightStyle}
        />

        <div className="relative z-20">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 transition-all duration-300 dark:border-white/10 dark:bg-white/[0.04]"
            style={{
              borderColor: state.isActive ? hexToRgba(accent, 0.25) : undefined,
              backgroundColor: state.isActive ? hexToRgba(accent, 0.12) : undefined,
              boxShadow: state.isActive
                ? `0 0 20px ${hexToRgba(accent, 0.2)}`
                : undefined,
            }}
          >
            <Icon
              className="h-5 w-5 text-slate-500 transition-colors duration-300 dark:text-white/70"
              style={{ color: state.isActive ? accent : undefined }}
            />
          </div>

          <h3 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">
            {title}
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600 dark:text-[#98a1b5] sm:text-[15px]">
            {description}
          </p>
        </div>

        <div
          className="pointer-events-none absolute bottom-2 right-4 z-10 text-[84px] font-black leading-none tracking-[-0.08em] text-slate-950/[0.03] transition-colors duration-300 sm:text-[110px] dark:text-white/[0.03]"
          style={{ color: state.isActive ? hexToRgba(accent, 0.09) : undefined }}
        >
          {number}
        </div>
      </div>
    </article>
  );
}

export function BrokenSection() {
  return (
    <section className="border-t border-slate-200 bg-[#f4f7fc] dark:border-white/6 dark:bg-[#06070d]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-white/42">
            Why creators switch
          </p>
          <h2
            className="mt-4 text-4xl font-black uppercase leading-[0.88] tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-[4.25rem] dark:text-white"
            style={{ fontFamily: '"Barlow Condensed", "Bebas Neue", sans-serif' }}
          >
            THE OLD WAY IS BROKEN
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#98a1b5] sm:text-base">
            The old content workflow burns time, blurs your voice, and makes every
            channel feel heavier than it should.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <BrokenCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
