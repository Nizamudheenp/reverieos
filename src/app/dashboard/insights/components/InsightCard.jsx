"use client";

export default function InsightCard({ insight }) {
  return (
    <div className="p-4 bg-white/70 backdrop-blur-lg rounded-2xl shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-indigo-700">Latest Insight</h3>
          <p className="text-sm text-gray-600 mt-1">{new Date(insight.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <p className="mt-3 text-gray-700">{insight.summary}</p>
    </div>
  );
}
