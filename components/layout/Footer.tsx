import Link from "next/link";
import { Instagram, Linkedin, Twitter } from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/#features" },
      { name: "Generator", href: "/admin/generate" },
      { name: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/learn-more" },
      { name: "Contact", href: "/learn-more" },
      { name: "Careers", href: "/learn-more" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/learn-more" },
      { name: "Terms of Service", href: "/learn-more" },
      { name: "Cookie Policy", href: "/learn-more" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-[#f5f7fb] text-slate-950 dark:border-white/6 dark:bg-[#07090f] dark:text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <div className="inline-flex text-sm font-black tracking-[-0.04em] text-slate-950 dark:text-white">
              Post<span className="text-[#6f8dff] dark:text-[#a9bfff]">Bloom</span>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-white/52">
              Turn one rough thought into polished social content built for modern distribution.
            </p>
            <div className="mt-6 flex items-center gap-4 text-slate-500 dark:text-white/50">
              <Link href="https://x.com" className="transition-colors hover:text-slate-950 dark:hover:text-white">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="https://linkedin.com" className="transition-colors hover:text-slate-950 dark:hover:text-white">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="https://instagram.com" className="transition-colors hover:text-slate-950 dark:hover:text-white">
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-white/38">
                {section.title}
              </h3>
              <div className="mt-5 flex flex-col gap-3">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-slate-950 dark:text-white/62 dark:hover:text-white"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 dark:border-white/6 dark:text-white/36 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} PostBloom. All rights reserved.</p>
          <p>Built for fast, consistent publishing.</p>
        </div>
      </div>
    </footer>
  );
}
