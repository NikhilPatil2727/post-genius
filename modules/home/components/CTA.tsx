import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CTA() {
  return (
    <section className="text-center px-6 pb-24">
      <Card className="max-w-3xl mx-auto rounded-[2rem] shadow-2xl bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-black border border-neutral-200 dark:border-neutral-800">
        <CardContent className="py-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Ready to automate your growth?
          </h3>

          <p className="text-neutral-600 dark:text-neutral-400 mb-10 text-lg max-w-sm mx-auto leading-relaxed">
            Join 500+ creators and marketers saving 10+ hours every week.
          </p>

          <Link href="/generate">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700">
              <Zap className="mr-2 h-5 w-5 fill-white" />
              Start Creating Free
            </Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
