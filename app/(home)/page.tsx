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
import { BrokenSection } from "@/modules/home/components/BrokenSection";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
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

const steps = [
  {
    number: "1",
    title: "Drop Idea",
    description: "Paste a raw thought, story, launch note, or insight you want to turn into content.",
  },
  {
    number: "2",
    title: "Choose Platforms",
    description: "Select LinkedIn, X, Instagram, and Peerlist. We adapt structure for each one.",
  },
  {
    number: "3",
    title: "Post Everywhere",
    description: "Receive polished platform-ready drafts with hooks, CTA flow, and clean formatting.",
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

const testimonials = [
  {
    quote:
      "I used to pause after writing a LinkedIn post because I knew I still had three more rewrites waiting. Now I publish everywhere in one flow.",
    name: "Aarav Shah",
    role: "Founder, SaaS Studio",
  },
  {
    quote:
      "The biggest win is tone control. The drafts still sound like me, just tighter, sharper, and much faster to ship.",
    name: "Mira Sen",
    role: "Indie Maker, Launch Notes",
  },
  {
    quote:
      "We moved from inconsistent social posting to an actual content rhythm. That alone made the product feel more alive.",
    name: "Rohan Malik",
    role: "Marketing Lead, Creator Tools",
  },
];

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
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium text-slate-600 shadow-[0_0_0_1px_rgba(255,255,255,0.4)] backdrop-blur dark:border-white/12 dark:bg-white/6 dark:text-white/80 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <span className="h-2 w-2 rounded-full bg-[#6f8dff] dark:bg-[#92a8ff]" />
            Built for creators, founders, and growth teams
          </div>

          <h1 className="mt-8 bg-[linear-gradient(180deg,#0f172a_0%,#334155_42%,#7c8aa3_100%)] bg-clip-text text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] text-transparent sm:text-6xl md:text-7xl lg:text-[5.75rem] dark:bg-[linear-gradient(180deg,#f8fbff_0%,#bcc7df_42%,#7c859d_100%)]">
            Write Once.
            <br />
            Post
            <br />
            Everywhere.
          </h1>

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
            <Link
              href="/learn-more"
              className="inline-flex min-w-[180px] items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:bg-slate-50 dark:border-white/14 dark:bg-white/6 dark:text-white dark:hover:bg-white/10"
            >
              See it in Action
            </Link>
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


      <BrokenSection />

      <section id="how-it-works" className="border-t border-slate-200 dark:border-white/6">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
                From spark to stream in seconds.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-[#98a1b5] sm:text-base">
                A simple guided workflow your team can understand immediately.
              </p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-white/38">Step-by-step flow</p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="absolute left-8 right-[-2rem] top-5 hidden h-px bg-slate-200 dark:bg-white/12 md:block" />
                <div className="relative z-10 h-10 w-10 rounded-xl border border-slate-200 bg-white text-center text-sm font-bold leading-10 text-slate-950 dark:border-white/12 dark:bg-[#0f1320] dark:text-white">
                  {step.number}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600 dark:text-[#98a1b5]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-28 border-t border-slate-200 bg-[#eef2f8] dark:border-white/6 dark:bg-[#090b12]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/42">Everything you need</p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
              The content engine
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,252,0.92))] p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1 dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(17,20,31,0.94),rgba(11,13,20,0.92))] dark:shadow-none"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/6">
                  <Icon className="h-5 w-5 text-[#6f8dff] dark:text-[#d8e2ff]" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-[#98a1b5]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 dark:border-white/6">
        <div className="mx-auto grid max-w-6xl gap-5 px-6 py-20 sm:px-8 lg:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,252,0.92))] p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(17,20,31,0.96),rgba(11,13,20,0.92))] dark:shadow-none"
            >
              <blockquote className="text-sm leading-7 text-slate-700 dark:text-[#d2d8e6]">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6">
                <div className="text-sm font-semibold text-slate-950 dark:text-white">{item.name}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-white/40">{item.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-slate-200 bg-[#eef2f8] dark:border-white/6 dark:bg-[#090b12]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/42">Monthly billing</p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
              Simple, transparent pricing
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={[
                  "rounded-[1.7rem] border p-7",
                  plan.featured
                    ? "border-[#8aa6ff] bg-[linear-gradient(180deg,rgba(234,240,255,0.98),rgba(219,228,252,0.98))] shadow-[0_0_0_1px_rgba(149,176,255,0.18),0_20px_60px_rgba(86,111,255,0.12)] dark:bg-[linear-gradient(180deg,rgba(25,31,54,0.98),rgba(15,18,30,0.98))] dark:shadow-[0_0_0_1px_rgba(149,176,255,0.16),0_20px_60px_rgba(86,111,255,0.16)]"
                    : "border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,252,0.92))] shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(17,20,31,0.94),rgba(11,13,20,0.92))] dark:shadow-none",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{plan.name}</h3>
                  {plan.featured ? (
                    <span className="rounded-full border border-[#8aa6ff]/40 bg-[#8aa6ff]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4766d6] dark:text-[#c8d5ff]">
                      Most Popular
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-4xl font-black tracking-[-0.05em] text-slate-950 dark:text-white">{plan.price}</span>
                  <span className="pb-1 text-sm text-slate-500 dark:text-[#98a1b5]">/ month</span>
                </div>

                <p className="mt-3 text-sm text-slate-600 dark:text-[#98a1b5]">{plan.description}</p>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-700 dark:text-[#d4daea]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/6">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === "Team" ? "/learn-more" : primaryHref}
                  className={[
                    "mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors",
                    plan.featured
                      ? "bg-[linear-gradient(180deg,#d7e3ff_0%,#9cbcff_100%)] text-[#081224]"
                      : "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50 dark:border-white/12 dark:bg-white/6 dark:text-white dark:hover:bg-white/10",
                  ].join(" ")}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

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
