"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  muted?: boolean;
  featured?: boolean;
};

type PricingSectionProps = {
  pricing: PricingPlan[];
  primaryHref: string;
};

export function PricingSection({ pricing, primaryHref }: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");

  const plans = useMemo(
    () =>
      pricing.map((plan) => {
        if (plan.name === "Pro") {
          return {
            ...plan,
            displayPrice: billingPeriod === "monthly" ? "$12" : "$10",
            billingLabel: billingPeriod === "monthly" ? "/month" : "/month billed yearly",
          };
        }

        if (plan.name === "Free") {
          return {
            ...plan,
            displayPrice: "$0",
            billingLabel: billingPeriod === "monthly" ? "/month" : "/month",
          };
        }

        return {
          ...plan,
          displayPrice: "Custom",
          billingLabel: "",
        };
      }),
    [billingPeriod, pricing]
  );

  const handleUnavailablePlan = (planName: string) => {
    toast.info(`${planName} is not implemented right now.`);
  };

  return (
    <section
      id="pricing"
      className="scroll-mt-28 relative overflow-hidden border-t border-slate-200 bg-[linear-gradient(180deg,#eef3fb_0%,#e7edf9_100%)] dark:border-white/6 dark:bg-[linear-gradient(180deg,#06070d_0%,#090b12_100%)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(132,155,205,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(132,155,205,0.12)_1px,transparent_1px)] bg-[size:76px_76px] opacity-45 dark:bg-[linear-gradient(rgba(111,141,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(111,141,255,0.12)_1px,transparent_1px)] dark:opacity-30" />
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(111,141,255,0.22),transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(111,141,255,0.18),transparent_68%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-4 rounded-full border border-slate-300/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:text-white/82">
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={billingPeriod === "monthly" ? "cursor-pointer text-slate-950 dark:text-white" : "cursor-pointer text-slate-500 dark:text-white/55"}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-label="Toggle billing period"
              onClick={() =>
                setBillingPeriod((current) => (current === "monthly" ? "annually" : "monthly"))
              }
              className="relative inline-flex h-9 w-20 cursor-pointer items-center rounded-full border border-[#86a6ff]/40 bg-[linear-gradient(180deg,#8fb0ff_0%,#6f8dff_100%)] px-1 shadow-[0_0_24px_rgba(111,141,255,0.28)] dark:bg-[linear-gradient(180deg,#7c9cff_0%,#5d7fff_100%)] dark:shadow-[0_0_24px_rgba(111,141,255,0.35)]"
            >
              <span
                className={`block h-7 w-7 rounded-full bg-white shadow-[0_4px_18px_rgba(8,18,36,0.28)] transition-transform duration-300 ${
                  billingPeriod === "annually" ? "translate-x-11" : "translate-x-0"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("annually")}
              className={billingPeriod === "annually" ? "cursor-pointer text-slate-950 dark:text-white" : "cursor-pointer text-slate-500 dark:text-white/55"}
            >
              Annually
            </button>
            <span className="rounded-full border border-[#93aeff]/35 bg-[#dce7ff]/70 px-3 py-1 text-xs font-semibold text-[#3555b6] dark:bg-[#7b98ff]/10 dark:text-[#c7d6ff]">
              Save up to 20%
            </span>
          </div>

          <h2 className="font-display mt-6 text-3xl font-black tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
            Pricing That Feels
            <br />
            Ready To Scale
          </h2>
        </div>

        <div className="mt-14 grid gap-7 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={[
                "relative flex min-h-[42rem] flex-col rounded-[2rem] border p-8",
                plan.featured
                  ? "border-[#8babff]/60 bg-[linear-gradient(180deg,rgba(228,237,255,0.98),rgba(215,227,255,0.98)_24%,rgba(195,214,255,0.94)_100%)] shadow-[0_0_0_1px_rgba(130,160,255,0.2),0_28px_80px_rgba(84,118,225,0.18)] dark:border-[#7a9bff]/45 dark:bg-[linear-gradient(180deg,rgba(65,91,190,0.30),rgba(18,24,44,0.97)_28%,rgba(8,10,18,0.99)_100%)] dark:shadow-[0_0_0_1px_rgba(130,160,255,0.2),0_28px_90px_rgba(8,12,24,0.55)]"
                  : "border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,247,255,0.94))] shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(14,17,28,0.98),rgba(8,10,18,0.96))] dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.45)]",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(129,158,255,0.18),transparent_42%)] dark:bg-[radial-gradient(circle_at_top,rgba(129,158,255,0.16),transparent_42%)]" />
              {plan.featured ? (
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(rgba(150,176,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(150,176,255,0.16)_1px,transparent_1px)] bg-[size:52px_52px] opacity-45 dark:bg-[linear-gradient(rgba(164,187,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(164,187,255,0.08)_1px,transparent_1px)] dark:opacity-60" />
              ) : null}

              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#bfd0ff] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(223,234,255,0.92))] shadow-[0_10px_24px_rgba(111,141,255,0.14)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(138,170,255,0.28),rgba(78,110,220,0.18))] dark:shadow-[0_10px_24px_rgba(111,141,255,0.18)]">
                <div className="h-5 w-5 rounded-md border border-[#7f9fff] bg-[#dfe8ff] dark:border-white/70 dark:bg-white/10" />
              </div>

              <div className="relative z-10 mt-7">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-3xl font-bold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-4xl">
                      {plan.name === "Free" ? "Basic" : plan.name === "Team" ? "Enterprise" : plan.name}
                    </h3>
                    {plan.featured ? (
                      <span className="rounded-full border border-[#93aeff]/40 bg-[#7d9cff]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#4b6bd7] dark:text-[#dbe5ff]">
                        Most Popular
                      </span>
                    ) : null}
                  </div>

                <p className="mt-5 max-w-sm text-lg leading-9 text-slate-600 dark:text-[#9eaacc]">
                  {plan.name === "Free"
                    ? "Perfect for creators testing the workflow and publishing across core channels."
                    : plan.name === "Team"
                      ? "For teams that need a custom workflow, brand control, and collaborative publishing."
                      : "Ideal for active creators who need faster generation, stronger tone control, and all platforms."}
                </p>
              </div>

              <div className="relative z-10 mt-12 flex items-end gap-2">
                <span className="text-6xl font-black tracking-[-0.08em] text-slate-950 dark:text-white">
                  {plan.displayPrice}
                </span>
                {plan.billingLabel ? (
                  <span className="pb-2 text-xl text-slate-500 dark:text-[#9eaacc]">{plan.billingLabel}</span>
                ) : null}
              </div>

              <div className="relative z-10 mt-12">
                <p className="text-2xl font-semibold text-slate-950 dark:text-white">Features:</p>

                <ul className="mt-8 space-y-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-4 text-lg leading-8 text-slate-700 dark:text-[#c7d1ec]">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#7b98ff]/35 bg-[#7b98ff]/10 dark:border-[#7b98ff]/35 dark:bg-[#7b98ff]/10">
                        <Check className="h-3.5 w-3.5 text-[#6f8dff] dark:text-[#9db6ff]" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.name === "Free" ? (
                <Link
                  href={primaryHref}
                  className="relative z-10 mt-auto inline-flex w-full items-center justify-center rounded-full border border-[#88a5ff] bg-white/70 px-6 py-4 text-lg font-semibold text-[#2947a8] transition-all duration-200 hover:bg-white dark:border-[#6c87d9] dark:bg-transparent dark:text-white dark:hover:bg-[#7b98ff]/10"
                >
                  Get Started
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleUnavailablePlan(plan.name)}
                  className={[
                    "relative z-10 mt-auto inline-flex w-full items-center justify-center rounded-full border px-6 py-4 text-lg font-semibold transition-all duration-200",
                    plan.featured
                      ? "border-[#9db6ff]/55 bg-[linear-gradient(180deg,#9bb6ff_0%,#6f8dff_100%)] text-[#06111f] shadow-[0_0_0_2px_rgba(157,182,255,0.14),0_12px_36px_rgba(83,112,220,0.28)] hover:brightness-105"
                      : "border-[#88a5ff] bg-white/70 text-[#2947a8] hover:bg-white dark:border-[#6c87d9] dark:bg-transparent dark:text-white dark:hover:bg-[#7b98ff]/10",
                  ].join(" ")}
                >
                  {plan.name === "Team" ? "Contact Sales" : "Get Started"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
