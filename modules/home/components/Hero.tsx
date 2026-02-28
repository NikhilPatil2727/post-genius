import React from "react";
import Link from "next/link";
import { BackgroundLines } from "@/components/ui/background-lines";
import { NoiseBackground } from "@/components/ui/noise-background";
import { FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { SiPeerlist } from "react-icons/si";

export function Hero() {
  return (
    <BackgroundLines className="flex min-h-[42rem] items-center justify-center flex-col px-6 text-center">
      <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-300 dark:to-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight relative z-20">
        Post<span className="text-blue-600">Bloom</span>
      </h1>

      <h2 className="max-w-2xl mt-6 text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 relative z-20">
        Create Once, Publish Everywhere
      </h2>

      <p className="max-w-2xl mt-4 text-base md:text-lg text-neutral-600 dark:text-neutral-400 relative z-20 leading-relaxed">
        Generate content for <span className="font-medium text-neutral-800 dark:text-neutral-200">Instagram, Twitter, LinkedIn, and Peerlist</span> in one click. Save 80% of your content creation time.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4 flex-wrap relative z-20">
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-medium">
          <FaLinkedin className="text-[#0A66C2]" />
          LinkedIn
        </span>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-medium">
          <FaXTwitter className="text-black dark:text-white" />
           (Twitter)
        </span>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-medium">
          <FaInstagram className="text-pink-500" />
          Instagram
        </span>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-medium">
          <SiPeerlist className="text-green-700" />
          Peerlist
        </span>
      </div>

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
  );
}
