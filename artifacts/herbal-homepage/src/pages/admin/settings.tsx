import React, { useEffect, useState } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";

const SETTING_GROUPS = [
  {
    title: "General",
    icon: "🌿",
    keys: [
      { key: "site_tagline", label: "Site Tagline", placeholder: "Premium Ayurvedic Herbal Extracts" },
      { key: "hero_heading", label: "Hero Heading", placeholder: "Premium Ayurvedic Herbal Extracts" },
      { key: "hero_subheading", label: "Hero Sub-heading", placeholder: "Bridging Ancient Wisdom with Modern Science" },
      { key: "about_short", label: "About (Short Description)", placeholder: "About Pukhraj Herbals...", multiline: true },
    ],
  },
  {
    title: "Contact Info",
    icon: "📞",
    keys: [
      { key: "contact_email", label: "Enquiry Email", placeholder: "enquiry@pukhrajherbals.com" },
      { key: "contact_sales_email", label: "Sales Email", placeholder: "sales@pukhrajherbals.com" },
      { key: "contact_phone", label: "Phone", placeholder: "+91 98765 43210" },
      { key: "contact_address", label: "Address", placeholder: "Indore, Madhya Pradesh, India", multiline: true },
    ],
  },
  {
    title: "SEO",
    icon: "🔍",
    keys: [
      { key: "seo_meta_title", label: "Default Meta Title", placeholder: "Pukhraj Herbals | Premium Ayurvedic Herbal Extracts" },
      { key: "seo_meta_description", label: "Default Meta Description", placeholder: "GMP & ISO certified manufacturer of premium herbal extracts, botanical powders and essential oils...", multiline: true },
      { key: "seo_meta_keywords", label: "Default Meta Keywords", placeholder: "herbal extracts, ayurvedic, botanical, ashwagandha, turmeric, India" },
      { key: "seo_og_image", label: "OG Image URL (for social sharing)", placeholder: "https://yourdomain.com/pukhrajherbals/api/uploads/og-image.jpg" },
    ],
  },
  {
    title: "Social Media Links",
    icon: "📱",
    keys: [
      { key: "social_instagram", label: "Instagram URL", placeholder: "https://instagram.com/pukhrajherbals" },
      { key: "social_facebook", label: "Facebook URL", placeholder: "https://facebook.com/pukhrajherbals" },
      { key: "social_twitter", label: "Twitter / X URL", placeholder: "https://twitter.com/pukhrajherbals" },
      { key: "social_linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/pukhrajherbals" },
      { key: "social_youtube", label: "YouTube URL", placeholder: "https://youtube.com/@pukhrajherbals" },
      { key: "social_whatsapp", label: "WhatsApp Number (with country code)", placeholder: "+919876543210" },
    ],
  },
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
        <div className="max-w-2xl space-y-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}

          {loading ? (
            <div className="text-gray-400 text-sm">Loading settings...</div>
          ) : (
            SETTING_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>{group.icon}</span> {group.title}
                </h2>
                <div className="space-y-3">
                  {group.keys.map((s) => (
                    <div key={s.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{s.label}</label>
                      {(s as any).multiline ? (
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
                        {saved === s.key && <span className="text-green-600 text-sm font-medium">✓ Saved!</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
