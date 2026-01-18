import { Linkedin, Twitter, Instagram, Users } from 'lucide-react';
import { Platform } from '@/types';

interface PlatformIconsProps {
  platform: Platform;
  className?: string;
}

export function PlatformIcons({ platform, className = "h-6 w-6" }: PlatformIconsProps) {
  switch (platform) {
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'twitter':
      return <Twitter className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'peerlist':
      return <Users className={className} />;
    default:
      return null;
  }
}