import React, { useEffect, useState } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";

interface VideoItem {
  id: string; title: string; subtitle?: string; videoUrl?: string;
  thumbnailUrl?: string; active: boolean; sortOrder: number;
  productId?: string; productSlug?: string;
}

interface ProductOption { id: string; name: string; slug: string; }

const emptyForm = { title: "", subtitle: "", videoUrl: "", thumbnailUrl: "", active: true, sortOrder: 0, productId: "", productSlug: "" };

export default function AdminVideoItems() {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    api.getAdminVideoItems().then(setItems).catch(() => setError("Failed to load")).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.getAdminProducts().then(setProducts).catch(() => {});
  }, []);

  const openNew = () => { setForm(emptyForm); setEditId(null); setShowForm(true); setError(""); window.scrollTo(0, 0); };
  const openEdit = (v: VideoItem) => {
    setForm({ title: v.title, subtitle: v.subtitle || "", videoUrl: v.videoUrl || "", thumbnailUrl: v.thumbnailUrl || "", active: v.active, sortOrder: v.sortOrder, productId: v.productId || "", productSlug: v.productSlug || "" });
    setEditId(v.id);
    setShowForm(true);
    setError("");
    window.scrollTo(0, 0);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editId) await api.updateVideoItem(editId, form);
      else await api.createVideoItem(form);
      setShowForm(false);
      load();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete video item "${title}"?`)) return;
    try { await api.deleteVideoItem(id); load(); } catch (err: any) { setError(err.message); }
  };

  const toggleActive = async (v: VideoItem) => {
    try { await api.updateVideoItem(v.id, { active: !v.active }); load(); } catch (err: any) { setError(err.message); }
  };

  return (
    <AdminGuard>
      <AdminLayout title="Product in Motion">
        <div className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{items.length} video item{items.length !== 1 ? "s" : ""}</p>
            <button onClick={openNew} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Add Video
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{editId ? "Edit Video" : "New Video Item"}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Botanical Sourcing" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Optional subtitle" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
                    <p className="text-xs text-gray-400 mt-1">YouTube, Vimeo, or any direct video URL. Clicking the play button will open this link.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Linked Product <span className="text-gray-400 font-normal">(for "View Product" button)</span></label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      value={form.productId}
                      onChange={e => {
                        const selected = products.find(p => p.id === e.target.value);
                        setForm(f => ({ ...f, productId: e.target.value, productSlug: selected?.slug || "" }));
                      }}
                    >
                      <option value="">— No linked product —</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">When set, shows a "View Product" button on the homepage card linking to that product.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="video-active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 text-green-600" />
                    <label htmlFor="video-active" className="text-sm text-gray-700">Active (visible on homepage)</label>
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload label="Thumbnail Image" value={form.thumbnailUrl} onChange={url => setForm(f => ({ ...f, thumbnailUrl: url }))} />
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
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Video</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Video URL</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Order</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {v.thumbnailUrl ? (
                            <img src={v.thumbnailUrl} alt={v.title} className="w-14 h-10 object-cover rounded border border-gray-200 flex-shrink-0" />
                          ) : (
                            <div className="w-14 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-lg flex-shrink-0">▶</div>
                          )}
                          <div>
                            <span className="font-medium text-gray-800">{v.title}</span>
                            {v.subtitle && <p className="text-xs text-gray-400">{v.subtitle}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs max-w-[180px] truncate">{v.videoUrl || "—"}</td>
                      <td className="px-6 py-3 text-gray-500">{v.sortOrder}</td>
                      <td className="px-6 py-3">
                        <button onClick={() => toggleActive(v)} className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${v.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                          {v.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-3 text-right space-x-2">
                        <button onClick={() => openEdit(v)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDelete(v.id, v.title)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No video items yet. Click "+ Add Video" to create one.</td></tr>
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
