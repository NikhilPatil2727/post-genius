"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  LayoutTemplate,
  Layers3,
  MessageSquareText,
  Rocket,
  Sparkles,
  Target,
  Users2,
  WandSparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="learn-ig-g" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#learn-ig-g)" />
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
    <circle cx="17.5" cy="6.5" r="1.25" fill="white" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5.5" fill="#0f0f0f" />
    <path
      d="M17.751 4h2.985l-6.523 7.456L21.5 20h-6.005l-4.7-6.146L5.332 20H2.345l6.978-7.977L2.5 4h6.16l4.251 5.622L17.751 4zm-1.047 14.4h1.654L7.619 5.637H5.84L16.704 18.4z"
      fill="white"
    />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4.5" fill="#0A66C2" />
    <path
      d="M7.75 9.5H5.25v9.25h2.5V9.5zm-1.25-3.75a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM19.25 18.75h-2.5v-4.6c0-1.1-.02-2.5-1.52-2.5-1.53 0-1.77 1.2-1.77 2.42v4.68H11v-9.25h2.4v1.26h.03c.34-.64 1.16-1.32 2.38-1.32 2.55 0 3.02 1.68 3.02 3.86v5.45z"
      fill="white"
    />
  </svg>
);

const PeerlistIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#00AA45" />
    <path
      d="M6 5.5h5.2c2.1 0 3.5 1.3 3.5 3.2 0 1.9-1.4 3.2-3.5 3.2H8.3v3.6H6V5.5zm2.3 4.6h2.7c.8 0 1.3-.5 1.3-1.4 0-.9-.5-1.4-1.3-1.4H8.3v2.8z"
      fill="white"
    />
    <circle cx="17.5" cy="16" r="2.2" fill="white" opacity="0.9" />
  </svg>
);

const stats = [
  { value: "4x", label: "platform-ready outputs", hint: "from one idea" },
  { value: "80%", label: "less manual rewriting", hint: "for every campaign" },
  { value: "10x", label: "faster publishing flow", hint: "without copy chaos" },
  { value: "1", label: "clear brand voice", hint: "across every channel" },
];

const pillars = [
  {
    icon: WandSparkles,
    title: "Content intelligence",
    description:
      "Post Genius reshapes one raw input into structured, platform-native drafts with tone, format, and CTA logic already aligned.",
  },
  {
    icon: LayoutTemplate,
    title: "Professional presentation",
    description:
      "Every output is built for readability first, so your posts look intentional, clean, and ready to ship instead of AI-generated.",
  },
  {
    icon: BarChart3,
    title: "Consistency at scale",
    description:
      "Founders, creators, and teams can publish more often without losing message clarity or spending hours rewriting the same point.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Start with your real idea",
    description:
      "Paste a launch update, thought, lesson, story, or campaign brief. No prompt engineering needed.",
    bullets: ["Works from rough notes or polished drafts", "Keeps the core message intact", "Built for speed when ideas strike"],
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Let the product adapt it",
    description:
      "Post Genius rewrites the same message for each destination so the output feels native, not duplicated.",
    bullets: ["Adjusts structure by platform", "Matches tone to audience intent", "Balances hooks, clarity, and length"],
    icon: Layers3,
  },
  {
    step: "03",
    title: "Review, copy, publish",
    description:
      "Move from concept to distribution in minutes with polished drafts your team can actually use.",
    bullets: ["Copy-ready formatting", "High-signal, low-friction workflow", "Faster publishing without messy edits"],
    icon: Rocket,
  },
];

