import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import { onboardUser } from "@/modules/auth/actions";
import { AnimatedTooltipPreview } from "@/components/animated-tooltip-demo";
import HeroScrollDemo from "@/components/container-scroll-animation-demo";
import { BrokenSection } from "@/modules/home/components/BrokenSection";
import { PricingSection } from "@/modules/home/components/PricingSection";
import { HomeHeroTypewriter } from "@/components/home-hero-typewriter";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const platformPills = [
  {
    label: "LinkedIn",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
      >
        <path
          fill="#0A66C2"
          d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.05-1.86-3.05-1.87 0-2.15 1.45-2.15 2.95v5.67H9.32V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.38-1.86 3.61 0 4.28 2.38 4.28 5.47v6.28ZM5.3 7.43A2.07 2.07 0 1 1 5.3 3.3a2.07 2.07 0 0 1 0 4.14ZM7.08 20.45H3.5V9h3.57v11.45Z"
        />
      </svg>
    ),
  },
  {
    label: "Twitter",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
      >
        <path d="M18.9 2H22l-6.77 7.73L23.2 22h-6.25l-4.9-7.42L5.56 22H2.45l7.24-8.28L1.8 2h6.4l4.43 6.78L18.9 2Zm-1.1 18h1.73L7.26 3.9H5.4L17.8 20Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
      >
        <defs>
          <linearGradient id="instagram-gradient" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F58529" />
            <stop offset="0.35" stopColor="#DD2A7B" />
            <stop offset="0.7" stopColor="#8134AF" />
            <stop offset="1" stopColor="#515BD4" />
          </linearGradient>
        </defs>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="url(#instagram-gradient)" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="url(#instagram-gradient)" strokeWidth="2" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="url(#instagram-gradient)" />
      </svg>
    ),
  },
  {
    label: "Peerlist",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
      >
        <path
          d="M7 4.5h6.1a4.4 4.4 0 1 1 0 8.8H9.6v6.2H7V4.5Zm2.6 6.4h3.2a1.8 1.8 0 1 0 0-3.6H9.6v3.6Z"
          fill="#00AA45"
        />
      </svg>
    ),
  },
];


const features = [
  {
    icon: WandSparkles,
    title: "AI-Powered Rewriting",
    description:
      "Turn a rough idea into platform-specific posts without babysitting prompts.",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description:
      "Get ready-to-publish drafts in seconds, not hours of manual rewriting.",
  },
  {
    icon: Sparkles,
    title: "4-Platform Output",
    description:
      "Generate tailored versions for LinkedIn, X, Instagram, and Peerlist in one pass.",
  },
  {
    icon: Check,
    title: "One-Click Copy",
    description:
      "Move from draft to posting flow quickly with clean, structured output blocks.",
  },
  {
    icon: ChevronRight,
    title: "Create Fast",
    description:
      "Stay in idea mode while the system handles formatting, spacing, and hook structure.",
  },
  {
    icon: ArrowRight,
    title: "Smart Hashtags",
    description:
      "Outputs include context-aware hashtag suggestions where they fit best.",
  },
];

const featureCards = features.map(({ title, description }) => ({
  title,
  description,
  link: "/learn-more",
}));




const pricing = [
  {
    name: "Free",
    price: "$0",
    description: "For trying the workflow",
    features: ["3 posts / week", "2 platforms", "Standard AI model"],
    cta: "Current Plan",
    muted: true,
  },
  {
    name: "Pro",
    price: "$12",
    description: "For active creators",
    features: ["Unlimited ideas", "All 4 platforms", "Advanced tone control", "Custom voice presets"],
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Team",
    price: "$29",
    description: "For small content teams",
    features: ["5 team seats", "Brand voice library", "Priority support"],
    cta: "Contact Sales",
    muted: true,
  },
];

const faqs = [
  {
    question: "Which platforms do you support?",
    answer:
      "The current homepage flow focuses on LinkedIn, X, Instagram, and Peerlist, matching the product positioning in your reference.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes. The landing page now includes a clear free plan so visitors can understand the entry point immediately.",
  },
  {
    question: "How is this different from ChatGPT?",
    answer:
      "This page frames the product as a purpose-built repurposing workflow, not a general chatbot. The value is platform adaptation, structure, and speed.",
  },
  {
    question: "Can I customize the brand voice?",
    answer:
      "Yes. The messaging and pricing sections now highlight voice control as part of the pro-level experience.",
  },
  {
    question: "Who is this best for?",
    answer:
      "Creators, founders, indie hackers, and small teams who want one idea to become multiple polished social posts fast.",
  },
];

