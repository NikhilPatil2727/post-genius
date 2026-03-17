"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Target,
  CheckCircle2,
  Copy,
  Layout,
  TrendingUp,
  Bell,
  Users2,
  Video,
  Rocket,
  ArrowRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Real SVG Brand Logos ─── */

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-g" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-g)" />
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
    <circle cx="17.5" cy="6.5" r="1.25" fill="white" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5.5" fill="#0f0f0f" />
    <path d="M17.751 4h2.985l-6.523 7.456L21.5 20h-6.005l-4.7-6.146L5.332 20H2.345l6.978-7.977L2.5 4h6.16l4.251 5.622L17.751 4zm-1.047 14.4h1.654L7.619 5.637H5.84L16.704 18.4z" fill="white" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4.5" fill="#0A66C2" />
    <path d="M7.75 9.5H5.25v9.25h2.5V9.5zm-1.25-3.75a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM19.25 18.75h-2.5v-4.6c0-1.1-.02-2.5-1.52-2.5-1.53 0-1.77 1.2-1.77 2.42v4.68H11v-9.25h2.4v1.26h.03c.34-.64 1.16-1.32 2.38-1.32 2.55 0 3.02 1.68 3.02 3.86v5.45z" fill="white" />
  </svg>
);

const PeerlistIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#00AA45" />
    <path d="M6 5.5h5.2c2.1 0 3.5 1.3 3.5 3.2 0 1.9-1.4 3.2-3.5 3.2H8.3v3.6H6V5.5zm2.3 4.6h2.7c.8 0 1.3-.5 1.3-1.4 0-.9-.5-1.4-1.3-1.4H8.3v2.8z" fill="white" />
    <circle cx="17.5" cy="16" r="2.2" fill="white" opacity="0.9" />
  </svg>
);

/* ─── Data ─── */

const platforms = [
  { id: "instagram", name: "Instagram", shortName: "Instagram", icon: <InstagramIcon className="h-5 w-5" />, color: "bg-gradient-to-br from-pink-500 to-purple-600" },
  { id: "twitter",   name: "Twitter/X",  shortName: "X",         icon: <XIcon className="h-5 w-5" />,           color: "bg-gradient-to-br from-neutral-800 to-black" },
  { id: "linkedin",  name: "LinkedIn",   shortName: "LinkedIn",  icon: <LinkedInIcon className="h-5 w-5" />,    color: "bg-gradient-to-br from-blue-600 to-blue-800" },
  { id: "peerlist",  name: "Peerlist",   shortName: "Peerlist",  icon: <PeerlistIcon className="h-5 w-5" />,    color: "bg-gradient-to-br from-green-500 to-green-700" },
];

const stats = [
  { icon: <Clock className="h-5 w-5" />,     value: "10×",  label: "Faster creation",    sub: "Minutes, not hours" },
  { icon: <Copy className="h-5 w-5" />,      value: "80%",  label: "Time saved",         sub: "Per content piece" },
  { icon: <TrendingUp className="h-5 w-5" />, value: "3×",  label: "More consistency",   sub: "Across all platforms" },
  { icon: <Zap className="h-5 w-5" />,       value: "4",    label: "Platforms covered",  sub: "One input, four outputs" },
];

const workflowSteps = [
  {
    step: "01",
    title: "One Input, Multiple Outputs",
    description: "Start with a single topic, idea, or draft — PostBloom handles the rest. No rewriting, no copy-pasting, no reformatting by hand.",
    features: [
      "Generates tailored content for all platforms simultaneously",
      "Automatically adapts format, tone, and length per platform",
      "Keeps your messaging consistent across every channel",
    ],
    icon: <Layout className="h-6 w-6" />,
  },
  {
    step: "02",
    title: "AI Platform Optimisation",
    description: "The AI intelligently rewrites content to match each platform's unique requirements — not just truncated, but genuinely restructured.",
    features: [
      "Respects character limits and native formatting rules",
      "Generates platform-specific hashtag strategies",
      "Matches optimal post structure and tone per audience",
    ],
    icon: <Target className="h-6 w-6" />,
  },
];

