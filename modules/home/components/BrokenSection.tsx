"use client";

import type { ReactNode } from "react";
import {
  AlarmClock,
  Blocks,
  MessageCircleWarning,
  Sparkles,
  Zap,
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const painPoints = [
  {
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
    icon: <AlarmClock className="h-4 w-4 text-slate-900 dark:text-neutral-300" />,
    title: "One Idea, Four Rewrites",
    description:
      "Without PostBloom, one rough thought gets rewritten again for LinkedIn, X, Instagram, and Peerlist.",
  },
  {
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
    icon: <MessageCircleWarning className="h-4 w-4 text-slate-900 dark:text-neutral-300" />,
    title: "Your Voice Starts Drifting",
    description:
      "Writing every version from scratch makes your tone feel sharp on one platform and off on the next.",
  },
  {
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
    icon: <Blocks className="h-4 w-4 text-slate-900 dark:text-neutral-300" />,
    title: "Every Platform Wants Its Own Format",
    description:
      "LinkedIn, X, Instagram, and Peerlist all need different structure, pacing, and formatting.",
  },
  {
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
    icon: <Sparkles className="h-4 w-4 text-slate-900 dark:text-neutral-300" />,
    title: "Creative Energy Goes Into Cleanup",
    description:
      "Instead of finding better ideas, you waste time fixing hooks, spacing, CTAs, and tone.",
  },
  {
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]",
    icon: <Zap className="h-4 w-4 text-slate-900 dark:text-neutral-300" />,
    title: "Consistent Posting Stops Scaling",
    description:
      "Trying to stay active on all four platforms turns content creation into repetitive manual work.",
  },
];

interface GridItemProps {
  area: string;
  icon: ReactNode;
  title: string;
  description: ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[15rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-slate-200/80 bg-white/60 p-2 md:rounded-3xl md:p-3 dark:border-white/10 dark:bg-white/[0.03]">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,247,255,0.94))] p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] md:p-6 dark:bg-[linear-gradient(180deg,rgba(14,17,28,0.98),rgba(8,10,18,0.96))] dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.45)]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-slate-300 bg-white/80 p-2 dark:border-white/10 dark:bg-white/[0.04]">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-lg/[1.3rem] font-semibold text-balance text-slate-950 md:text-[1.45rem]/[1.7rem] dark:text-white">
                {title}
              </h3>
              <h2 className="text-sm/[1.45rem] text-slate-600 md:text-[15px]/[1.55rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

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
            PostBloom exists because turning one idea into polished posts for every
            platform should feel instant, not like repeating the same work four times.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          {painPoints.map((item) => (
            <GridItem key={item.title} {...item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
