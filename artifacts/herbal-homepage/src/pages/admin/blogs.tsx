import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  category?: string;
  readTime?: string;
  author: string;
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

const emptyForm = { title: "", excerpt: "", content: "", imageUrl: "", category: "", readTime: "", author: "Pukhraj Herbals", published: false, featured: false, seoTitle: "", seoDescription: "", seoKeywords: "" };
const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showSeo, setShowSeo] = useState(false);

  const load = () => {
    api.getAdminBlogs().then(setBlogs).catch(() => setError("Failed to load")).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return blogs;
    const q = search.toLowerCase();
    return blogs.filter(b =>
      b.title.toLowerCase().includes(q) ||
      (b.category || "").toLowerCase().includes(q) ||
      (b.author || "").toLowerCase().includes(q) ||
      (b.excerpt || "").toLowerCase().includes(q)
    );
  }, [blogs, search]);

  const openNew = () => { setForm(emptyForm); setEditId(null); setShowForm(true); setShowSeo(false); setError(""); };
  const openEdit = (b: Blog) => {
    setForm({ title: b.title, excerpt: b.excerpt || "", content: b.content || "", imageUrl: b.imageUrl || "", category: b.category || "", readTime: b.readTime || "", author: b.author, published: b.published, featured: b.featured, seoTitle: b.seoTitle || "", seoDescription: b.seoDescription || "", seoKeywords: b.seoKeywords || "" });
    setEditId(b.id);
    setShowForm(true);
    setShowSeo(false);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editId) await api.updateBlog(editId, form);
      else await api.createBlog(form);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete blog post "${title}"?`)) return;
    try { await api.deleteBlog(id); load(); } catch (err: any) { setError(err.message); }
  };

  return (
    <AdminGuard>
      <AdminLayout title="Blog Posts">
        <div className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <input
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 max-w-xs w-full"
                placeholder="Search posts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">{filtered.length} of {blogs.length}</span>
            </div>
            <button onClick={openNew} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">+ New Post</button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{editId ? "Edit Blog Post" : "New Blog Post"}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input className={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input className={inp} placeholder="e.g. Research, Sustainability" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                    <input className={inp} placeholder="e.g. 5 min read" value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input className={inp} value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
                  </div>
                  <div>
                    <ImageUpload label="Cover Image" value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                    <textarea className={inp} rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea className={inp + " font-mono"} rows={10} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Full blog post content..." />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 text-green-600" />
                      Published (visible on website)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 text-green-600" />
                      Featured
                    </label>
                  </div>

                  {/* SEO Section */}
                  <div className="md:col-span-2">
                    <button type="button" onClick={() => setShowSeo(v => !v)} className="flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900">
                      <span>{showSeo ? "▾" : "▸"}</span> SEO Settings (optional)
                    </button>
                    {showSeo && (
                      <div className="mt-3 grid grid-cols-1 gap-3 border-t border-gray-100 pt-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">SEO Title</label>
                          <input className={inp} placeholder="Leave blank to use post title" value={form.seoTitle} onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                          <textarea className={inp} rows={2} maxLength={160} value={form.seoDescription} onChange={e => setForm(f => ({ ...f, seoDescription: e.target.value }))} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Keywords</label>
                          <input className={inp} placeholder="ayurveda, herbal, research..." value={form.seoKeywords} onChange={e => setForm(f => ({ ...f, seoKeywords: e.target.value }))} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-60">{saving ? "Saving..." : "Save Post"}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium">Cancel</button>
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
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Title</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Category</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Author</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="font-medium text-gray-800 max-w-xs truncate">{b.title}</div>
                        {b.featured && <span className="text-xs text-amber-600 font-medium">★ Featured</span>}
                      </td>
                      <td className="px-6 py-3 text-gray-500">{b.category || "—"}</td>
                      <td className="px-6 py-3 text-gray-500">{b.author}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${b.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {b.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right space-x-2">
                        <button onClick={() => openEdit(b)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDelete(b.id, b.title)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">{search ? `No posts match "${search}".` : "No blog posts yet."}</td></tr>
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
