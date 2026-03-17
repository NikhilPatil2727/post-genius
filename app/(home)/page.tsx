import { Hero } from "@/modules/home/components/Hero";
import { HowItWorks } from "@/modules/home/components/Howitworks";
import { Features } from "@/modules/home/components/Features";
import { PlatformDeepDive } from "@/modules/home/components/Platformdeepdive";
import { Zap, Users, Clock } from "lucide-react";
import { onboardUser } from "@/modules/auth/actions";
import { CurrentUserName } from "@/modules/profile/actions";

export default async function HomePage() {
  const onboardResult = await onboardUser();
  const user = onboardResult.success ? onboardResult.user : null;

  return (
    <div className="space-y-32 pb-20">

      {/* 1. Hero */}
      <Hero user={user} />

      {/* 2. How it works — new */}
      <HowItWorks />

      {/* 3. Platform deep-dive — new */}
      <PlatformDeepDive />

      {/* 4. Features — expanded */}
      <Features />

      {/* 5. About / quote — original, unchanged */}
      <section className="group max-w-4xl mx-auto px-10 py-20 text-center rounded-[3rem] border border-white/40 dark:border-white/10 shadow-2xl relative overflow-hidden bg-transparent transition-all duration-500">
        {/* Glass effect layer */}
        <div className="absolute inset-0 bg-white/40 dark:bg-neutral-900/30 backdrop-blur-2xl -z-10" />
        {/* Subtle inner gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent dark:from-white/5 dark:to-transparent -z-10" />
        {/* Radial gradient layer matching the page background - kept for color continuity */}
        <div className="absolute inset-0 bg-[var(--page-background)] opacity-20 dark:opacity-40 -z-20" />

        <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-600 dark:from-white dark:via-white dark:to-white/40">
          Stop wasting hours on formatting.
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-xl md:text-2xl font-medium italic leading-relaxed max-w-2xl mx-auto">
          "PostBloom automates the artistry of platform-specific writing."
        </p>
      </section>

      {/* 6. Final CTA — enhanced with stats row */}
      <section className="text-center px-6 pb-24">

        {/* Stats row */}
        <div className="flex items-center justify-center gap-10 sm:gap-16 flex-wrap mb-14">
          {[
            { value: "10+", label: "Active creators", icon: <Users className="h-5 w-5 text-blue-500" /> },
            { value: "10 hrs", label: "Saved per week", icon: <Clock className="h-5 w-5 text-emerald-500" /> },
            { value: "4×", label: "Platform reach", icon: <Zap className="h-5 w-5 text-amber-500" /> },
          ].map(({ value, label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                {icon}
                <span className="text-4xl font-black text-neutral-900 dark:text-white">{value}</span>
              </div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{label}</span>
            </div>
          ))}
        </div>

        <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
          Ready to automate your growth?
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mt-4 mb-8 max-w-sm mx-auto leading-relaxed">
          Join 10+ creators saving 10+ hours every week. Free to start.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-10 py-4 rounded-full font-bold flex items-center mx-auto gap-2 transition-all duration-150 shadow-lg shadow-blue-600/20">
          <Zap className="h-5 w-5" /> Start Creating Free
        </button>

        <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-4">
          No credit card required · Cancel anytime
        </p>

      </section>

    </div>
  );
}