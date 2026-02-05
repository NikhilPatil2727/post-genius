"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Sparkles, Zap, Shield, Globe, Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { NoiseBackground } from "@/components/ui/noise-background";
import { FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { SiPeerlist } from "react-icons/si";

export default function Home() {
  const features = [
    {
      icon: <Sparkles className="h-5 w-5 text-blue-500" />,
      title: "AI-Powered Writing",
      description:
        "Generate high-quality content tailored for each social platform automatically.",
      gradient: "from-blue-500/10 to-transparent",
    },
    {
      icon: <Layers className="h-5 w-5 text-purple-500" />,
      title: "Cross-Platform Sync",
      description:
        "Write once and get optimized posts for LinkedIn, X, Instagram, and Peerlist.",
      gradient: "from-purple-500/10 to-transparent",
    },
    {
      icon: <Shield className="h-5 w-5 text-emerald-500" />,
      title: "Human-Like Tone",
      description: "Content that feels natural, engaging, and never robotic.",
      gradient: "from-emerald-500/10 to-transparent",
    },
    {
      icon: <Globe className="h-5 w-5 text-pink-500" />,
      title: "Platform Optimized",
      description: "Perfect length, tone, and structure for each platform.",
      gradient: "from-pink-500/10 to-transparent",
    },
  ];

  return (
    <div className="space-y-32 pb-20">
      {/* HERO */}
      <BackgroundLines className="flex min-h-[42rem] items-center justify-center flex-col px-6 text-center">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-300 dark:to-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight relative z-20">
          Post<span className="text-blue-600">Genius</span>
        </h1>

        <p className="max-w-2xl mt-6 text-base md:text-lg text-neutral-700 dark:text-neutral-400 relative z-20">
          The easiest way to create platform-specific content for
        </p>

        <div className="mt-4 flex items-center justify-center gap-4 flex-wrap relative z-20">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm font-medium">
            <FaLinkedin className="text-[#0A66C2]" />
            LinkedIn
          </span>

          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm font-medium">
            <FaXTwitter className="text-black dark:text-white" />
          </span>

          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm font-medium">
            <FaInstagram className="text-pink-500" />
            Instagram
          </span>

          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm font-medium">
            <SiPeerlist className="text-green-700" />
            Peerlist
          </span>
        </div>

        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          — without rewriting again and again.
        </p>

        <div className="mt-10 flex gap-4 justify-center flex-wrap relative z-20">
          <Link href="/generate">
            <NoiseBackground
              containerClassName="w-fit p-2 rounded-full mx-auto"
              gradientColors={[
                "rgb(255, 100, 150)",
                "rgb(100, 150, 255)",
                "rgb(255, 200, 100)",
              ]}
            >
              <button className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-6 py-2 text-black shadow-lg transition-all duration-100 active:scale-95 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white">
                Generate Now
              </button>
            </NoiseBackground>
          </Link>
          
          <Link href="/learn-more" >
            <button
              className="cursor-pointer h-[55px] w-[150px] px-6 py-2 text-sm rounded-full transition duration-200 backdrop-blur-sm bg-black/5 text-black border border-black/10 hover:bg-black/10 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10"
            >
              Learn More
            </button>
          </Link>
          
        </div>
      </BackgroundLines>

      {/* ABOUT PRODUCT */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight text-neutral-900 dark:text-neutral-100">
          Stop wasting hours on formatting.
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed font-light italic">
          LinkedIn needs depth, X needs brevity, Instagram needs engagement, and Peerlist needs clarity.
          <br /><br />
          <span className="font-semibold text-neutral-900 dark:text-white not-italic text-xl block">
            PostGenius automates the artistry of platform-specific writing.
          </span>
        </p>
      </section>

      {/* PREMIUM FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-blue-600 font-semibold text-sm tracking-widest uppercase mb-3">Capabilities</h3>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Built for modern creators</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl bg-gradient-to-br ${feature.gradient}`} />
              
              <div className="relative z-10">
                <div className="mb-4 inline-flex p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white leading-tight">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-serif">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PREMIUM HOW IT WORKS */}
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

      {/* FINAL CTA */}
      <section className="text-center px-6 pb-24">
        <Card className="max-w-3xl mx-auto rounded-[2rem] border-none shadow-2xl bg-linear-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-black border border-neutral-200 dark:border-neutral-800">
          <CardContent className="py-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Ready to automate your growth?
            </h3>

            <p className="text-neutral-600 dark:text-neutral-400 mb-10 text-lg max-w-sm mx-auto leading-relaxed">
              Join 500+ creators and marketers saving 10+ hours every week.
            </p>

            <Link href="/generate">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700">
                <Zap className="mr-2 h-5 w-5 fill-white" />
                Start Creating Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}