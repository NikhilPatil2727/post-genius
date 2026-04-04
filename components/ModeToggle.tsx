'use client';

import * as React from 'react';
import { Sun } from 'lucide-react';
import { Button } from './ui/button';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';

export function ModeToggle() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <AnimatedThemeToggler
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background text-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label="Toggle theme"
    />
  );
}
