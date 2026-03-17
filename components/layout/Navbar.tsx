'use client';

import Link from "next/link";
import { Button } from "../ui/button";
import { ModeToggle } from "../ModeToggle";
import { Sparkles, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs"; // Clerk auth components

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Generator", href: "/admin/generate" },
    { name: "Features", href: "/#features" },
    { name: "Learn More", href: "/learn-more" },
  ];

  return (
    <header
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-300",
        "rounded-full border shadow-xl px-1",
        "bg-white/60 dark:bg-[rgba(20,20,20,0.6)] backdrop-blur-[12px]",
        "border-white/30 dark:border-white/10",
        scrolled ? "py-2" : "py-3"
      )}
    >
      <div className="mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform active:scale-95"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
                  Post<span className="text-blue-600">Bloom</span>
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-500 font-bold leading-none">
                  Intelligence
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:text-blue-600 dark:hover:text-white rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Authentication Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            <nav className="hidden md:flex lg:hidden items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:text-blue-600 dark:hover:text-white rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <ModeToggle />

            {/* Show when user is signed in */}
            <SignedIn>
              <UserButton />
            </SignedIn>

            {/* Show when user is signed out */}
            <SignedOut>
              <SignInButton>
                <Button variant="outline" size="sm" className="hidden sm:flex rounded-full">Sign In</Button>
              </SignInButton>
            </SignedOut>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 p-6 rounded-3xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300 md:hidden shadow-2xl">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-lg font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}