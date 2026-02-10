import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, Globe, Cpu } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Generator", href: "/generate" },
        { name: "Features", href: "/#features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Changelog", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Contact", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
    {
      title: "Social",
      links: [
        { name: "Twitter / X", href: "https://x.com" },
        { name: "LinkedIn", href: "https://linkedin.com" },
        { name: "Peerlist", href: "#" },
        { name: "GitHub", href: "https://github.com" },
      ],
    },
  ];

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/50 transition-colors duration-300">
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
             
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Post<span className="text-blue-600">Bloom</span>
              </span>
            </Link>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed text-sm mb-6">
              The world&apos;s most advanced AI content repurposing engine. 
              Turn one idea into a week of optimized social presence.
            </p>
            
            {/* Status Indicator */}
         
          </div>

          {/* Navigation Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              © {currentYear} PostBloom Labs Inc. Built with passion for creators.
            </p>
           
          </div>

          {/* Social Icons (Quick Access) */}
          <div className="flex items-center gap-5">
            <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}