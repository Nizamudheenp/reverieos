"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
      className="space-y-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.section
        className="text-center mt-8 mb-12"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h2 className="text-5xl font-bold text-primary neon-text tracking-tight uppercase italic leading-tight">
          Welcome to your <br /> Subconscious Connections
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
          Dive into your digital dream world — track emotions, analyze insights, and grow self-awareness.
        </p>
      </motion.section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <DashboardCard key={card.title} {...card} delay={0.2 + i * 0.1} />
        ))}
      </section>
      {/* Recent Reflections */}
      <motion.section
        className="neon-card p-8 border-primary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold text-primary neon-text mb-6">
          Recent Reflections
        </h3>

        {loading && <p className="text-gray-600 dark:text-gray-300 text-sm">Loading reflections...</p>}

        {!loading && !reflections && (
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            You haven’t logged any dreams yet. Start by adding one in your Journal
          </p>
        )}

        {!loading && reflections && (
          <div className="text-foreground space-y-8">
            <div className="space-y-3">
              <p className="font-bold text-secondary uppercase tracking-widest text-xs">AI Insight</p>
              <p className="text-xl font-medium leading-relaxed">{reflections.summary}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {reflections.keywords?.map((kw, i) => (
                <span key={i} className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary rounded-full text-xs font-semibold">
                  #{kw}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-4">
                <p className="font-bold text-secondary uppercase tracking-widest text-xs">Dominant Emotions</p>
                <div className="flex flex-wrap gap-4">
                  {reflections.emotions?.length
                    ? reflections.emotions
                      .slice(0, 3)
                      .map((e, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-2xl font-bold text-primary neon-text">{(e.score * 100).toFixed(0)}%</span>
                          <span className="text-[11px] uppercase font-semibold text-muted-foreground">{e.label}</span>
                        </div>
                      ))
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
