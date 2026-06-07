import React, { useEffect, useState } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";

interface HeroSlide {
  id: string; title: string; subtitle?: string; ctaText?: string; ctaLink?: string;
  imageUrl?: string; active: boolean; sortOrder: number;
}

const emptyForm = { title: "", subtitle: "", ctaText: "", ctaLink: "/products", imageUrl: "", active: true, sortOrder: 0 };

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

  const openNew = () => { setForm(emptyForm); setEditId(null); setShowForm(true); setError(""); window.scrollTo(0, 0); };
  const openEdit = (s: HeroSlide) => {
    setForm({ title: s.title, subtitle: s.subtitle || "", ctaText: s.ctaText || "", ctaLink: s.ctaLink || "/products", imageUrl: s.imageUrl || "", active: s.active, sortOrder: s.sortOrder });
    setEditId(s.id);
    setShowForm(true);
    setError("");
    window.scrollTo(0, 0);
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
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete slide "${title}"?`)) return;
    try { await api.deleteHeroSlide(id); load(); } catch (err: any) { setError(err.message); }
  };

  const toggleActive = async (s: HeroSlide) => {
    try { await api.updateHeroSlide(s.id, { active: !s.active }); load(); } catch (err: any) { setError(err.message); }
  };

  return (
    <AdminGuard>
      <AdminLayout title="Hero Slider">
        <div className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{slides.length} slide{slides.length !== 1 ? "s" : ""}</p>
            <button onClick={openNew} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Add Slide
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{editId ? "Edit Slide" : "New Hero Slide"}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Nature's Pharmacy, Modern Precision" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Premium botanical extracts manufactured under strict GMP standards" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.ctaText} onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))} placeholder="Explore Our Extracts" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.ctaLink} onChange={e => setForm(f => ({ ...f, ctaLink: e.target.value }))} placeholder="/products" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="slide-active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 text-green-600" />
                    <label htmlFor="slide-active" className="text-sm text-gray-700">Active (visible on homepage)</label>
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload label="Slide Background Image" value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-60 transition-colors">{saving ? "Saving..." : "Save"}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Slide</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">CTA</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Order</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {slides.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {s.imageUrl ? (
                            <img src={s.imageUrl} alt={s.title} className="w-16 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                          ) : (
                            <div className="w-16 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">No img</div>
                          )}
                          <div>
                            <span className="font-medium text-gray-800">{s.title}</span>
                            {s.subtitle && <p className="text-xs text-gray-400 truncate max-w-[220px]">{s.subtitle}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs">{s.ctaText || "—"}</td>
                      <td className="px-6 py-3 text-gray-500">{s.sortOrder}</td>
                      <td className="px-6 py-3">
                        <button onClick={() => toggleActive(s)} className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${s.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                          {s.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-3 text-right space-x-2">
                        <button onClick={() => openEdit(s)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDelete(s.id, s.title)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {slides.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hero slides yet. Click "+ Add Slide" to create one.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
