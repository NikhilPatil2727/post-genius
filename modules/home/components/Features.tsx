import React from "react";
import { Sparkles, Layers, Shield, Globe, Sliders, BarChart2 } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="h-5 w-5 text-blue-500" />,
    title: "AI-Powered Writing",
    description:
      "Generate high-quality, ready-to-post content tailored to each social platform automatically — no prompt engineering needed.",
    gradient: "from-blue-500/10 to-transparent",
  },
  {
    icon: <Layers className="h-5 w-5 text-purple-500" />,
    title: "Cross-Platform Sync",
    description:
      "Write once and instantly get optimized posts for LinkedIn, X, Instagram, and Peerlist — in a single generation.",
    gradient: "from-purple-500/10 to-transparent",
  },
  {
    icon: <Shield className="h-5 w-5 text-emerald-500" />,
    title: "Human-Like Tone",
    description:
      "Content that feels natural, engaging, and never robotic. Your voice, amplified — not replaced.",
    gradient: "from-emerald-500/10 to-transparent",
  },
  {
    icon: <Globe className="h-5 w-5 text-pink-500" />,
    title: "Platform Optimized",
    description:
      "Perfect character limits, hashtag density, hook structure, and posting format — specific to each platform's algorithm.",
    gradient: "from-pink-500/10 to-transparent",
  },
  {
    icon: <Sliders className="h-5 w-5 text-amber-500" />,
    title: "Tone Customization",
    description:
      "Switch between professional, casual, witty, or educational in one click. PostBloom adapts your voice to the context.",
    gradient: "from-amber-500/10 to-transparent",
  },
  {
    icon: <BarChart2 className="h-5 w-5 text-cyan-500" />,
    title: "Engagement-Ready",
    description:
      "Every output ships with built-in hooks, CTAs, and structural patterns proven to drive comments, saves, and shares.",
    gradient: "from-cyan-500/10 to-transparent",
  },
];

export const Features = () => (
  <section id="features" className="max-w-6xl mx-auto px-6 scroll-mt-24">

    <div className="text-center mb-16">
      <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-widest uppercase mb-3">
        Capabilities
      </h3>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
        Built for modern creators
      </h2>
      <p className="mt-4 text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
        Every feature is designed around one goal: more reach, less effort.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group relative p-8 rounded-3xl
            border border-neutral-200 dark:border-neutral-800
            bg-white dark:bg-neutral-900/50
            hover:border-blue-500/50 dark:hover:border-blue-700/50
            hover:-translate-y-1 transition-all duration-300"
        >
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl bg-gradient-to-br ${feature.gradient}`}
          />
          <div className="relative z-10">
            <div className="mb-4 inline-flex p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white leading-tight">
              {feature.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>

  </section>
);