"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardCard({ title, desc, href, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link
        href={href}
        className="
          group relative block overflow-hidden
          p-6 sm:p-8 lg:p-10
          neon-card
          hover:scale-[1.01]
          transition-all duration-500
        "
      >
        {/* Animated Background Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Accent Corner Glow */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-colors duration-500" />

        <div className="relative z-10 flex flex-col items-start gap-4">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-display font-bold neon-text tracking-tight uppercase text-lg sm:text-2xl">
              {title}
            </h3>
            {/* Arrow Icon Indicator */}
            <div className="h-8 w-8 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-300">
              <span className="text-primary group-hover:translate-x-0.5 transition-transform duration-300">→</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground/90 transition-colors leading-relaxed line-clamp-2">
            {desc}
          </p>
          
          <div className="mt-2 h-[1px] w-0 bg-primary/30 group-hover:w-full transition-all duration-700 ease-in-out" />
        </div>
      </Link>
    </motion.div>
  );
}
