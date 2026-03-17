"use client";
import React from "react";
import Link from "next/link";
import { BackgroundLines } from "@/components/ui/background-lines";
import { NoiseBackground } from "@/components/ui/noise-background";
import { FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { SiPeerlist } from "react-icons/si";
import { Users, Clock, Zap } from "lucide-react";

export const Hero = ({ user }: any) => (
  <BackgroundLines className="flex min-h-[48rem] h-auto py-28 md:py-36 items-center justify-center flex-col px-6 text-center bg-transparent">

    {/* ── NEW: social proof pill ── */}
    <div className="relative z-20 mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full
      bg-blue-50 dark:bg-blue-950/50
      border border-blue-200 dark:border-blue-800/60
      text-blue-700 dark:text-blue-300
      text-xs font-semibold tracking-wide">
      <Users className="h-3.5 w-3.5" />
      10+ creators · 10+ hrs saved every week
    </div>

    {/* ── ORIGINAL: unchanged below ── */}
    <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-700 dark:from-neutral-100 dark:via-white dark:to-neutral-400 text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter relative z-20">
      Post<span className="text-blue-600">Bloom</span>
    </h1>

    <h2 className="max-w-2xl mt-8 text-xl md:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 relative z-20">
      Create Once, Publish Everywhere
    </h2>

    <p className="max-w-2xl mt-6 text-base md:text-xl text-neutral-600 dark:text-neutral-400 relative z-20 leading-relaxed font-medium">
      Generate content for{" "}
      <span className="font-bold text-neutral-900 dark:text-white border-b-2 border-blue-600/30">
        Instagram, Twitter, LinkedIn, and Peerlist
      </span>{" "}
      in one click.
    </p>

    <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4 flex-wrap relative z-20">
      <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-white/10 text-sm font-semibold shadow-sm">
        <FaLinkedin className="text-[#0A66C2]" /> LinkedIn
      </span>
      <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-white/10 text-sm font-semibold shadow-sm">
        <FaXTwitter className="text-black dark:text-white" /> Twitter
      </span>
      <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-white/10 text-sm font-semibold shadow-sm">
        <FaInstagram className="text-pink-500" /> Instagram
      </span>
      <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-white/10 text-sm font-semibold shadow-sm">
        <SiPeerlist className="text-green-700" /> Peerlist
      </span>
    </div>

    {/* ── ORIGINAL: CTA buttons — zero changes ── */}
    <div className="mt-12 flex gap-4 justify-center flex-wrap relative z-20">
      <Link href="/admin/generate">
        {user && user.firstName && (
          <NoiseBackground
            containerClassName="w-fit p-2 rounded-full mx-auto"
            gradientColors={["rgb(255, 100, 150)", "rgb(100, 150, 255)", "rgb(255, 200, 100)"]}
          >
            <button className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-8 py-3 text-black shadow-xl transition-all duration-100 active:scale-95 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white font-bold">
              Generate Now
            </button>
          </NoiseBackground>
        )}
      </Link>
      <Link href="/learn-more">
        <button className="cursor-pointer h-[60px] w-[180px] px-8 py-3 text-sm font-bold rounded-full transition duration-200 backdrop-blur-md bg-white/40 dark:bg-white/5 text-black dark:text-white border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 shadow-lg">
          Learn More
        </button>
      </Link>
    </div>

    {/* ── NEW: trust stats strip ── */}
    <div className="mt-14 flex items-center justify-center gap-6 sm:gap-10 flex-wrap relative z-20">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-blue-500 shrink-0" />
        <span className="text-sm font-bold text-neutral-900 dark:text-white">10+</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">Active creators</span>
      </div>
      <span className="hidden sm:block w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
        <span className="text-sm font-bold text-neutral-900 dark:text-white">10 hrs</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">Saved per week</span>
      </div>
      <span className="hidden sm:block w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-500 shrink-0" />
        <span className="text-sm font-bold text-neutral-900 dark:text-white">4 platforms</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">In one click</span>
      </div>
    </div>

  </BackgroundLines>
);