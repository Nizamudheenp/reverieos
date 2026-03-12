"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function DashboardLayout({ children }) {
    const [collapsed, setCollapsed] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Journal", icon: BookOpen, href: "/dashboard/journal" },
        { name: "Insights", icon: Brain, href: "/dashboard/insights" },
        { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
        { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    ];

    const close = () => setCollapsed(true);

    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
            <div className="scanline" />

            {/* Backdrop for mobile */}
            <AnimatePresence>
                {!collapsed && isMobile && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={close}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: collapsed ? 0 : 272,
                    x: collapsed ? -20 : 0,
                    opacity: collapsed ? 0 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 28,
                    opacity: { duration: 0.25 },
                }}
                className="
                    fixed top-0 left-0 h-full
                    bg-sidebar backdrop-blur-xl
                    border-r border-white/10
                    z-50 flex flex-col
                    overflow-hidden
                    shadow-[10px_0_40px_-10px_oklch(40.316%_0.15821_350.818_/_0.3)]
                "
            >
                <div className="flex items-center justify-between px-5 py-5 mb-2">
                    <h1 className="text-xl font-bold neon-text flex items-center gap-2 tracking-tight font-display">
                        <Brain className="w-7 h-7 shrink-0" style={{ color: "oklch(40.316% 0.15821 350.818)" }} />
                        <span className="truncate">ReverieOS</span>
                    </h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={close}
                        className="rounded-full hover:bg-primary/20 transition-all duration-300 ml-1 shrink-0"
                    >
                        <X className="w-5 h-5 text-primary" />
                    </Button>
                </div>

                <nav className="flex-1 space-y-1 px-3">
                    {navItems.map(({ name, icon: Icon, href }) => (
                        <Link key={name} href={href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => { if (isMobile) close(); }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group",
                                    "hover:bg-primary/10 hover:shadow-[0_0_18px_-4px_oklch(40.316%_0.15821_350.818_/_0.25)]",
                                    "border border-transparent hover:border-primary/20"
                                )}
                            >
                                <Icon className="w-5 h-5 shrink-0 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                                <span className="font-medium text-sm text-foreground/80 group-hover:text-foreground group-hover:neon-text transition-all duration-300 truncate">
                                    {name}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </nav>

                {session && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-auto p-3 m-3 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3"
                    >
                        <Image
                            src={session.user.image}
                            width={38}
                            height={38}
                            alt="user"
                            className="rounded-full border-2 border-primary/30 shrink-0"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{session.user.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase opacity-60 tracking-wider">Online</p>
                        </div>
                    </motion.div>
                )}
            </motion.aside>

            {/* Toggle Button (always visible when collapsed) */}
            {collapsed && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(false)}
                    className="fixed top-4 left-4 z-[60] rounded-xl bg-background/60 backdrop-blur-md border border-primary/20 hover:bg-primary/20 hover:scale-110 transition-all duration-300 shadow-lg w-10 h-10"
                >
                    <Menu className="w-6 h-6 text-primary" />
                </Button>
            )}

            {/* Main Content */}
            <motion.main
                animate={{
                    paddingLeft: !collapsed && !isMobile ? 288 : 0,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className="min-h-screen pt-16 pb-10 w-full"
            >
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </motion.main>
        </div>
    );
}