const platformContent = {
  instagram: {
    subtitle: "Captions · Reels · Stories",
    accentColor: "border-l-pink-500",
    features: [
      "Captions with a strong hook in the first 125 characters",
      "Stories content with clear, action-driving CTAs",
      "Reels scripts with descriptions ready to paste",
      "Carousel post structures with engaging slide hooks",
    ],
    sample: {
      text: "Transform your ideas into visual stories that stop the scroll. Strong hook in the first 125 characters, friendly tone, and 5 targeted hashtags — ready to paste under your Reel or post.",
      tags: ["#ContentCreation", "#SocialMediaTips", "#AIContent"],
      tagColor: "text-pink-600 dark:text-pink-400",
      meta: "Up to 2,200 characters · Includes 5 hashtags",
    },
  },
  twitter: {
    subtitle: "Posts · Threads",
    accentColor: "border-l-neutral-800",
    features: [
      "Punchy single tweets under 280 characters",
      "Threads of up to 25 tweets for long-form ideas",
      "Trending topic commentary that drives engagement",
      "Questions and conversation starters for more replies",
    ],
    sample: {
      text: "Just created a week's worth of content in 30 minutes. Using AI for multiple platforms is a game-changer — saves 20+ hrs/week, consistent messaging, higher engagement. #Productivity #AIContent",
      tags: [],
      tagColor: "",
      meta: "Max 280 characters · Optional thread · Copy-ready",
    },
  },
  linkedin: {
    subtitle: "Posts · Thought Leadership",
    accentColor: "border-l-blue-600",
    features: [
      "Professional posts between 1,200–2,000 characters",
      "Thought leadership pieces and industry insights",
      "Short paragraphs, natural flow, closes with 3 hashtags",
      "Company updates and milestone announcements",
    ],
    sample: {
      text: "PostBloom turns your topic or draft into a polished LinkedIn post — 1,200–2,000 characters, short punchy paragraphs, professional tone, closing with 3 relevant hashtags. Choose your tone and audience on the Generate page, then copy with one click.",
      tags: [],
      tagColor: "",
      meta: "Optimised for feed engagement · One-click copy",
    },
  },
  peerlist: {
    subtitle: "Developer Community",
    accentColor: "border-l-green-600",
    features: [
      "Concise, high-signal posts up to 2,000 characters",
      "Developer and tech-community–friendly tone throughout",
      "Profile and project highlights that stand out",
      "Clean, scannable formatting for recruiters and peers",
    ],
    sample: {
      text: "Professional, concise posts (up to 2,000 characters) for developers and tech professionals — clear, scannable, and ideal for profile updates and project highlights. Same input as other platforms; select Peerlist on results and copy.",
      tags: [],
      tagColor: "",
      meta: "One input → four platforms · Copy only what you need",
    },
  },
};

const useCases = [
  {
    title: "Social Media Managers",
    description: "Plan and schedule an entire month of content in a single afternoon.",
    icon: <Users2 className="h-5 w-5" />,
    features: ["30 days of posts in ~3 hours", "Consistent brand voice", "Trend suggestions built in"],
  },
  {
    title: "Content Creators",
    description: "Repurpose one piece of content into 20+ posts across every platform.",
    icon: <Video className="h-5 w-5" />,
    features: ["Video → Blog → Social in one flow", "Transcript-to-post built in", "Hashtag tuning per platform"],
  },
  {
    title: "Marketing Teams",
    description: "Launch unified campaigns across all channels from a single brief.",
    icon: <Rocket className="h-5 w-5" />,
    features: ["Cohesive campaign messaging", "Platform-specific adaptations", "Cross-channel consistency"],
  },
  {
    title: "Small Businesses",
    description: "Stay active on 5+ platforms without a dedicated content team.",
    icon: <Bell className="h-5 w-5" />,
    features: ["Daily posts, minimal time", "Audience-specific tone", "Engagement templates ready"],
  },
];

/* ─── Component ─── */

