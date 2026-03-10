"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

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
        <h1 className="text-4xl font-bold text-primary neon-text tracking-tight">Journal</h1>
        <div className="text-[11px] font-bold text-secondary bg-secondary/10 px-4 py-1 rounded-full border border-secondary/20 uppercase tracking-widest">
          Mystical Insights
        </div>
      </div>

      <motion.div
        className="neon-card p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <textarea
          value={newDream}
          placeholder="I saw a dragon flying over a crystalline city..."
          onChange={(e) => setNewDream(e.target.value)}
          className="w-full p-6 bg-background/50 rounded-2xl border border-white/5 text-foreground 
                     focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none resize-none text-xl leading-relaxed placeholder:text-muted-foreground/30 transition-all duration-300 min-h-[180px]"
          rows={4}
        />

        <button
          onClick={handleAddDream}
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold uppercase tracking-widest
                     hover:bg-primary/90 hover:scale-[1.01] active:scale-95 transition-all duration-300 disabled:opacity-50 
                     shadow-lg flex items-center justify-center gap-3"
        >
          {submitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Interpreting...
            </>
          ) : "Decode Dream Meaning"}
        </button>
      </motion.div>

      {lastResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-gradient-to-br from-primary to-purple-800 rounded-2xl shadow-2xl text-white space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <h2 className="text-xl font-bold uppercase tracking-widest">AI Interpretation:</h2>
          </div>
          <p className="text-xl italic leading-relaxed font-medium">
            &quot;{lastResult.meaning || "The stars are shifting, but their meaning is yet to be revealed..."}&quot;
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {lastResult.tags?.map((t, i) => (
              <span key={i} className="px-3 py-1 bg-white/20 border border-white/10 rounded-full text-xs font-bold font-mono">#{t}</span>
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
                className="neon-card p-6 border-transparent hover:border-primary/30 transition-all duration-500 overflow-hidden relative group"
              >
                <p className="text-foreground/90 whitespace-pre-line text-lg leading-relaxed">
                  {dream.content}
                </p>

                {dream.meaning && (
                  <div className="mt-6 p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-4 relative">
                    <div className="absolute top-4 right-4 opacity-20"><Brain className="w-6 h-6 text-primary" /></div>
                    <p className="text-base text-foreground/80 leading-relaxed">
                      <span className="font-black text-primary uppercase tracking-widest text-[10px] block mb-2">Neural Analysis</span> {dream.meaning}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {dream.tags?.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary/40" />
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
