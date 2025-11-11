import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";

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
    <div className="space-y-10">
      <section className="text-center mt-6">
        <h2 className="text-3xl font-semibold text-indigo-800">
          Welcome back, {session.user.name}! 🌙
        </h2>
        <p className="text-gray-600 mt-3">
          Dive into your digital dream world — track emotions, analyze insights, and grow self-awareness.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="block p-6 bg-white/60 backdrop-blur-lg rounded-2xl shadow hover:shadow-md hover:scale-[1.02] transition-all"
          >
            <div className="text-4xl mb-3">{card.emoji}</div>
            <h3 className="font-semibold text-indigo-700 text-lg mb-1">
              {card.title}
            </h3>
            <p className="text-sm text-gray-600">{card.desc}</p>
          </Link>
        ))}
      </section>

      <section className="bg-white/50 backdrop-blur-lg rounded-2xl shadow p-6">
        <h3 className="text-xl font-semibold text-indigo-700 mb-3">Recent Reflections</h3>
        <p className="text-gray-600 text-sm">
          You haven’t logged any dreams yet. Start by adding one in your Journal 📝
        </p>
      </section>
    </div>
  );
}
