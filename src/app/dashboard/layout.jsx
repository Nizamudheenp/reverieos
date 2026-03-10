"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    BookOpen,
    BarChart3,
    Settings,
    Menu,
    Brain,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function DashboardLayout({ children }) {
    const [collapsed, setCollapsed] = useState(true);
    const { data: session } = useSession();

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Journal", icon: BookOpen, href: "/dashboard/journal" },
        { name: "Insights", icon: Brain, href: "/dashboard/insights" },
        { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
        { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    ];

    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
            <div className="scanline" />

            <motion.aside
                initial={false}
                animate={{
                    width: collapsed ? 0 : 280,
                    x: collapsed ? -20 : 0,
                    opacity: collapsed ? 0 : 1
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    opacity: { duration: 0.3 }
                }}
                className="
                    fixed top-0 left-0 h-full 
                    bg-card backdrop-blur-xl
                    border-r border-white/10
                    z-50 flex flex-col
                    overflow-hidden
                    shadow-[10px_0_30px_-15px_rgba(0,0,0,0.5)]
                "
            >
                <div className="flex items-center justify-between p-6 mb-4">
                    <h1 className="text-2xl font-bold text-primary neon-text flex items-center gap-3 tracking-tight">
                        <Brain className="w-8 h-8 text-primary shadow-primary/20" />
                        {!collapsed && <span>ReverieOS</span>}
                    </h1>
                    {!collapsed && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCollapsed(true)}
                            className="rounded-full hover:bg-primary/20 transition-all duration-300 ml-auto"
                        >
                            <Menu className="w-5 h-5 text-primary" />
                        </Button>
                    )}
                </div>

                <nav className="flex-1 space-y-1 px-4">
                    {navItems.map(({ name, icon: Icon, href }) => (
                        <Link key={name} href={href}>
                            <motion.div
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (window.innerWidth < 1024) setCollapsed(true);
                                }}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 group",
                                    "hover:bg-primary/10 hover:shadow-[0_0_20px_-5px_oklch(0.65_0.3_290/0.2)]",
                                    "border border-transparent hover:border-primary/20"
                                )}
                            >
                                <Icon className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                                <span className="font-medium text-foreground/80 group-hover:text-foreground group-hover:neon-text transition-all duration-300">
                                    {name}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </nav>

                {session && !collapsed && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-auto p-4 m-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4"
                    >
                        <Image
                            src={session.user.image}
                            width={44}
                            height={44}
                            alt="user"
                            className="rounded-full border-2 border-primary/30"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{session.user.name}</p>
                            <p className="text-[11px] text-muted-foreground font-medium uppercase opacity-60">Online</p>
                        </div>
                    </motion.div>
                )}
            </motion.aside>

            {collapsed && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(false)}
                    className="fixed top-4 left-4 z-[60] rounded-full bg-background/50 backdrop-blur-md border border-white/10 hover:bg-primary/20 hover:scale-110 transition-all duration-300 shadow-xl"
                >
                    <Menu className="w-5 h-5 text-primary" />
                </Button>
            )}

            <motion.main
                animate={{
                    paddingLeft: collapsed ? 24 : 304,
                    filter: !collapsed && window.innerWidth < 1024 ? "blur(4px)" : "none"
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="p-8 min-h-screen"
            >
                {children}
            </motion.main>
        </div>
    );
}
