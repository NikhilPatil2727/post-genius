"use client";
import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Suyash Patil",
    designation: ".NET Developer",
    image: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Nova",
  },
  {
    id: 2,
    name: "ROHAN T",
    designation: "software engineer",
    image: "https://api.dicebear.com/9.x/shapes/svg?seed=Pixel",
  },
  {
    id: 3,
    name: "Nilesh Kadam",
    designation: "frontend developer",
    image: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Orbit",
  },
  {
    id: 4,
    name: "Abhishek Mule",
    designation: "software engineer",
    image: "https://api.dicebear.com/9.x/shapes/svg?seed=Comet",
  },
  {
    id: 5,
    name: "Siddhanth Keste",
    designation: "software engineer",
    image: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Flux",
  },
  {
    id: 6,
    name: "Sachin Jalakoti",
    designation: "AI engineer",
    image: "https://api.dicebear.com/9.x/shapes/svg?seed=Prism",
  },
];

export function AnimatedTooltipPreview() {
  return (
    <div className="mb-10 flex w-full flex-row items-center justify-center">
      <AnimatedTooltip items={people} />
    </div>
  );
}

export default AnimatedTooltipPreview;
