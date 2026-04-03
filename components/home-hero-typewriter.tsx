"use client";

import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

const words = [
  { text: "Write" },
  { text: "Once." },
  { text: "Post" },
  {
    text: "Everywhere.",
    className: "text-[#6f8dff] dark:text-[#92a8ff]",
  },
];

export function HomeHeroTypewriter() {
  return (
    <TypewriterEffectSmooth
      words={words}
      className="mt-8 justify-center"
      textClassName="bg-[linear-gradient(180deg,#0f172a_0%,#334155_42%,#7c8aa3_100%)] bg-clip-text text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] text-transparent sm:text-6xl md:text-7xl lg:text-[5.75rem] dark:bg-[linear-gradient(180deg,#f8fbff_0%,#bcc7df_42%,#7c859d_100%)]"
      cursorClassName="h-9 w-[5px] bg-[#6f8dff] sm:h-11 md:h-14 lg:h-[4.75rem]"
    />
  );
}
