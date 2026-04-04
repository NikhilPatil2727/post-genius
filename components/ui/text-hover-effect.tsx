"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 520 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none overflow-visible", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          <stop offset="0%" stopColor={hovered ? "#2563eb" : "#64748b"} />
          <stop offset="35%" stopColor={hovered ? "#0f172a" : "#94a3b8"} />
          <stop offset="65%" stopColor={hovered ? "#22c55e" : "#cbd5e1"} />
          <stop offset="100%" stopColor={hovered ? "#38bdf8" : "#e2e8f0"} />
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="24%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.65"
        className="fill-transparent stroke-slate-300 font-sans text-[2.35rem] font-black uppercase tracking-[0.08em] sm:text-[3.4rem] md:text-[4.7rem] lg:text-[5.8rem] dark:stroke-white/18"
        style={{ opacity: hovered ? 0.42 : 0.72 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.9"
        className="fill-transparent stroke-slate-400/80 font-sans text-[2.35rem] font-black uppercase tracking-[0.08em] sm:text-[3.4rem] md:text-[4.7rem] lg:text-[5.8rem] dark:stroke-white/28"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
          opacity: hovered ? 0.9 : 0.52,
        }}
        transition={{
          duration: 3.2,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="1.2"
        mask="url(#textMask)"
        className="fill-transparent font-sans text-[2.35rem] font-black uppercase tracking-[0.08em] sm:text-[3.4rem] md:text-[4.7rem] lg:text-[5.8rem]"
        style={{ opacity: hovered ? 1 : 0.38 }}
      >
        {text}
      </text>
    </svg>
  );
};
