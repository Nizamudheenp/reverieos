"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function JournalPage() {
  const [dreams, setDreams] = useState([]);
  const [newDream, setNewDream] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

      await fetch("/api/insights", { method: "POST" });
    }

    setSubmitting(false);
  };

  const handleDelete = async (id, createdAt) => {
    const created = new Date(createdAt).getTime();
    const limit = Date.now() - 60 * 60 * 1000; // 1 hour ago

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
      await fetch("/api/insights", { method: "POST" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-indigo-800">Dream Journal 💭</h1>

      <div className="bg-white/70 p-4 rounded-2xl shadow space-y-3">
        <textarea
          value={newDream}
          placeholder="Describe your dream..."
          onChange={(e) => setNewDream(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-300 outline-none resize-none"
          rows={4}
        />

        <button
          onClick={handleAddDream}
          disabled={submitting}
          className="w-full py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Dream"}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading dreams...</p>
      ) : dreams.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">No dreams recorded yet.</p>
      ) : (
        <motion.div layout className="space-y-4">
          {dreams.map((dream) => {
            const created = new Date(dream.createdAt);
            const isDeletable = Date.now() - created.getTime() <= 60 * 60 * 1000;

            return (
              <motion.div
                key={dream._id}
                layout
                className="p-4 bg-white/70 rounded-2xl shadow"
              >
                <p className="text-gray-700 whitespace-pre-line">{dream.content}</p>
                <small className="text-gray-500 block mt-2">
                  {created.toLocaleString()}
                </small>

                {isDeletable && (
                  <button
                    onClick={() => handleDelete(dream._id, dream.createdAt)}
                    className="text-red-600 text-sm font-semibold mt-2"
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
