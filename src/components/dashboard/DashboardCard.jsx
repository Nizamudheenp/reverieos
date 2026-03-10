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
          group relative block p-8
          neon-card
          hover:scale-[1.02] hover:border-primary/50
          transition-all duration-300
        "
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        <h3 className="relative font-bold text-primary neon-text text-2xl mb-2 tracking-tight">
          {title}
        </h3>

        <p className="relative text-base text-muted-foreground group-hover:text-foreground/90 transition-colors leading-relaxed">
          {desc}
        </p>
      </Link>
    </motion.div>
  );
}
