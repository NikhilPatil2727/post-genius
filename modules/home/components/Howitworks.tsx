import React from "react";
import { PenLine, Sparkles, Share2 } from "lucide-react";
import { FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { SiPeerlist } from "react-icons/si";

const steps = [
  {
    number: "01",
    icon: <PenLine className="h-6 w-6 text-blue-500" />,
    title: "Drop in your idea",
    description:
      "Paste a raw thought, a topic, bullet points — anything. No polishing needed. PostBloom works with rough material.",
  },
  {
    number: "02",
    icon: <Sparkles className="h-6 w-6 text-purple-500" />,
    title: "AI transforms it",
    description:
      "Our AI rewrites your idea for each platform — matching tone, length, hooks, and format rules automatically.",
  },
  {
    number: "03",
    icon: <Share2 className="h-6 w-6 text-emerald-500" />,
    title: "Review & publish",
    description:
      "Pick the version you love, tweak it if you want, and publish. All four platforms done in under a minute.",
  },
];

const outputs = [
  {
    icon: <FaLinkedin className="text-[#0A66C2]" />,
    platform: "LinkedIn",
    tag: "Professional",
    tagClass: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50",
    sample:
      "Thrilled to share something I learned shipping our last feature: speed beats perfection every time. Here's the mental shift that changed how I build…",
    border: "border-blue-200/70 dark:border-blue-900/60",
  },
  {
    icon: <FaXTwitter className="text-neutral-900 dark:text-white" />,
    platform: "Twitter / X",
    tag: "Punchy",
    tagClass: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700",
    sample:
      "Hot take: shipping > perfecting. Changed my mind on this after watching slow teams lose to fast ones 3x in a row 🧵",
    border: "border-neutral-200 dark:border-neutral-800",
  },
  {
    icon: <FaInstagram className="text-pink-500" />,
    platform: "Instagram",
    tag: "Casual",
    tagClass: "bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900/50",
    sample:
      "One mindset shift that completely changed how I create ✨ Stop waiting for perfect — just ship it.",
    border: "border-pink-200/70 dark:border-pink-900/60",
  },
  {
    icon: <SiPeerlist className="text-green-700 dark:text-green-500" />,
    platform: "Peerlist",
    tag: "Technical",
    tagClass: "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50",
    sample:
      "Shipped a full feature in 2 days instead of 2 weeks. Breaking down exactly what changed in our process →",
    border: "border-green-200/70 dark:border-green-900/60",
  },
];

export const HowItWorks = () => (
  <section id="how-it-works" className="max-w-6xl mx-auto px-6 scroll-mt-24">

    {/* Header */}
    <div className="text-center mb-16">
      <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-widest uppercase mb-3">
        The process
      </h3>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
        Three steps to everywhere
      </h2>
      <p className="mt-4 text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
        No copy-pasting. No manual reformatting. One input, four platform-ready outputs — every time.
      </p>
    </div>

    {/* Steps */}
    <div className="grid md:grid-cols-3 gap-5 mb-14">
      {steps.map((step, i) => (
        <div
          key={i}
          className="relative p-8 rounded-3xl
            border border-neutral-200 dark:border-neutral-800
            bg-white dark:bg-neutral-900/50
            hover:border-blue-400/50 dark:hover:border-blue-700/50
            hover:-translate-y-1 transition-all duration-300"
        >
          {/* Large background number */}
          <span className="absolute top-5 right-6 text-6xl font-black leading-none select-none
            text-neutral-100 dark:text-neutral-800">
            {step.number}
          </span>
          <div className="relative z-10">
            <div className="mb-5 inline-flex p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              {step.icon}
            </div>
            <h3 className="text-lg font-bold mb-2 text-neutral-900 dark:text-white">{step.title}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{step.description}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Output preview panel */}
    <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800
      bg-neutral-50 dark:bg-neutral-900/30 p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Same idea →
        </span>
        <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          4 platform outputs
        </span>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {outputs.map(({ icon, platform, tag, tagClass, sample, border }, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl bg-white dark:bg-neutral-900 border ${border} flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{icon}</span>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">{platform}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagClass}`}>{tag}</span>
            </div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic flex-1">
              "{sample}"
            </p>
          </div>
        ))}
      </div>
    </div>

  </section>
);