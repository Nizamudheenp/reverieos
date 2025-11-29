"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, LogIn } from "lucide-react";

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
    <div
      className="
        min-h-screen flex flex-col justify-center items-center 
        bg-gradient-to-br 
        from-indigo-100 via-white to-purple-100 
        dark:from-gray-900 dark:via-gray-950 dark:to-black
        text-gray-800 dark:text-gray-200 
        p-6
      "
    >
      {status === "unauthenticated" && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">
              ReverieOS
            </h1>
          </div>

          <Card
            className="
              max-w-lg shadow-xl border-0 
              bg-white/80 dark:bg-gray-800/70 
              backdrop-blur-lg rounded-2xl
            "
          >
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-semibold">
                Your Digital Dream Operating System 
              </h2>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Capture your thoughts, dreams, and emotions in one peaceful space.
                Let AI reflect on your patterns and reveal the hidden meaning behind your mind.
              </p>

              <ul className="text-gray-700 dark:text-gray-300 text-sm mt-4 space-y-2">
                <li>Write your daily dreams</li>
                <li>View emotional insights</li>
                <li>Visualize your growth</li>
              </ul>

              <Button
                onClick={() => signIn("google")}
                className="
                  w-full mt-6 
                  bg-indigo-600 hover:bg-indigo-700 
                  dark:bg-indigo-500 dark:hover:bg-indigo-600 
                  text-white 
                  flex items-center justify-center gap-2 py-2
                "
              >
                <LogIn className="w-5 h-5" /> Sign in with Google
              </Button>
            </CardContent>
          </Card>

          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            © 2025 ReverieOS – Crafted with calm.
          </p>
        </>
      )}
    </div>
  );
}
