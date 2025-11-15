"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardCard({ emoji, title, desc, href, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        href={href}
        className="block p-6 bg-white/70 backdrop-blur-lg rounded-2xl shadow hover:shadow-md hover:scale-[1.02] transition-all"
      >
        <div className="text-4xl mb-3">{emoji}</div>
        <h3 className="font-semibold text-indigo-700 text-lg mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </Link>
    </motion.div>
  );
}
