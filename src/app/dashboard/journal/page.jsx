"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function JournalPage() {
  const [dreams, setDreams] = useState([]);
  const [newDream, setNewDream] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    try {
      const res = await fetch("/api/dreams");
      const data = await res.json();
      setDreams(data);
    } catch (err) {
      console.error("Fetch dreams error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDream = async () => {
    if (!newDream.trim()) {
      alert("Please write your dream before saving.");
      return;
    }

    setSubmitting(true);
    setLastResult(null); // Clear previous result

    const res = await fetch("/api/dreams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newDream }),
    });

    const data = await res.json();

    if (res.status === 403) {
      alert(data.error || "Daily limit reached.");
    } else {
      setDreams((prev) => [data, ...prev]);
      setNewDream("");
      setLastResult(data); // Store the latest result

      await fetch("/api/insights", { method: "POST" });
    }

    setSubmitting(false);
  };

  const handleDelete = async (id, createdAt) => {
    const created = new Date(createdAt).getTime();
    const limit = Date.now() - 60 * 60 * 1000;

    if (created < limit) {
      alert("Delete is allowed only within 1 hour of adding.");
      return;
    }

    const res = await fetch("/api/dreams", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (data.success) {
      setDreams((prev) => prev.filter((d) => d._id !== id));
      if (lastResult?._id === id) setLastResult(null);
      await fetch("/api/insights", { method: "POST" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-primary">Journaling My Dream</h1>
        <div className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
          Mystical Insights
        </div>
      </div>

      <div className="bg-card p-6 rounded-2xl shadow-lg border border-primary/5 space-y-4">
        <textarea
          value={newDream}
          placeholder="I saw a snake in my dream..."
          onChange={(e) => setNewDream(e.target.value)}
          className="w-full p-4 rounded-xl border border-input bg-background/50 text-foreground 
                     focus:ring-2 focus:ring-primary outline-none resize-none text-lg leading-relaxed placeholder:italic"
          rows={4}
        />

        <button
          onClick={handleAddDream}
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold
                     hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Consulting the Stars...
            </>
          ) : "Decode Dream Meaning"}
        </button>
      </div>

      {lastResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-xl text-white space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <h2 className="text-xl font-bold uppercase tracking-widest text-indigo-100">The AI Astrologer Says:</h2>
          </div>
          <p className="text-lg italic leading-relaxed font-medium">
            {lastResult.meaning || "The stars are shifting, but their meaning is yet to be revealed. Please check back in a moment or try again."}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {lastResult.tags?.map((t, i) => (
              <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">#{t}</span>
            ))}
          </div>
        </motion.div>
      )}

      {loading ? (
        <p className="text-muted-foreground text-center">Loading dreams...</p>
      ) : dreams.length === 0 ? (
        <p className="text-muted-foreground text-center mt-8">
          No dreams recorded yet.
        </p>
      ) : (
        <motion.div layout className="space-y-4">
          {dreams.map((dream) => {
            const created = new Date(dream.createdAt);
            const isDeletable =
              Date.now() - created.getTime() <= 60 * 60 * 1000;

            return (
              <motion.div
                key={dream._id}
                layout
                className="p-4 bg-card rounded-2xl shadow"
              >
                <p className="text-foreground whitespace-pre-line">
                  {dream.content}
                </p>

                {dream.meaning && (
                  <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border-l-4 border-indigo-500 space-y-3">
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 italic leading-relaxed">
                      <span className="font-bold not-italic">Astrological Meaning:</span> {dream.meaning}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {dream.tags?.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-200 rounded text-[10px] font-bold uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] text-indigo-600/80 dark:text-indigo-300/80 font-medium">
                      {dream.emotions?.map(e => `${e.label} (${(e.score * 100).toFixed(0)}%)`).join(" • ")}
                    </div>
                  </div>
                )}

                <small className="text-muted-foreground block mt-2">
                  {created.toLocaleString()}
                </small>

                {isDeletable && (
                  <button
                    onClick={() =>
                      handleDelete(dream._id, dream.createdAt)
                    }
                    className="text-destructive text-sm font-semibold mt-2"
                  >
                    Delete
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
