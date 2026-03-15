"use client";
import React from "react";
import Link from "next/link";
import { BackgroundLines } from "@/components/ui/background-lines";
import { NoiseBackground } from "@/components/ui/noise-background";
import { FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { SiPeerlist } from "react-icons/si";


export const Hero = ({user,profile}:any) => (
  <BackgroundLines className="flex min-h-[42rem] h-auto py-24 md:py-32 items-center justify-center flex-col px-6 text-center bg-transparent">
    <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-700 dark:from-neutral-100 dark:via-white dark:to-neutral-400 text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter relative z-20">
      Post<span className="text-blue-600">Bloom</span>
    </h1>

    <h2 className="max-w-2xl mt-8 text-xl md:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 relative z-20">
      Create Once, Publish Everywhere
    </h2>

    <p className="max-w-2xl mt-6 text-base md:text-xl text-neutral-600 dark:text-neutral-400 relative z-20 leading-relaxed font-medium">
      Generate content for <span className="font-bold text-neutral-900 dark:text-white border-b-2 border-blue-600/30">Instagram, Twitter, LinkedIn, and Peerlist</span> in one click.
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

    <div className="mt-12 flex gap-4 justify-center flex-wrap relative z-20">
      <Link href="/admin/generate">
        {user.success && profile.firstName &&(
          <NoiseBackground containerClassName="w-fit p-2 rounded-full mx-auto" gradientColors={["rgb(255, 100, 150)", "rgb(100, 150, 255)", "rgb(255, 200, 100)"]}>
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
  </BackgroundLines>
);