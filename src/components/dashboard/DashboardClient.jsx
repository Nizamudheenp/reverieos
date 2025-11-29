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
        className="text-center mt-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-semibold text-indigo-800 dark:text-indigo-300">
          Welcome back, {session?.user?.name || "Guest"}! 
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
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
        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
          Recent Reflections
        </h3>

        {loading && <p className="text-gray-600 dark:text-gray-300 text-sm">Loading reflections...</p>}

        {!loading && !reflections && (
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            You haven’t logged any dreams yet. Start by adding one in your Journal 
          </p>
        )}

        {!loading && reflections && (
          <div className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
            <p><strong>Summary:</strong> {reflections.summary}</p>
            <p><strong>Keywords:</strong> {reflections.keywords?.length ? reflections.keywords.join(", ") : "—"}</p>
            <p>
              <strong>Top Emotions:</strong>{" "}
              {reflections.emotions?.length
                ? reflections.emotions
                    .slice(0, 3)
                    .map((e) => `${e.label} (${e.score.toFixed(2)})`)
                    .join(", ")
                : "—"}
            </p>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
