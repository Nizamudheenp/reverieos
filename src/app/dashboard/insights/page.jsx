"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import InsightCard from "./components/InsightCard";

export default function InsightsPage() {
  const { data: session, status } = useSession();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/insights/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "lastN", n: 5 }),
        });
        const data = await res.json();
        setInsight(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [session]);

  if (status === "loading") return <p className="text-gray-500 mt-8">Checking session...</p>;

  return (
    <motion.div className="space-y-6 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-semibold text-indigo-800">AI Insights</h1>

      {loading && <p className="text-sm text-gray-500">Analyzing your recent dreams...</p>}

      {!loading && !insight && (
        <p className="text-gray-500">No insights yet. Add some dreams in the Journal and refresh.</p>
      )}

      {insight && (
        <>
          <InsightCard insight={insight} />
          <div className="bg-white/60 p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-indigo-700">Summary</h3>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap">{insight.summary}</p>
            <div className="mt-4">
              <strong>Keywords:</strong> {insight.keywords?.join(", ") || "—"}
            </div>
            <div className="mt-2">
              <strong>Top emotions:</strong>{" "}
              {insight.emotions?.slice(0,3).map(e => `${e.label} (${(e.score||0).toFixed(2)})`).join(", ")}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
