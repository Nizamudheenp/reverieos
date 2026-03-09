"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function InsightsPage() {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsight();
  }, []);

  const loadInsight = async () => {
    setLoading(true);
    const res = await fetch("/api/insights", { method: "GET" });
    const data = await res.json();

    if (data.message === "No insights yet" || data.message === "No dreams") {
      setInsight(null);
    } else {
      setInsight(data);
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-semibold text-primary">
        AI Dream Insights
      </h1>

      {loading && <p className="text-muted-foreground">Generating insights...</p>}

      {!loading && !insight && (
        <p className="text-muted-foreground">
          No insights yet — add a dream in the Journal.
        </p>
      )}

      {insight && (
        <div className="bg-card p-6 rounded-2xl shadow space-y-6">
          <section>
            <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-2">Deep Reflection</h3>
            <p className="text-foreground leading-relaxed whitespace-pre-line text-lg">
              {insight.summary}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-3">Core Symbols</h3>
            <div className="flex flex-wrap gap-2">
              {insight.keywords?.map((kw, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-semibold">
                  #{kw}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-3">Emotional Landscape</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {insight.emotions?.slice(0, 3).map((e, i) => (
                <div key={i} className="p-3 bg-background border border-input rounded-xl text-center">
                  <div className="text-lg font-bold text-foreground">{(e.score * 100).toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-tight">{e.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </motion.div>
  );
}
