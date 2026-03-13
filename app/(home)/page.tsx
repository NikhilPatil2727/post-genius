import { Hero } from "@/modules/home/components/Hero";
import { Features } from "@/modules/home/components/Features";
import { Zap } from "lucide-react";
import { onboardUser } from "@/modules/auth/actions";
import { CurrentUserName } from "@/modules/profile/actions";

export default async function HomePage() {
  const user=await onboardUser();
  const profile=await CurrentUserName();
 
  return (
    <div className="space-y-32 pb-20">
      <Hero user={user} profile={profile} />

      {/* Shortened "About" inline for simplicity */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Stop wasting hours on formatting.</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg italic">
          PostBloom automates the artistry of platform-specific writing.
        </p>
      </section>

      <Features />

      {/* Final CTA could be moved to modules/home/components/CTA.tsx later */}
      <section className="text-center px-6 pb-24">
        <h3 className="text-3xl font-bold">Ready to automate your growth?</h3>
        <p className="text-muted-foreground mt-4 mb-8">Join 500+ creators saving 10+ hours every week.</p>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold flex items-center mx-auto gap-2">
          <Zap className="h-5 w-5" /> Start Creating Free
        </button>
      </section>
    </div>
  );
}