export default async function HomePage() {
  const onboardResult = await onboardUser();
  const user = onboardResult.success ? onboardResult.user : null;
  const primaryHref = user ? "/admin/generate" : "/sign-up";

  return (
    <div className="relative overflow-hidden bg-[#f6f8fc] text-slate-950 dark:bg-[#07090f] dark:text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-6rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(119,160,255,0.18),_transparent_68%)] dark:bg-[radial-gradient(circle,_rgba(119,160,255,0.22),_transparent_68%)]" />
        <div className="absolute right-[-8rem] top-[10rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(182,146,255,0.15),_transparent_68%)] dark:bg-[radial-gradient(circle,_rgba(182,146,255,0.22),_transparent_68%)]" />
        <div className="absolute bottom-[12rem] left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(124,92,255,0.08),_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(124,92,255,0.12),_transparent_70%)]" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-32 sm:px-8 md:pb-28 md:pt-36">
        <div className="mx-auto max-w-4xl text-center">
          <div className="group relative inline-flex items-center justify-center rounded-full bg-white/80 px-4 py-2 shadow-[inset_0_-8px_10px_rgba(111,141,255,0.12)] backdrop-blur transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_rgba(111,141,255,0.22)] dark:bg-white/6">
            <span
              className="animate-gradient absolute inset-0 block rounded-[inherit] bg-[linear-gradient(90deg,rgba(111,141,255,0.5),rgba(146,168,255,0.5),rgba(111,141,255,0.5))] bg-[length:300%_100%] p-[1px]"
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
            <span className="h-2 w-2 rounded-full bg-[#6f8dff] dark:bg-[#92a8ff]" />
            <hr className="mx-2 h-4 w-px shrink-0 bg-slate-300 dark:bg-white/20" />
            <AnimatedGradientText
              className="text-xs font-medium"
              speed={1.2}
              colorFrom="#6f8dff"
              colorTo="#92a8ff"
            >
              Built for creators, founders, and growth teams
            </AnimatedGradientText>
            <ChevronRight className="ml-1 size-4 stroke-slate-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 dark:stroke-white/50" />
          </div>

          <div className="mt-2 flex justify-center">
            <HomeHeroTypewriter />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#a0a9bd] sm:text-base">
            Generate content for Instagram, Twitter, LinkedIn, and Peerlist in one click.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {platformPills.map((platform) => (
              <div
                key={platform.label}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-sm text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:shadow-none"
              >
                <span className="shrink-0">{platform.icon}</span>
                <span>{platform.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-full bg-transparent dark:bg-transparent"
              className="rounded-full dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            >
              <Link
                href={primaryHref}
                className="inline-flex min-w-[100px] items-center justify-center rounded-[inherit] px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
              >
                {user ? "Open Generator" : "Start for Free"}
              </Link>
            </HoverBorderGradient>
            <RainbowButton asChild size="lg" className="min-w-[180px] rounded-xl">
              <Link href="/learn-more">
                See it in Action
              </Link>
            </RainbowButton>
          </div>

          <div className="mt-8">
            <AnimatedTooltipPreview />
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-center sm:gap-10">
            <div>
              <p className="text-xl font-bold text-slate-950 dark:text-white">10+</p>
              <p className="text-sm text-slate-500 dark:text-white/50">Active creators</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
            <div>
              <p className="text-xl font-bold text-slate-950 dark:text-white">10 hrs</p>
              <p className="text-sm text-slate-500 dark:text-white/50">Saved per week</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
            <div>
              <p className="text-xl font-bold text-slate-950 dark:text-white">4 platforms</p>
              <p className="text-sm text-slate-500 dark:text-white/50">In one click</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-slate-200 bg-[linear-gradient(180deg,#f7faff_0%,#eef3fb_100%)] dark:border-white/6 dark:bg-[linear-gradient(180deg,#080a10_0%,#0b1018_100%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8rem] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(96,165,250,0.22),_transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle,_rgba(96,165,250,0.14),_transparent_68%)]" />
          <div className="absolute right-[-4rem] top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(52,211,153,0.16),_transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle,_rgba(125,211,252,0.12),_transparent_68%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16 lg:py-20">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500 dark:text-white/42">
            One idea. Four outputs.
          </p>
          <div className="mt-6">
            <TextHoverEffect
              text="Post Bloom"
              duration={0.18}
              className="h-24 w-full sm:h-32 md:h-40 lg:h-44"
            />
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm font-medium leading-7 text-slate-600 dark:text-white/58 sm:text-base">
            Large, clean, readable branding without a card around it, so the wordmark
            feels like part of the page instead of a box inside it.
          </p>
        </div>
      </section>

      <BrokenSection />



      <section id="features" className="scroll-mt-28 border-t border-slate-200 bg-[#eef2f8] dark:border-white/6 dark:bg-[#090b12]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <HeroScrollDemo />

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/42">Everything you need</p>
            <h2 className="font-display mt-12 text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
              The content engine
            </h2>
          </div>

          <div className="mt-10">
            <HoverEffect
              items={featureCards}
              className="mx-auto max-w-5xl px-0 py-0"
            />
          </div>
        </div>
      </section>



      <PricingSection pricing={pricing} primaryHref={primaryHref} />

      <section id="faq" className="border-t border-slate-200 dark:border-white/6">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-12 rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,252,0.92))] p-3 shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(16,19,29,0.96),rgba(10,12,18,0.92))] dark:shadow-none sm:p-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-slate-200 px-4 dark:border-white/8">
                  <AccordionTrigger className="py-5 text-sm font-semibold text-slate-950 hover:no-underline dark:text-white">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pr-8 text-sm leading-7 text-slate-600 dark:text-[#98a1b5]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 px-6 py-20 dark:border-white/6 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-[linear-gradient(120deg,rgba(255,255,255,0.96),rgba(238,243,252,0.96)_50%,rgba(229,233,248,0.96)_100%)] px-8 py-14 text-center shadow-[0_30px_120px_rgba(15,23,42,0.08)] dark:border-white/8 dark:bg-[linear-gradient(120deg,rgba(18,21,33,0.98),rgba(25,26,40,0.96)_50%,rgba(45,40,68,0.94)_100%)] dark:shadow-[0_30px_120px_rgba(0,0,0,0.35)] sm:px-12">
          <h2 className="text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
            Stop rewriting.
            <br />
            Start posting.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#b5bed1] sm:text-base">
            Join creators who are scaling their distribution without losing their voice.
          </p>
          <Link
            href={primaryHref}
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b1020] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
