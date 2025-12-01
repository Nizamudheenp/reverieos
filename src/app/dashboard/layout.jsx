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
        <div className="relative min-h-screen bg-background text-foreground">

            <motion.aside
                animate={{ width: collapsed ? 0 : 240 }}
                className="
                    fixed top-0 left-0 h-full 
                    bg-card/30 backdrop-blur-md shadow-lg 
                    border-r border-border/20 
                    transition z-50 flex flex-col
                "
            >
                <div className="flex items-center justify-between p-4">
                    {!collapsed && (
                        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                            <Brain className="w-6 h-6 text-primary" /> ReverieOS
                        </h1>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="rounded-full hover:bg-muted"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>

                {!collapsed && (
                    <>
                        <nav className="flex-1 space-y-2 px-2">
                            {navItems.map(({ name, icon: Icon, href }) => (
                                <Link key={name} href={href}>
                                    <div
                                        onClick={() => setCollapsed(true)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                                        )}
                                    >
                                        <Icon className="w-5 h-5 text-primary" />
                                        <span>{name}</span>
                                    </div>
                                </Link>
                            ))}
                        </nav>

                        {session && (
                            <div
                                className="mt-auto flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/30 mx-2"
                            >
                                <Image
                                    src={session.user.image}
                                    width={36}
                                    height={36}
                                    alt="user"
                                    className="rounded-full border border-primary/40"
                                />
                                <div>
                                    <p className="text-sm font-medium">{session.user.name}</p>
                                    <p className="text-xs text-muted-foreground">Online</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.aside>

            <main className="p-6 ml-0">{children}</main>
        </div>
    );
}
