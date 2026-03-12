"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import DashboardCard from "./DashboardCard";

export default function DashboardClient({ session, cards }) {
  const [mounted, setMounted] = useState(false);
  const [reflections, setReflections] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    async function loadReflections() {
      setLoading(true);
      try {
        const res = await fetch("/api/insights");
        const data = await res.json();

        if (data.message === "No insights yet" || data.message === "No dreams") {
          setReflections(null);
        } else {
          setReflections(data);
        }
      } catch (err) {
        console.error("Failed to fetch reflections:", err);
        setReflections(null);
      } finally {
        setLoading(false);
      }
    }

    loadReflections();
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="space-y-8 sm:space-y-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl min-h-[300px] sm:min-h-[400px] flex items-center justify-center text-center p-6 sm:p-12">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/dreamscape_hero.png"
            alt="Dreamscape Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <motion.div
          className="relative z-10 max-w-3xl space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <h2 className="font-display font-bold neon-text-intense tracking-tighter uppercase leading-[0.9] text-3xl sm:text-5xl lg:text-7xl">
            Welcome to <br /> <span className="text-foreground">ReverieOS</span>
          </h2>
          <p className="text-foreground/80 md:text-lg lg:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Your bridge between the waking world and the subconscious. Track, analyze, and illuminate your internal journey.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <div className="h-[2px] w-12 bg-primary/50 self-center" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-primary/80">Subconscious Scan Active</span>
            <div className="h-[2px] w-12 bg-primary/50 self-center" />
          </div>
        </motion.div>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {cards.map((card, i) => (
          <DashboardCard key={card.title} {...card} delay={0.4 + i * 0.1} />
        ))}
      </section>

      {/* Recent Reflections / Insight Hub */}
      <motion.section
        className="neon-card relative overflow-hidden p-6 sm:p-10 lg:p-12 border-white/5"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="h-6 w-[2px] bg-primary shadow-[0_0_10px_oklch(40.316%_0.15821_350.818)]" />
            <h3 className="font-display font-bold neon-text text-xl sm:text-3xl tracking-tight uppercase">
              Deep Neural Reflection
            </h3>
          </div>

          {loading && (
            <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm font-medium uppercase tracking-widest">Synthesizing insights...</p>
            </div>
          )}

          {!loading && !reflections && (
            <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center">
              <p className="text-muted-foreground text-base mb-4">
                The subconscious ether is quiet.
              </p>
              <p className="text-sm text-foreground/60 italic">
                Add your first dream to the journal to begin the synchronization process.
              </p>
            </div>
          )}

          {!loading && reflections && (
            <div className="space-y-8 sm:space-y-12">
              <div className="max-w-4xl">
                <p className="font-bold text-secondary uppercase tracking-[0.2em] text-[10px] sm:text-xs mb-4">Latest Pattern Analysis</p>
                <p className="text-lg sm:text-2xl lg:text-3xl font-medium leading-normal text-foreground/90">
                  &ldquo;{reflections.summary}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                <div className="space-y-4">
                  <p className="font-bold text-secondary uppercase tracking-[0.2em] text-[10px] sm:text-xs">Dominant Archetypes</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {reflections.keywords?.map((kw, i) => (
                      <span key={i} className="px-3 sm:px-4 py-1.5 bg-primary/5 border border-primary/20 backdrop-blur-sm text-primary rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-bold text-secondary uppercase tracking-[0.2em] text-[10px] sm:text-xs">Emotional Frequency</p>
                  <div className="grid grid-cols-3 gap-3">
                    {reflections.emotions?.length
                      ? reflections.emotions
                        .slice(0, 3)
                        .map((e, i) => (
                          <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="text-lg sm:text-2xl font-bold neon-text leading-none">{(e.score * 100).toFixed(0)}%</div>
                            <div className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground mt-1 tracking-tighter">{e.label}</div>
                          </div>
                        ))
                      : <div className="text-muted-foreground text-sm italic col-span-3">Awaiting emotional data scan...</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
