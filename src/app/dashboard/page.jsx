
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const cards = [
    {
      title: "Dream Logs",
      desc: "Record and revisit your nightly dreams.",
      emoji: "💭",
      href: "/dashboard/journal",
    },
    {
      title: "AI Insights",
      desc: "View emotional and trend analysis.",
      emoji: "🧠",
      href: "/dashboard/insights",
    },
    {
      title: "Mood Tracker",
      desc: "See how your feelings evolve over time.",
      emoji: "🌈",
      href: "/dashboard/analytics",
    },
  ];

  return (
    
          <DashboardClient session={session} cards={cards} />
       
  )}
