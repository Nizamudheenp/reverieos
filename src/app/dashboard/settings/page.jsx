"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("system");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function loadSettings() {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) return setLoading(false);
      const data = await res.json();
      setTheme(data.theme || "system");
    } catch (error) {
      console.error("load settings", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateTheme(newTheme) {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (e) {
      console.error("update theme failed", e);
      showToast("Failed to save theme");
    }

    const root = document.documentElement;
    if (newTheme === "light") root.classList.remove("dark");
    else if (newTheme === "dark") root.classList.add("dark");
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      prefersDark ? root.classList.add("dark") : root.classList.remove("dark");
    }

  }

  async function exportDreams() {
    setBusy(true);
    try {
      const res = await fetch("/api/data/export");
      if (!res.ok) {
        showToast("Export failed");
        setBusy(false);
        return;
      }
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dreams-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Export downloaded");
    } catch (e) {
      console.error(e);
      showToast("Export error");
    } finally {
      setBusy(false);
    }
  }

  async function clearDreams() {
    if (!confirm("Clear all dreams? This will delete all your dream entries. This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/data/dreams", { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("All dreams cleared");
      } else {
        showToast(data?.error || "Clear failed");
      }
    } catch (e) {
      console.error(e);
      showToast("Clear failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteAccount() {
    if (!confirm("Delete account permanently? This removes your account and ALL data (dreams & insights).")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        await signOut({ callbackUrl: "/" });
      } else {
        showToast(data?.error || "Delete failed");
      }
    } catch (e) {
      console.error(e);
      showToast("Delete failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="p-6 text-gray-500 dark:text-gray-400">Loading settings…</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm z-50">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-semibold text-indigo-800 dark:text-indigo-300">Settings</h1>

      <section className="bg-white/70 dark:bg-neutral-800/70 p-4 rounded-2xl shadow space-y-3">
        <h2 className="font-semibold text-indigo-700 dark:text-indigo-300">Appearance</h2>

        <div className="flex gap-3 text-gray-700 dark:text-gray-300">
          <label className="flex items-center gap-2">
            <input type="radio" name="theme" value="system" checked={theme === "system"} onChange={(e) => updateTheme(e.target.value)} /> System
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="theme" value="light" checked={theme === "light"} onChange={(e) => updateTheme(e.target.value)} /> Light
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={(e) => updateTheme(e.target.value)} /> Dark
          </label>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Theme selection stored for your account.
        </p>
      </section>

      <section className="bg-white/70 dark:bg-neutral-800/70 p-4 rounded-2xl shadow space-y-3">
        <h2 className="font-semibold text-indigo-700 dark:text-indigo-300">Data</h2>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-gray-700 dark:bg-gray-600 text-white rounded-lg disabled:opacity-50"
            onClick={exportDreams}
            disabled={busy}
          >
            Export all dreams (JSON)
          </button>

          <button
            className="px-4 py-2 bg-gray-700 dark:bg-gray-600 text-white rounded-lg disabled:opacity-50"
            onClick={clearDreams}
            disabled={busy}
          >
            Clear all dreams
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Export downloads a JSON file. Clear deletes only dreams & insights; your account remains.
        </p>
      </section>

      <section className="bg-white/70 dark:bg-neutral-800/70 p-4 rounded-2xl shadow space-y-3">
        <h2 className="font-semibold text-indigo-700 dark:text-indigo-300">Account</h2>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-700 dark:bg-gray-600 text-white rounded-lg" onClick={() => signOut({ callbackUrl: "/" })} disabled={busy}>
            Sign out
          </button>

          <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={deleteAccount} disabled={busy}>
            Delete account permanently
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Deleting account removes your user record, dreams, insights, and settings.
        </p>
      </section>
    </div>
  );
}
