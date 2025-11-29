"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [freq, setFreq] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [tags, setTags] = useState([]);
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [ovRes, fRes, eRes, tRes, inRes] = await Promise.all([
          fetch("/api/analytics/overview"),
          fetch("/api/analytics/frequency?days=14"),
          fetch("/api/analytics/emotions"),
          fetch("/api/analytics/tags"),
          fetch("/api/analytics/insight")
        ]);
        const [ov, f, e, t, ins] = await Promise.all([ovRes.json(), fRes.json(), eRes.json(), tRes.json(), inRes.json()]);
        setOverview(ov);
        setFreq(f);
        setEmotions(e);
        setTags(t);
        setInsight(ins && ins.message ? null : ins);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const COLORS = ["#6366F1","#636363","#F97316","#10B981","#EF4444","#8B5CF6","#F59E0B"];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-primary">Analytics</h1>

      {loading && <p className="text-muted-foreground">Loading analytics...</p>}

      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-2xl shadow">
            <div className="text-sm text-muted-foreground">Total dreams</div>
            <div className="text-2xl font-semibold text-foreground">{overview.total}</div>
          </div>
          <div className="bg-card p-4 rounded-2xl shadow">
            <div className="text-sm text-muted-foreground">Today</div>
            <div className="text-2xl font-semibold text-foreground">{overview.today}</div>
          </div>
          <div className="bg-card p-4 rounded-2xl shadow">
            <div className="text-sm text-muted-foreground">Last 7 days</div>
            <div className="text-2xl font-semibold text-foreground">{overview.last7}</div>
          </div>
        </div>
      )}

      <div className="bg-card p-4 rounded-2xl shadow">
        <h3 className="font-semibold text-primary mb-2">Dreams (last 14 days)</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={freq}>
              <XAxis dataKey="date" tickFormatter={(d)=>d.slice(5)} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-2xl shadow">
          <h3 className="font-semibold text-primary mb-2">Emotion distribution</h3>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={emotions} dataKey="value" nameKey="label" label>
                  {emotions.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-4 rounded-2xl shadow">
          <h3 className="font-semibold text-primary mb-2">Top tags</h3>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={tags}>
                <XAxis dataKey="tag" />
                <YAxis allowDecimals={false}/>
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card p-4 rounded-2xl shadow">
        <h3 className="font-semibold text-primary mb-2">AI Insight</h3>
        {!insight ? (
          <p className="text-muted-foreground">No insight yet. Add dreams to generate an insight.</p>
        ) : (
          <>
            <p className="text-foreground whitespace-pre-line">{insight.summary}</p>
            <div className="mt-3 text-sm text-muted-foreground">
              <strong>Keywords:</strong> {insight.keywords?.join(", ") || "—"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
