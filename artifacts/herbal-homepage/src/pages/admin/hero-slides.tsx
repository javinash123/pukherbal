import React, { useEffect, useState } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";

interface HeroSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  active: boolean;
}

const emptyForm = { imageUrl: "", title: "", subtitle: "", ctaText: "Explore Now", ctaLink: "/products", sortOrder: 0, active: true };

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    api.getAdminHeroSlides().then(setSlides).catch(() => setError("Failed to load")).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyForm); setEditId(null); setShowForm(true); setError(""); };
  const openEdit = (s: HeroSlide) => {
    setForm({ imageUrl: s.imageUrl, title: s.title, subtitle: s.subtitle, ctaText: s.ctaText, ctaLink: s.ctaLink, sortOrder: s.sortOrder, active: s.active });
    setEditId(s.id);
    setShowForm(true);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editId) await api.updateHeroSlide(editId, form);
      else await api.createHeroSlide(form);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete slide "${title}"?`)) return;
    try { await api.deleteHeroSlide(id); load(); } catch (err: any) { setError(err.message); }
  };

  const handleToggle = async (s: HeroSlide) => {
    try { await api.updateHeroSlide(s.id, { active: !s.active }); load(); } catch {}
  };

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <AdminGuard>
      <AdminLayout title="Hero Slides">
        <div className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{slides.length} slide{slides.length !== 1 ? "s" : ""}</p>
            <button onClick={openNew} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">+ Add Slide</button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
            <strong>Tip:</strong> Use full-resolution landscape images (1920×1080px recommended) for best results. Paste a direct image URL from your hosting.
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{editId ? "Edit Slide" : "New Slide"}</h3>
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <ImageUpload label="Slide Image" required value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input className={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nature's Pharmacy, Modern Precision" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input className={inp} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Premium botanical extracts..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input className={inp} value={form.ctaText} onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))} placeholder="Explore Now" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input className={inp} value={form.ctaLink} onChange={e => setForm(f => ({ ...f, ctaLink: e.target.value }))} placeholder="/products" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" className={inp} value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input type="checkbox" id="slide-active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 text-green-600" />
                  <label htmlFor="slide-active" className="text-sm text-gray-700">Active (visible on website)</label>
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" disabled={saving} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : slides.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
              <div className="text-4xl mb-3">🖼️</div>
              <p className="mb-4">No hero slides yet. The homepage will use default static images.</p>
              <button onClick={openNew} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-sm font-medium">Add Your First Slide</button>
            </div>
          ) : (
            <div className="grid gap-4">
              {slides.map(s => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-32 bg-gray-100 flex-shrink-0">
                    <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = "none"; }} />
                  </div>
                  <div className="flex-1 p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 mb-1">{s.title}</div>
                      <div className="text-sm text-gray-500 mb-1">{s.subtitle}</div>
                      <div className="text-xs text-gray-400">Button: "{s.ctaText}" → {s.ctaLink} · Order: {s.sortOrder}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => handleToggle(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${s.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                        {s.active ? "Active" : "Inactive"}
                      </button>
                      <button onClick={() => openEdit(s)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(s.id, s.title)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                    </div>
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
