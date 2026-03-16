"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, LogIn, Sparkles, Moon, Eye } from "lucide-react";

const features = [
  { icon: Moon, label: "Write your daily dreams" },
  { icon: Eye, label: "Decode your dreams" },
  { icon: Sparkles, label: "View emotional insights" },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] max-w-md max-h-md rounded-full bg-primary/10 blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] max-w-sm max-h-sm rounded-full bg-secondary/10 blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute top-[55%] left-[50%] w-[30vw] h-[30vw] max-w-xs max-h-xs rounded-full -translate-x-1/2 -translate-y-1/2 bg-muted/20 blur-[80px]"
        />
      </div>

      {status === "unauthenticated" && (
        <motion.div
          className="relative z-10 flex flex-col items-center w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 mb-6 sm:mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain
                className="w-10 h-10 sm:w-12 sm:h-12 text-primary"
              />
            </motion.div>
            <h1 className="font-display font-bold neon-text tracking-tight text-3xl sm:text-4xl lg:text-5xl">
              ReverieOS
            </h1>
          </motion.div>

          {/* Card */}
          <motion.div
            className="w-full neon-card neon-border-glow p-6 sm:p-8 text-center space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            <div className="space-y-2">
              <h2 className="font-display font-bold text-foreground text-lg sm:text-xl lg:text-2xl leading-snug">
                Your Digital Dream<br />Operating System
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Capture dreams, and emotions. Let ReverieOS reveal the hidden meaning behind your mind.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-2 text-left">
              {features.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm sm:text-base text-foreground/80">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-primary/10 border border-border"
                  >
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            {/* Sign in button */}
            <motion.button
              onClick={() => signIn("google")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm sm:text-base text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-300 cursor-pointer relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 relative z-10" />
              <span className="relative z-10">Sign in with Google</span>
            </motion.button>
          </motion.div>

          <motion.p
            className="mt-5 text-xs sm:text-sm text-muted-foreground/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © 2025 ReverieOS — Where dreams reveal their secrets.
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}
