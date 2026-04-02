"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";

type Person = {
  id: number;
  name: string;
  designation: string;
  image: string;
};

const people: Person[] = [
  {
    id: 1,
    name: "Aarav Shah",
    designation: "Founder",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Mira Sen",
    designation: "Creator",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Rohan Malik",
    designation: "Marketing Lead",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Indie Hacker",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "Growth Operator",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80",
  },
];

export const TestimonialTooltip = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 7 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-18, 18]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-14, 14]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div className="flex flex-row items-center justify-start">
      {people.map((person) => (
        <div
          className="-mr-3 relative"
          key={person.id}
          onMouseEnter={() => setHoveredIndex(person.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="wait">
            {hoveredIndex === person.id && (
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.92 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 260, damping: 15 },
                }}
                exit={{ opacity: 0, y: 12, scale: 0.92 }}
                style={{ translateX, rotate, whiteSpace: "nowrap" }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center rounded-2xl border border-slate-200 bg-slate-950 px-4 py-2 text-xs shadow-xl dark:border-white/10 dark:bg-white"
              >
                <div className="font-semibold text-white dark:text-slate-950">{person.name}</div>
                <div className="text-white/70 dark:text-slate-600">{person.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Using img here avoids extra Next image config for remote avatar sources. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            onMouseMove={handleMouseMove}
            height={56}
            width={56}
            src={person.image}
            alt={person.name}
            className="relative h-12 w-12 rounded-full border-2 border-white object-cover object-top shadow-[0_10px_20px_rgba(15,23,42,0.12)] transition duration-300 hover:z-20 hover:scale-105 dark:border-[#0f172a]"
          />
        </div>
      ))}
    </div>
  );
};


