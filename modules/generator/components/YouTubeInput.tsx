'use client';

import { AlertCircle, Youtube } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type YouTubeInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string | null;
};

export function YouTubeInput({
  value,
  onChange,
  disabled = false,
  error,
}: YouTubeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="youtubeUrl" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        YouTube URL
      </Label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
          <Youtube className="h-4 w-4" />
        </div>
        <Input
          id="youtubeUrl"
          placeholder="https://youtube.com/watch?v=..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className={cn(
            'h-10 pl-9 text-sm bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary shadow-inner',
            error ? 'border-red-300 focus-visible:ring-red-300 dark:border-red-800' : ''
          )}
        />
      </div>
      {error ? (
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-red-500">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
