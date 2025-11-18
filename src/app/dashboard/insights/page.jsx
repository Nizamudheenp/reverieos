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
      <h1 className="text-2xl font-semibold text-indigo-800">
        AI Dream Insights 🧠
      </h1>

      {loading && <p className="text-gray-500">Generating insights...</p>}

      {!loading && !insight && (
        <p className="text-gray-500">
          No insights yet — add a dream in the Journal.
        </p>
      )}

      {insight && (
        <div className="bg-white/70 p-4 rounded-2xl shadow">
          <h3 className="font-semibold text-indigo-700">Summary</h3>
          <p className="mt-2 text-gray-700 whitespace-pre-line">
            {insight.summary}
          </p>

          <div className="mt-4">
            <strong>Keywords:</strong>{" "}
            {insight.keywords?.length ? insight.keywords.join(", ") : "—"}
          </div>

          <div className="mt-2">
            <strong>Top Emotions:</strong>{" "}
            {insight.emotions?.length
              ? insight.emotions
                .slice(0, 3)
                .map((e) => `${e.label} (${e.score.toFixed(2)})`)
                .join(", ")
              : "—"}
          </div>
        </div>
      )}
    </motion.div>
  );
}
