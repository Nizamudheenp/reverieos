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
    const [collapsed, setCollapsed] = useState(false);
    const { data: session } = useSession();

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Journal", icon: BookOpen, href: "/dashboard/journal" },
        { name: "Insights", icon: Brain, href: "/dashboard/insights" },
        { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
        { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800">
            {/* Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 80 : 240 }}
                className="relative flex flex-col p-4 bg-white/30 backdrop-blur-md shadow-lg border-r border-white/20 transition-all"
            >
                <div className="flex items-center justify-between mb-6">
                    {!collapsed && (
                        <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                            <Brain className="w-6 h-6" /> ReverieOS
                        </h1>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="rounded-full hover:bg-indigo-100"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map(({ name, icon: Icon, href }) => (
                        <Link key={name} href={href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-indigo-100 cursor-pointer",
                                    collapsed && "justify-center"
                                )}
                            >
                                <Icon className="w-5 h-5 text-indigo-600" />
                                {!collapsed && <span>{name}</span>}
                            </div>
                        </Link>
                    ))}
                </nav>

                {/* User */}
                {session && (
                    <div
                        className={cn(
                            "mt-auto flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-white/30",
                            collapsed && "justify-center"
                        )}
                    >
                        <Image
                            src={session.user.image}
                            width={36}
                            height={36}
                            alt="user"
                            className="rounded-full border border-indigo-300"
                        />
                        {!collapsed && (
                            <div>
                                <p className="text-sm font-medium">{session.user.name}</p>
                                <p className="text-xs text-gray-500">Online</p>
                            </div>
                        )}
                    </div>
                )}
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
    );
}
