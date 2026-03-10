"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function InsightsPage() {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadInsight = async () => {
    try {
      const res = await fetch("/api/insights", { method: "GET" });
      const data = await res.json();

      if (data.message === "No insights yet" || data.message === "No dreams") {
        setInsight(null);
      } else {
        setInsight(data);
      }
    } catch (error) {
      console.error("Failed to load insights", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsight();
  }, []);


  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold text-primary neon-text tracking-tight">
        Insights
      </h1>

      {loading && <p className="text-muted-foreground">Generating insights...</p>}

      {!loading && !insight && (
        <p className="text-muted-foreground">
          No insights yet — add a dream in the Journal.
        </p>
      )}

      {insight && (
        <div className="neon-card p-10 space-y-10 border-primary/20">
          <section>
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-secondary/30" /> Summary
            </h3>
            <p className="text-foreground/90 leading-relaxed text-xl font-medium">
              {insight.summary}
            </p>
          </section>

          <section>
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-secondary/30" /> Symbols
            </h3>
            <div className="flex flex-wrap gap-2">
              {insight.keywords?.map((kw, i) => (
                <span key={i} className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary rounded-full text-xs font-semibold">
                  #{kw}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-secondary/30" /> Emotions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {insight.emotions?.slice(0, 3).map((e, i) => (
                <div key={i} className="p-6 bg-primary/5 border border-primary/10 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-primary neon-text mb-1">{(e.score * 100).toFixed(0)}%</div>
                  <div className="text-[11px] text-muted-foreground uppercase font-semibold tracking-widest">{e.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </motion.div>
  );
}
