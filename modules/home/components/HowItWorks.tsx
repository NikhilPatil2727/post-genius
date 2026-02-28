import React from "react";
import { Zap } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-6">
      <div className="bg-neutral-900 dark:bg-white text-white dark:text-black rounded-[2.5rem] p-8 md:p-16 overflow-hidden relative">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-blue-400 dark:text-blue-600 font-semibold text-sm tracking-widest uppercase mb-4">Process</h3>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">From raw idea to <br/> published post.</h2>
            <p className="text-neutral-400 dark:text-neutral-500 text-lg mb-8 max-w-md">
              Three simple steps to automate your social media presence without losing your voice.
            </p>
            
            <div className="space-y-6">
              {[
                { step: "01", title: "Input Content", desc: "Paste a blog link, a rough draft, or just a topic." },
                { step: "02", title: "AI Optimization", desc: "Our engine refines the tone for 4 different platforms." },
                { step: "03", title: "One-Click Copy", desc: "Review, refine, and post to your favorite networks." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-blue-400 font-mono text-sm mt-1">{item.step}</span>
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-neutral-400 dark:text-neutral-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[300px] md:h-[400px] rounded-2xl bg-neutral-800 dark:bg-neutral-100 border border-neutral-700 dark:border-neutral-200 p-4 shadow-2xl">
            {/* Visual mockup representation */}
            <div className="space-y-3">
              <div className="h-4 w-1/3 bg-blue-500/20 rounded-full animate-pulse" />
              <div className="h-24 w-full bg-neutral-700 dark:bg-neutral-200 rounded-xl" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 bg-neutral-700 dark:bg-neutral-200 rounded-xl" />
                <div className="h-20 bg-neutral-700 dark:bg-neutral-200 rounded-xl" />
              </div>
              <div className="h-24 w-full bg-neutral-700 dark:bg-neutral-200 rounded-xl" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-blue-600 p-4 rounded-2xl shadow-xl">
              <Zap className="text-white h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