export default function LearnMorePage() {
  const [activePlatform, setActivePlatform] = useState("instagram");
  const activeContent = platformContent[activePlatform as keyof typeof platformContent];
  const activePlatformData = platforms.find((p) => p.id === activePlatform)!;

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden">

      {/* ── Slim page header — NOT a hero ── */}
      {/* <div className="border-b border-border/60 bg-background/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">PostBloom</span>
            <span className="text-border">/</span>
            <span>Learn more</span>
          </div>
          <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 h-8 gap-1.5 shrink-0">
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div> */}

      {/* ── Page intro — compact, not a hero ── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-14 pb-6">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2" style={{ letterSpacing: "-0.025em" }}>
            Everything PostBloom does
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            One input. Four platforms. A fraction of the time.
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pb-10 sm:pb-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <div className="rounded-xl border border-border/70 bg-card/70 p-4 sm:p-5 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black tracking-tight text-foreground" style={{ letterSpacing: "-0.03em" }}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-foreground/80 mt-0.5">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/40" />

      {/* ── How it works ── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">How it works</p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Your multi-platform workflow
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">From idea to published content across all platforms in minutes.</p>
        </div>

        <div className="space-y-4">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
            >
              <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-5 sm:p-6 md:p-7">
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 items-start">

                    {/* Step badge + icon */}
                    <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2 shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-black shrink-0">
                        {step.step}
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary sm:mx-auto shrink-0">
                        {step.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="grow min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-bold tracking-tight">{step.title}</h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                          <Clock className="h-2.5 w-2.5" /> Saves 5+ hrs
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {step.features.map((f, fi) => (
                          <div key={fi} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <span className="text-xs text-foreground/75 leading-snug">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Platform avatars */}
                    <div className="shrink-0 hidden md:flex flex-col items-center gap-2 rounded-xl bg-muted/50 border border-border/50 px-4 py-3">
                      <div className="flex -space-x-1.5">
                        {platforms.map((p) => (
                          <div key={p.id} className={`w-7 h-7 rounded-full ${p.color} flex items-center justify-center border-2 border-background [&>svg]:h-3.5 [&>svg]:w-3.5`}>
                            {p.icon}
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium">4 platforms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/40" />

      {/* ── Platform content tabs ── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Output formats</p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Optimized for each platform
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">One topic or draft → four copy-ready posts.</p>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Tabs value={activePlatform} onValueChange={setActivePlatform}>

            {/* Tab bar */}
            <TabsList className="w-full h-auto p-1.5 bg-muted/40 border-b border-border rounded-none grid grid-cols-4 gap-1">
              {platforms.map((p) => (
                <TabsTrigger
                  key={p.id}
                  value={p.id}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg py-2.5 px-2 sm:px-3 text-sm font-medium transition-all duration-150 cursor-pointer",
                    "text-muted-foreground hover:text-foreground hover:bg-background/70",
                    "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80"
                  )}
                >
                  <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${p.color} flex items-center justify-center text-white shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5 sm:[&>svg]:h-4 sm:[&>svg]:w-4`}>
                    {p.icon}
                  </span>
                  <span className="hidden sm:inline font-semibold text-xs sm:text-sm">{p.shortName}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Content panels */}
            {platforms.map((p) => {
              const content = platformContent[p.id as keyof typeof platformContent];
              return (
                <TabsContent key={p.id} value={p.id} className="mt-0 outline-none data-[state=inactive]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border"
                  >
                    {/* Left — what we optimise */}
                    <div className="p-5 sm:p-6 md:p-7">
                      <div className="flex items-center gap-3 mb-5">
                        <div className={`w-9 h-9 rounded-xl ${p.color} flex items-center justify-center text-white shrink-0 [&>svg]:h-4 [&>svg]:w-4`}>
                          {p.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground leading-tight">{p.name}</h3>
                          <p className="text-xs text-muted-foreground">{content.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">What we optimise</p>
                      <ul className="space-y-2.5">
                        {content.features.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right — sample */}
                    <div className="p-5 sm:p-6 md:p-7 bg-muted/20">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Sample output</p>
                      <div className={`rounded-xl border border-border bg-background p-4 sm:p-5 border-l-4 ${content.accentColor} mb-2.5`}>
                        <p className="text-sm text-foreground/90 leading-relaxed mb-2.5">
                          {content.sample.text}
                        </p>
                        {content.sample.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {content.sample.tags.map((tag) => (
                              <span key={tag} className={`text-xs font-semibold ${content.sample.tagColor}`}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{content.sample.meta}</p>
                    </div>
                  </motion.div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>

      <div className="border-t border-border/40" />

      {/* ── Use cases ── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Who it's for</p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Who benefits most
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">Professionals managing multiple platforms see the biggest gains.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {useCases.map((uc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
            >
              <Card className="h-full border border-border/60 bg-card/70 hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
                <CardContent className="p-5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/15 transition-colors [&>svg]:h-4 [&>svg]:w-4">
                    {uc.icon}
                  </div>
                  <h3 className="text-sm font-bold mb-1 tracking-tight text-foreground">{uc.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{uc.description}</p>
                  <ul className="space-y-1.5">
                    {uc.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span className="text-xs text-foreground/70 leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/40" />

      {/* ── CTA — compact, not a full section ── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          <div className="grow min-w-0">
            <div className="flex flex-wrap gap-3 mb-3">
              {[
                { value: "20+", label: "hrs saved / week" },
                { value: "4",   label: "platforms" },
                { value: "80%", label: "less writing time" },
              ].map((s, i) => (
                <div key={i} className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-foreground tracking-tight" style={{ letterSpacing: "-0.02em" }}>{s.value}</span>
                  <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                </div>
              ))}
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-1" style={{ letterSpacing: "-0.02em" }}>
              Ready to reclaim your time?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              Start generating content for all four platforms today. No credit card required.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:items-end gap-2">
            <Button
              size="lg"
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold px-7 h-11 shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all whitespace-nowrap"
            >
              <Rocket className="h-4 w-4" />
              Start free trial
            </Button>
            <p className="text-xs text-muted-foreground text-center sm:text-right">Cancel anytime</p>
          </div>
        </div>
      </div>

    </div>
  );
}