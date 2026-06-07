import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";
import { RichTextEditor } from "@/components/RichTextEditor";

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
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  category: "",
  readTime: "",
  author: "Pukhraj Herbals",
  published: false,
  featured: false,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

const PAGE_SIZE = 10;

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = () => {
    api.getAdminBlogs().then(setBlogs).catch(() => setError("Failed to load")).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return blogs.filter(b =>
      b.title.toLowerCase().includes(q) ||
      (b.category || "").toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
    );
  }, [blogs, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openNew = () => { setForm(emptyForm); setEditId(null); setShowForm(true); setError(""); window.scrollTo(0, 0); };
  const openEdit = (b: Blog) => {
    setForm({
      title: b.title,
      excerpt: b.excerpt || "",
      content: b.content || "",
      imageUrl: b.imageUrl || "",
      category: b.category || "",
      readTime: b.readTime || "",
      author: b.author,
      published: b.published,
      featured: b.featured,
      metaTitle: b.metaTitle || "",
      metaDescription: b.metaDescription || "",
      metaKeywords: b.metaKeywords || "",
    });
    setEditId(b.id);
    setShowForm(true);
    setError("");
    window.scrollTo(0, 0);
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

          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search posts..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500">{filtered.length} post{filtered.length !== 1 ? "s" : ""}</p>
              <button onClick={openNew} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                + New Post
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{editId ? "Edit Blog Post" : "New Blog Post"}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g. Research, Sustainability"
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g. 5 min read"
                      value={form.readTime}
                      onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={form.author}
                      onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={2}
                      value={form.excerpt}
                      onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                      placeholder="Short summary shown on the blog listing page..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                      <span className="ml-1 font-normal text-gray-400 text-xs">(formatted text — renders exactly as shown on the website)</span>
                    </label>
                    <RichTextEditor
                      value={form.content}
                      onChange={val => setForm(f => ({ ...f, content: val }))}
                      placeholder="Write the full blog post content here..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload
                      label="Cover Image"
                      value={form.imageUrl}
                      onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 text-green-600" />
                      Published (visible on website)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 text-green-600" />
                      Featured (shown prominently on blog page)
                    </label>
                  </div>
                </div>
                {/* SEO Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">🔍 SEO Settings <span className="text-gray-400 font-normal text-xs">(optional)</span></h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title <span className="text-gray-400 font-normal">(50–60 chars)</span></label>
                      <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} placeholder={`${form.title || "Blog Post Title"} | Pukhraj Herbals`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description <span className="text-gray-400 font-normal">(150–160 chars)</span></label>
                      <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" rows={2} value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} placeholder="Brief description for search engines..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                      <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.metaKeywords} onChange={e => setForm(f => ({ ...f, metaKeywords: e.target.value }))} placeholder="ashwagandha, herbal research, ayurvedic..." />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-60 transition-colors">
                    {saving ? "Saving..." : "Save Post"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Post</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Category</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Author</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pageItems.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            {b.imageUrl ? (
                              <img src={b.imageUrl} alt={b.title} className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-lg flex-shrink-0">📝</div>
                            )}
                            <div>
                              <div className="font-medium text-gray-800 max-w-xs truncate">{b.title}</div>
                              {b.featured && <span className="text-xs text-amber-600 font-medium">★ Featured</span>}
                            </div>
                          </div>
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
                    {pageItems.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">{search ? "No posts match your search." : "No blog posts yet."}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${pg === currentPage ? "bg-green-700 text-white border-green-700" : "border-gray-300 hover:bg-gray-50"}`}
                      >
                        {pg}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
