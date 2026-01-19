'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { ModeToggle } from './ModeToggle';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils"; // Ensure you have this utility or replace with standard template literals

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Generator', href: '/generate' },
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled 
          ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl border-neutral-200/50 dark:border-neutral-800/50 py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          
          {/* LOGO AREA */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Post<span className="text-blue-600">Genius</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-bold leading-none">
                  Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Left Aligned for SaaS feel */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:text-blue-600 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:block ">
               <ModeToggle />
            </div>

           

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
               <ModeToggle />
               <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* MOBILE OVERLAY MENU */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300 md:hidden shadow-2xl">
            <div className="space-y-1">
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
           
          </div>
        )}
      </div>
    </header>
  );
}