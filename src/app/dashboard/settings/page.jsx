"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
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
    } catch (error) {
      console.error("load settings", error);
    } finally {
      setLoading(false);
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

      <h1 className="text-2xl font-bold neon-text text-primary">Settings</h1>

      <section className="neon-card p-6 space-y-4">
        <h2 className="font-semibold text-primary uppercase tracking-widest text-sm">Data Management</h2>

        <div className="flex flex-wrap gap-4">
          <button
            className="px-6 py-3 bg-primary text-black hover:bg-primary/90 rounded-xl transition-all duration-300 font-black uppercase tracking-widest shadow-[0_0_20px_rgba(oklch(0.7_0.35_300),0.3)]"
            onClick={exportDreams}
            disabled={busy}
          >
            Export all dreams (JSON)
          </button>

          <button
            className="px-6 py-3 bg-primary text-black hover:bg-primary/90 rounded-xl transition-all duration-300 font-black uppercase tracking-widest shadow-[0_0_20px_rgba(oklch(0.7_0.35_300),0.3)]"
            onClick={clearDreams}
            disabled={busy}
          >
            Clear all dreams
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Export downloads a JSON file. Clear deletes only dreams & insights; your account remains.
        </p>
      </section>

      <section className="neon-card p-6 space-y-4">
        <h2 className="font-semibold text-primary">Account Actions</h2>

        <div className="flex flex-wrap gap-4">
          <button
            className="px-6 py-3 bg-primary text-black hover:bg-primary/90 rounded-xl transition-all duration-300 font-black uppercase tracking-widest shadow-[0_0_20px_rgba(oklch(0.7_0.35_300),0.3)]"
            onClick={() => signOut({ callbackUrl: "/" })}
            disabled={busy}
          >
            Sign out
          </button>

          <button
            className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all duration-300 border border-red-500/20 disabled:opacity-50"
            onClick={deleteAccount}
            disabled={busy}
          >
            Delete Account
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Warning: Deleting your account will remove all dreams, insights, and account data permanently.
        </p>
      </section>
    </div>
  );
}
