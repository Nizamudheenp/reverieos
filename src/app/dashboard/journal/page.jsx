"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

export default function JournalPage() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDreams = async () => {
            try {
                const res = await fetch("/api/dreams");
                const data = await res.json();
                setEntries(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDreams();
    }, []);

    const addDream = async () => {
        const res = await fetch("/api/dreams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "New Dream", content: "" }),
        });
        const newDream = await res.json();
        setEntries((prev) => [newDream, ...prev]);
    };

    // Auto-save
    const saveDream = async (id, content) => {
        await fetch(`/api/dreams/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });
    };

    let timer;
    const saveDreamDebounced = (id, content) => {
        clearTimeout(timer);
        timer = setTimeout(() => saveDream(id, content), 500);
    };


    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold text-indigo-800">
                        Dream Journal 💭
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Record and reflect on your dreams here.
                    </p>
                </div>

                <button
                    onClick={addDream}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
                >
                    <PlusCircle className="w-5 h-5" /> New Entry
                </button>
            </div>

            {/* Dream entry */}
            {loading ? (
                <p className="text-gray-500 text-center mt-10">Loading your dreams...</p>
            ) : entries.length === 0 ? (
                <div className="text-center text-gray-500 mt-16">
                    <p>No dreams logged yet 💤</p>
                    <p className="text-sm mt-2">Click “New Entry” to add your first one.</p>
                </div>
            ) : (
                <motion.div layout className="space-y-4">
                    {entries.map((entry) => (
                        <motion.div
                            key={entry._id}
                            layout
                            className="p-4 bg-white/60 backdrop-blur-md rounded-2xl shadow hover:shadow-md transition-all"
                        >
                            <h2 className="font-semibold text-indigo-700 mb-2">
                                {entry.title || "Untitled Dream"}
                            </h2>
                            <textarea
                                value={entry.content}
                                onChange={(e) => {
                                    const updatedContent = e.target.value;
                                    setEntries((prev) =>
                                        prev.map((d) =>
                                            d._id === entry._id ? { ...d, content: updatedContent } : d
                                        )
                                    );
                                    saveDreamDebounced(entry._id, updatedContent);
                                }}
                                placeholder="Describe your dream..."
                                className="w-full p-3 rounded-xl border border-gray-200 bg-white/40 backdrop-blur-sm text-gray-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none resize-none"
                                rows={4}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
