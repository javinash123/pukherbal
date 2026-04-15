import React, { useEffect, useState } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";

const SETTING_KEYS = [
  { key: "site_tagline", label: "Site Tagline", placeholder: "Premium Ayurvedic Herbal Extracts" },
  { key: "hero_heading", label: "Hero Heading", placeholder: "Premium Ayurvedic Herbal Extracts" },
  { key: "hero_subheading", label: "Hero Sub-heading", placeholder: "Bridging Ancient Wisdom with Modern Science" },
  { key: "about_short", label: "About (Short Description)", placeholder: "About Pukhraj Herbals...", multiline: true },
  { key: "contact_email", label: "Enquiry Email", placeholder: "enquiry@pukhrajherbals.com" },
  { key: "contact_sales_email", label: "Sales Email", placeholder: "sales@pukhrajherbals.com" },
  { key: "contact_phone", label: "Phone", placeholder: "+91 98765 43210" },
  { key: "contact_address", label: "Address", placeholder: "Indore, Madhya Pradesh, India" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => setError("Failed to load")).finally(() => setLoading(false));
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    setError("");
    try {
      await api.updateSetting(key, settings[key] || "");
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <AdminGuard>
      <AdminLayout title="Site Settings">
        <div className="max-w-2xl space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}

          {loading ? (
            <div className="text-gray-400 text-sm">Loading settings...</div>
          ) : (
            <div className="space-y-4">
              {SETTING_KEYS.map((s) => (
                <div key={s.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{s.label}</label>
                  {s.multiline ? (
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                      value={settings[s.key] || ""}
                      placeholder={s.placeholder}
                      onChange={e => setSettings(prev => ({ ...prev, [s.key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={settings[s.key] || ""}
                      placeholder={s.placeholder}
                      onChange={e => setSettings(prev => ({ ...prev, [s.key]: e.target.value }))}
                    />
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => handleSave(s.key)}
                      disabled={saving === s.key}
                      className="bg-green-700 hover:bg-green-800 text-white px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-60 transition-colors"
                    >
                      {saving === s.key ? "Saving..." : "Save"}
                    </button>
                    {saved === s.key && <span className="text-green-600 text-sm">✓ Saved!</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
