import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SocialSync
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Contact
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Copyright */}
          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            © {currentYear} SocialSync. All rights reserved.
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            Powered by Google Gemini AI. Generate better social media content.
          </p>
        </div>
      </div>
    </footer>
  );
}