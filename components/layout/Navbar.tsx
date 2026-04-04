'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "../ModeToggle";
import { SparklesText } from "../ui/sparkles-text";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/#faq" },
  { name: "Learn More", href: "/learn-more" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-3 z-50 mx-auto w-[min(92%,980px)] rounded-2xl border transition-all duration-300",
        "border-slate-200/70 bg-[#f6f8fc] dark:border-white/8 dark:bg-[#07090f]",
        scrolled
          ? "shadow-[0_14px_60px_rgba(15,23,42,0.16)] dark:shadow-[0_14px_60px_rgba(0,0,0,0.36)]"
          : "shadow-[0_6px_24px_rgba(15,23,42,0.08)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.18)]"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <SparklesText
            sparklesCount={6}
            colors={{ first: "#6f8dff", second: "#a9bfff" }}
            className="text-sm font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-base"
          >
            Post<span className="text-[#6f8dff] dark:text-[#a9bfff]">Bloom</span>
          </SparklesText>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-white/62 dark:hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton>
              <Button
                variant="ghost"
                className="hidden rounded-xl border border-slate-200 bg-slate-100 px-4 text-slate-700 hover:bg-slate-200 hover:text-slate-950 dark:border-white/10 dark:bg-white/4 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white sm:inline-flex"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <ModeToggle />

          <SignedIn>
            <UserButton />
          </SignedIn>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-800 dark:border-white/10 dark:bg-white/4 dark:text-white lg:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-slate-200 px-4 py-4 dark:border-white/8 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-white/75 dark:hover:bg-white/6 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
