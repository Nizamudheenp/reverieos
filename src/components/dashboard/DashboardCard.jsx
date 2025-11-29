"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardCard({ title, desc, href, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        href={href}
        className="
          block p-6 
          bg-white/70 dark:bg-gray-800/60 
          backdrop-blur-lg 
          rounded-2xl shadow 
          hover:shadow-md hover:scale-[1.02] 
          transition-all
        "
      >
        <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 text-lg mb-1">
          {title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          {desc}
        </p>
      </Link>
    </motion.div>
  );
}
