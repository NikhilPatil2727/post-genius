import React from "react";
import { FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { SiPeerlist } from "react-icons/si";
import { Check } from "lucide-react";

const platforms = [
  {
    icon: <FaLinkedin className="text-[#0A66C2] h-5 w-5" />,
    name: "LinkedIn",
    description: "Long-form storytelling with professional hooks, line breaks, and CTAs that drive comments.",
    rules: ["Story-first format", "Hook in line 1", "3–5 short paragraphs", "Soft CTA at the end"],
    accent: "border-blue-200 dark:border-blue-900/60",
    badge: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300",
  },
  {
    icon: <FaXTwitter className="text-neutral-900 dark:text-white h-5 w-5" />,
    name: "Twitter / X",
    description: "Punchy, opinionated takes — under 280 characters or structured as a thread when needed.",
    rules: ["Under 280 chars", "Thread option", "Opinion-led opening", "Minimal hashtags"],
    accent: "border-neutral-200 dark:border-neutral-800",
    badge: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300",
  },
  {
    icon: <FaInstagram className="text-pink-500 h-5 w-5" />,
    name: "Instagram",
    description: "Caption-optimised copy with emojis, line breaks, and hashtag blocks that boost discoverability.",
    rules: ["Emoji-friendly tone", "Caption break structure", "Hashtag block included", "Conversational feel"],
    accent: "border-pink-200 dark:border-pink-900/60",
    badge: "bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300",
  },
  {
    icon: <SiPeerlist className="text-green-700 dark:text-green-500 h-5 w-5" />,
    name: "Peerlist",
    description: "Technical, builder-focused posts with project context and outcome framing for the dev community.",
    rules: ["Builder context first", "What you shipped + why", "Outcome-focused", "Dev-community tone"],
    accent: "border-green-200 dark:border-green-900/60",
    badge: "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400",
  },
];

export const PlatformDeepDive = () => (
  <section id="platforms" className="max-w-6xl mx-auto px-6 scroll-mt-24">

    <div className="text-center mb-16">
      <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-widest uppercase mb-3">
        Platform intelligence
      </h3>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
        Knows the rules of every platform
      </h2>
      <p className="mt-4 text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
        Each platform has its own format, tone, and algorithm logic. PostBloom knows all of them — so you don't have to.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      {platforms.map(({ icon, name, description, rules, accent, badge }, i) => (
        <div
          key={i}
          className={`p-8 rounded-3xl border ${accent}
            bg-white dark:bg-neutral-900/50
            hover:-translate-y-1 transition-all duration-300`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              {icon}
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge}`}>{name}</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-5">
            {description}
          </p>
          <ul className="space-y-2">
            {rules.map((rule, r) => (
              <li key={r} className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

  </section>
);