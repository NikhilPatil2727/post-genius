'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

export function Navbar() {
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
    { name: 'Learn More', href: '/learn-more' },
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
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Post<span className="text-blue-600">Bloom</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-bold leading-none">
                  Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
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
            <ModeToggle />
            
            <SignedIn>
              <UserButton 

                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9"
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium hover:bg-white/20 dark:hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button
                    size="sm"
                    className="text-sm font-medium bg-[#41B313] hover:bg-[#369611] text-white"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
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
            
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <SignedOut>
                <div className="flex flex-col gap-3 px-2">
                  <SignInButton>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-center text-sm font-medium hover:bg-neutral-100 dark:hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button className="w-full bg-[#41B313] hover:bg-[#369611] text-white py-5 rounded-xl text-sm font-bold shadow-md">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-medium">Account</span>
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
