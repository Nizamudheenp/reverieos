"use client";

import { motion } from "framer-motion";
import DashboardCard from "./DashboardCard";

export default function DashboardClient({ session, cards }) {
  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Welcome Section */}
      <motion.section
        className="text-center mt-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-semibold text-indigo-800">
          Welcome back, {session.user.name}! 🌙
        </h2>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Dive into your digital dream world — track emotions, analyze insights,
          and grow self-awareness.
        </p>
      </motion.section>

      {/* Dashboard Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <DashboardCard key={card.title} {...card} delay={0.2 + i * 0.1} />
        ))}
      </section>

      {/* Reflections Section */}
      <motion.section
        className="bg-white/60 backdrop-blur-lg rounded-2xl shadow p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold text-indigo-700 mb-3">
          Recent Reflections
        </h3>
        <p className="text-gray-600 text-sm">
          You haven’t logged any dreams yet. Start by adding one in your Journal 📝
        </p>
      </motion.section>
    </motion.div>
  );
}