const platforms = [
  {
    id: "linkedin",
    name: "LinkedIn",
    shortName: "LinkedIn",
    icon: <LinkedInIcon className="h-5 w-5" />,
    gradient: "from-blue-500 via-sky-500 to-cyan-400",
    panelTone: "from-blue-500/12 to-sky-500/5",
    subtitle: "Thought leadership and professional authority",
    features: [
      "Strong opening that earns attention quickly",
      "Short-paragraph structure for easy reading",
      "Professional tone with clear positioning",
      "CTA and hashtags that feel relevant, not forced",
    ],
    preview: {
      label: "Professional narrative",
      title: "Turn expertise into a post people actually finish",
      text: "Your best ideas should not live in draft folders. Post Genius transforms a raw insight into a sharp LinkedIn post with stronger framing, better pacing, and a more credible professional voice.",
      footer: "Built for founders, operators, and growth teams",
    },
  },
  {
    id: "twitter",
    name: "X / Twitter",
    shortName: "X",
    icon: <XIcon className="h-5 w-5" />,
    gradient: "from-slate-900 via-slate-700 to-slate-500",
    panelTone: "from-slate-500/10 to-slate-700/5",
    subtitle: "Fast-moving posts and thread-friendly storytelling",
    features: [
      "Punchier hooks for short attention windows",
      "Concise structure that keeps momentum high",
      "Thread-ready sequencing for deeper ideas",
      "Sharper opinion framing for stronger engagement",
    ],
    preview: {
      label: "Speed and clarity",
      title: "More signal, less fluff",
      text: "One idea becomes a tighter X post with a stronger first line, better rhythm, and cleaner takeaway so you can join the conversation quickly without sounding rushed.",
      footer: "Optimized for velocity, reactions, and clarity",
    },
  },
  {
    id: "instagram",
    name: "Instagram",
    shortName: "Instagram",
    icon: <InstagramIcon className="h-5 w-5" />,
    gradient: "from-fuchsia-500 via-pink-500 to-orange-400",
    panelTone: "from-pink-500/12 to-orange-500/5",
    subtitle: "Captions, hooks, and story-friendly storytelling",
    features: [
      "Hook-led captions designed to stop the scroll",
      "Stronger emotional pacing and visual language",
      "Cleaner CTA flow for saves, shares, and taps",
      "Hashtag suggestions that support discoverability",
    ],
    preview: {
      label: "Visual-first messaging",
      title: "Write captions that feel intentional",
      text: "Post Genius gives your idea a stronger emotional arc, a more compelling opening, and cleaner caption flow so the final post feels polished and creator-ready.",
      footer: "Built for reels, carousels, stories, and static posts",
    },
  },
  {
    id: "peerlist",
    name: "Peerlist",
    shortName: "Peerlist",
    icon: <PeerlistIcon className="h-5 w-5" />,
    gradient: "from-emerald-500 via-green-500 to-lime-400",
    panelTone: "from-emerald-500/12 to-lime-500/5",
    subtitle: "Builder-focused updates for the tech community",
    features: [
      "Cleaner updates with maker-friendly tone",
      "Project highlights with better signal density",
      "Professional but human delivery for community reach",
      "Structured formatting that stays easy to scan",
    ],
    preview: {
      label: "Builder credibility",
      title: "Share progress with confidence",
      text: "From shipping notes to launch highlights, Post Genius reshapes your update into a more credible, concise, and community-ready Peerlist post.",
      footer: "Ideal for launches, milestones, and product updates",
    },
  },
];

const useCases = [
  {
    title: "Founders",
    description: "Build a visible online presence without writing from scratch every day.",
    icon: Target,
  },
  {
    title: "Creators",
    description: "Turn one insight into multi-platform distribution with less mental overhead.",
    icon: MessageSquareText,
  },
  {
    title: "Marketing teams",
    description: "Keep campaigns aligned across channels while reducing bottlenecks.",
    icon: Users2,
  },
  {
    title: "Agencies",
    description: "Scale content production for clients with faster iteration and cleaner outputs.",
    icon: Zap,
  },
];

