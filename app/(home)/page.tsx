"use client";

import React from "react";
import { Hero, Features, HowItWorks, CTA } from "@/modules/home/components";

export default function Home() {
  return (
    <div className="space-y-32 pb-20">
      <Hero />
      
      {/* ABOUT PRODUCT BRIEF */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight text-neutral-900 dark:text-neutral-100">
          Stop wasting hours on formatting.
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed font-light italic">
          LinkedIn needs depth, X needs brevity, Instagram needs engagement, and Peerlist needs clarity.
          <br /><br />
          <span className="font-semibold text-neutral-900 dark:text-white not-italic text-xl block">
            PostBloom automates the artistry of platform-specific writing.
          </span>
        </p>
      </section>

      <Features />
      <HowItWorks />
      <CTA />
    </div>
  );
}
