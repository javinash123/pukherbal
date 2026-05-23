import React, { useEffect, useState } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";

interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  sortOrder: number;
  active: boolean;
}

const emptyForm = { title: "", youtubeUrl: "", sortOrder: 0, active: true };

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    api.getAdminVideos().then(setVideos).catch(() => setError("Failed to load")).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyForm); setEditId(null); setShowForm(true); setError(""); };
  const openEdit = (v: Video) => {
    setForm({ title: v.title, youtubeUrl: v.youtubeUrl, sortOrder: v.sortOrder, active: v.active });
    setEditId(v.id);
    setShowForm(true);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (!getYouTubeId(form.youtubeUrl)) { setError("Please enter a valid YouTube URL."); setSaving(false); return; }
      if (editId) await api.updateVideo(editId, form);
      else await api.createVideo(form);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete video "${title}"?`)) return;
    try { await api.deleteVideo(id); load(); } catch (err: any) { setError(err.message); }
  };

  const handleToggle = async (v: Video) => {
    try { await api.updateVideo(v.id, { active: !v.active }); load(); } catch {}
  };

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <AdminGuard>
      <AdminLayout title="Videos">
        <div className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{videos.length} video{videos.length !== 1 ? "s" : ""}</p>
            <button onClick={openNew} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">+ Add Video</button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
            <strong>Supported formats:</strong> YouTube watch links, short links (youtu.be), embed links, and Shorts.
            <div className="mt-1 font-mono text-xs text-blue-600">https://www.youtube.com/watch?v=XXXX &nbsp;|&nbsp; https://youtu.be/XXXX</div>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{editId ? "Edit Video" : "New Video"}</h3>
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video Title *</label>
                  <input className={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Botanical Sourcing" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL *</label>
                  <input className={inp} value={form.youtubeUrl} onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." required />
                  {form.youtubeUrl && getYouTubeId(form.youtubeUrl) && (
                    <div className="mt-2 rounded-lg overflow-hidden aspect-video bg-gray-100 max-w-sm">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(form.youtubeUrl)}`}
                        className="w-full h-full"
                        allowFullScreen
                        title="Preview"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" className={inp} value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input type="checkbox" id="video-active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 text-green-600" />
                  <label htmlFor="video-active" className="text-sm text-gray-700">Active (visible on website)</label>
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
          ) : videos.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
              <div className="text-4xl mb-3">▶️</div>
              <p className="mb-4">No videos yet. Add YouTube video links to show in the "Product in Motion" section.</p>
              <button onClick={openNew} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-sm font-medium">Add Your First Video</button>
            </div>
          ) : (
            <div className="grid gap-4">
              {videos.map(v => {
                const ytId = getYouTubeId(v.youtubeUrl);
                return (
                  <div key={v.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                    <div className="w-full md:w-40 h-28 bg-gray-100 flex-shrink-0">
                      {ytId ? (
                        <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt={v.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">▶️</div>
                      )}
                    </div>
                    <div className="flex-1 p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">{v.title}</div>
                        <div className="text-xs text-gray-400 font-mono truncate">{v.youtubeUrl}</div>
                        <div className="text-xs text-gray-400 mt-1">Sort Order: {v.sortOrder}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => handleToggle(v)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${v.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                          {v.active ? "Active" : "Inactive"}
                        </button>
                        <button onClick={() => openEdit(v)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete(v.id, v.title)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