export default function LearnMorePage() {
  const [activePlatform, setActivePlatform] = useState("linkedin");

  return (
    <div className="relative overflow-hidden bg-[#f4f7fb] text-slate-950 dark:bg-[#060810] dark:text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(94,129,255,0.18),_transparent_52%),radial-gradient(circle_at_20%_20%,_rgba(80,196,255,0.14),_transparent_34%),radial-gradient(circle_at_80%_12%,_rgba(80,255,191,0.10),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top,_rgba(94,129,255,0.24),_transparent_52%),radial-gradient(circle_at_20%_20%,_rgba(80,196,255,0.14),_transparent_34%),radial-gradient(circle_at_80%_12%,_rgba(80,255,191,0.10),_transparent_28%)]" />
        <div className="absolute left-[-10rem] top-[8rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,_rgba(110,149,255,0.16),_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(110,149,255,0.22),_transparent_70%)]" />
        <div className="absolute right-[-8rem] top-[20rem] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,_rgba(60,214,176,0.12),_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(60,214,176,0.18),_transparent_70%)]" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 pb-18 pt-28 sm:px-8 md:pb-24 md:pt-32">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-3xl">
            <Badge className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/8 dark:text-white/72">
              Product overview
            </Badge>

            <h1 className="mt-6 bg-[linear-gradient(180deg,#07111f_0%,#23324e_44%,#607492_100%)] bg-clip-text text-5xl font-black leading-[0.92] tracking-[-0.06em] text-transparent sm:text-6xl lg:text-[5.25rem] dark:bg-[linear-gradient(180deg,#f8fbff_0%,#cad5e8_42%,#7d89a2_100%)]">
              Learn More
              <br />
              About the
              <br />
              Product.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#a6afc3] sm:text-base">
              Post Genius helps you turn one raw idea into platform-ready content for LinkedIn, X, Instagram, and Peerlist. The experience is built to feel fast, professional, and reliable so your workflow stays simple even when your publishing goals grow.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex min-w-[190px] items-center justify-center rounded-xl bg-[linear-gradient(180deg,#dbe6ff_0%,#9fbcff_100%)] px-6 py-3 text-sm font-semibold text-[#081224] shadow-[0_18px_50px_rgba(110,149,255,0.26)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Start Creating
              </Link>
              <a
                href="#platforms"
                className="inline-flex min-w-[190px] items-center justify-center rounded-xl border border-slate-200 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:bg-slate-50 dark:border-white/12 dark:bg-white/6 dark:text-white dark:hover:bg-white/10"
              >
                Explore Platform Outputs
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(243,247,255,0.88))] p-6 shadow-[0_30px_120px_rgba(15,23,42,0.10)] backdrop-blur dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,19,30,0.94),rgba(8,10,18,0.96))] dark:shadow-[0_30px_120px_rgba(0,0,0,0.34)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-white/38">
                  Why it works
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] text-slate-950 dark:text-white">
                  One system.
                  <br />
                  Four polished outputs.
                </h2>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/6">
                <Rocket className="h-6 w-6 text-[#6f8dff] dark:text-[#a9bbff]" />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 dark:border-white/8 dark:bg-white/6"
                >
                  <div className="text-2xl font-black tracking-[-0.05em] text-slate-950 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-white/90">{stat.label}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-white/38">
                    {stat.hint}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative border-t border-slate-200/80 bg-[#edf3fa] dark:border-white/6 dark:bg-[#090c14]">
        <div className="mx-auto max-w-6xl px-6 py-18 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/42">
              Designed for modern publishing
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
              A clearer way to create
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="rounded-[1.7rem] border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,247,255,0.92))] shadow-[0_16px_50px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(16,19,30,0.95),rgba(10,13,20,0.92))] dark:shadow-none"
              >
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/6">
                    <Icon className="h-5 w-5 text-[#6f8dff] dark:text-[#bed0ff]" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-[#9da7bc]">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 dark:border-white/6">
        <div className="mx-auto max-w-6xl px-6 py-18 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/42">
                Workflow
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
                Built to remove friction
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-600 dark:text-[#9da7bc]">
              The product experience is simple on purpose: less setup, fewer decisions, and much faster distribution.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {workflow.map(({ step, title, description, bullets, icon: Icon }) => (
              <Card
                key={step}
                className="rounded-[1.7rem] border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,249,255,0.94))] shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(15,19,29,0.95),rgba(9,12,19,0.94))] dark:shadow-none"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-black tracking-[0.2em] text-slate-400 dark:text-white/34">
                      {step}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/6">
                      <Icon className="h-5 w-5 text-[#6f8dff] dark:text-[#bed0ff]" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-[#9da7bc]">{description}</p>
                  <div className="mt-6 space-y-3">
                    {bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-3 text-sm text-slate-700 dark:text-[#d6def0]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="platforms"
        className="border-t border-slate-200/80 bg-[#edf3fa] dark:border-white/6 dark:bg-[#090c14]"
      >
        <div className="mx-auto max-w-6xl px-6 py-18 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/42">
                Platform detail
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
                Content that feels native
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-600 dark:text-[#9da7bc]">
              Each destination has its own pace, formatting habits, and audience expectations. The product adapts your message accordingly.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/8 dark:bg-[rgba(11,13,20,0.94)] dark:shadow-none">
            <Tabs value={activePlatform} onValueChange={setActivePlatform}>
              <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-none border-b border-slate-200 bg-slate-50/80 p-3 md:grid-cols-4 dark:border-white/8 dark:bg-white/4">
                {platforms.map((platform) => (
                  <TabsTrigger
                    key={platform.id}
                    value={platform.id}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-2xl border border-transparent px-3 py-3 text-sm font-semibold text-slate-500 transition-all duration-200",
                      "hover:bg-white hover:text-slate-900 dark:hover:bg-white/8 dark:hover:text-white",
                      "data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm dark:data-[state=active]:border-white/10 dark:data-[state=active]:bg-white/8 dark:data-[state=active]:text-white"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                        platform.gradient
                      )}
                    >
                      {platform.icon}
                    </span>
                    <span>{platform.shortName}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {platforms.map((platform) => (
                <TabsContent key={platform.id} value={platform.id} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]"
                  >
                    <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r dark:border-white/8 sm:p-8">
                      <div
                        className={cn(
                          "inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:bg-white/6 dark:text-white/56"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                            platform.gradient
                          )}
                        >
                          {platform.icon}
                        </span>
                        {platform.name}
                      </div>

                      <h3 className="mt-6 text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">
                        {platform.subtitle}
                      </h3>

                      <div className="mt-6 space-y-3">
                        {platform.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3 text-sm text-slate-700 dark:text-[#d6def0]">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      <div
                        className={cn(
                          "rounded-[1.75rem] border border-slate-200 bg-gradient-to-br p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/8 dark:shadow-none",
                          platform.panelTone
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-white/38">
                              {platform.preview.label}
                            </p>
                            <h4 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
                              {platform.preview.title}
                            </h4>
                          </div>
                          <div
                            className={cn(
                              "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm",
                              platform.gradient
                            )}
                          >
                            {platform.icon}
                          </div>
                        </div>

                        <div className="mt-6 rounded-[1.4rem] border border-white/70 bg-white/90 p-5 dark:border-white/8 dark:bg-[#0c1019]">
                          <p className="text-sm leading-7 text-slate-700 dark:text-[#d8dff0]">
                            {platform.preview.text}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-white/36">
                          <span>{platform.preview.footer}</span>
                          <span>Copy-ready</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 dark:border-white/6">
        <div className="mx-auto max-w-6xl px-6 py-18 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/42">
                Best fit
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
                Made for ambitious teams and makers
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-600 dark:text-[#9da7bc]">
              If your product, personal brand, or company needs a stronger publishing rhythm, this workflow is built for you.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {useCases.map(({ title, description, icon: Icon }) => (
              <Card
                key={title}
                className="rounded-[1.6rem] border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,248,255,0.94))] shadow-[0_16px_50px_rgba(15,23,42,0.05)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(15,19,30,0.95),rgba(10,13,20,0.92))] dark:shadow-none"
              >
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/6">
                    <Icon className="h-5 w-5 text-[#6f8dff] dark:text-[#bed0ff]" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-[#9da7bc]">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-[#edf3fa] px-6 py-18 dark:border-white/6 dark:bg-[#090c14] sm:px-8 sm:py-22">
        <div className="mx-auto max-w-6xl rounded-[2.2rem] border border-slate-200/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.97),rgba(238,244,255,0.96)_48%,rgba(229,245,241,0.95)_100%)] px-8 py-12 shadow-[0_30px_120px_rgba(15,23,42,0.10)] dark:border-white/8 dark:bg-[linear-gradient(135deg,rgba(16,20,31,0.98),rgba(22,28,43,0.96)_48%,rgba(10,37,31,0.92)_100%)] dark:shadow-[0_30px_120px_rgba(0,0,0,0.34)] sm:px-12 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/42">
                Ready when you are
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
                Write less.
                <br />
                Publish smarter.
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-[#b9c3d8] sm:text-base">
                Start with one idea and turn it into a more professional multi-platform presence with less effort, better consistency, and a much cleaner content workflow.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="h-12 rounded-xl bg-[linear-gradient(180deg,#dbe6ff_0%,#9fbcff_100%)] px-7 text-sm font-semibold text-[#081224] shadow-[0_16px_40px_rgba(110,149,255,0.26)] hover:opacity-95"
                >
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-white/38">
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5" />
                  Faster workflow
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Professional output
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
