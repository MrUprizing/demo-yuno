"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createChat } from "@/lib/create-mv";
import { ArrowRight, Sparkles } from "lucide-react";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import Beams from "@/components/hero-bg";
import type { Variants } from "motion/react";

const transitionVariants: { item?: Variants; container?: Variants } = {
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};

export default function StartAICheckout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const name = "my-app";

  async function handleClick() {
    setLoading(true);
    const { repoId } = await createChat(name);
    router.push(`/ai/${repoId}`);
  }

  return (
    <main className="overflow-hidden">
      <section className="relative">
        {/* Background beams */}
        <div className="absolute inset-0 -z-20">
          <Beams
            beamWidth={2}
            beamHeight={50}
            beamNumber={8}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.6}
            scale={0.25}
            rotation={25}
          />
        </div>

        <div className="relative pt-28 md:pt-36 pb-32">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 dark:bg-background/40"
          />

          <div className="mx-auto max-w-5xl px-6 text-center">
            <AnimatedGroup variants={transitionVariants}>
              {/* Badge */}
              <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border bg-muted px-4 py-1 text-sm shadow-sm">
                <Sparkles className="size-4 text-primary" />
                AI Checkout Builder
              </div>
            </AnimatedGroup>

            <TextEffect
              as="h1"
              preset="fade-in-blur"
              speedSegment={0.3}
              className="mx-auto max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl"
            >
              Build your checkout using AI
            </TextEffect>
            <span className="block bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent text-5xl max-md:font-semibold md:text-7xl">
              using AI
            </span>

            <TextEffect
              as="p"
              per="line"
              delay={0.5}
              preset="fade-in-blur"
              className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground"
            >
              Generate a fully customizable checkout in seconds.  
              Let AI handle layout, fields, branding and payment logic.
            </TextEffect>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.9,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              {/* Primary CTA */}
              <div className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                <Button
                  size="lg"
                  className="rounded-xl px-8 text-base gap-2"
                  onClick={handleClick}
                  disabled={loading}
                >
                  {loading ? "Creating your checkout..." : "Start with AI"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>

              {/* Secondary */}
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-xl px-6"
              >
                <Link href="/docs">
                  Learn how it works
                </Link>
              </Button>
            </AnimatedGroup>
          </div>
        </div>
      </section>
    </main>
  );
}
