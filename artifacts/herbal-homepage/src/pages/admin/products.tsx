import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUpload } from "@/components/ImageUpload";

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId?: string;
  specification?: string;
  casNumber?: string;
  imageUrl?: string;
  description?: string;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

interface Category { id: string; name: string; }

const emptyForm = {
  name: "",
  categoryId: "" as string,
  specification: "",
  casNumber: "",
  imageUrl: "",
  description: "",
  sortOrder: 0,
  active: true,
  featured: false,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const [prods, setProds] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = () => {
    Promise.all([api.getAdminProducts(), api.getAdminCategories()])
      .then(([p, c]) => { setProds(p); setCats(c); })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return prods.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.specification || "").toLowerCase().includes(q) ||
      (p.casNumber || "").toLowerCase().includes(q)
    );
  }, [prods, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openNew = () => { setForm(emptyForm); setEditId(null); setShowForm(true); setError(""); window.scrollTo(0, 0); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      categoryId: p.categoryId || "",
      specification: p.specification || "",
      casNumber: p.casNumber || "",
      imageUrl: p.imageUrl || "",
      description: p.description || "",
      sortOrder: p.sortOrder,
      active: p.active,
      featured: p.featured,
      metaTitle: p.metaTitle || "",
      metaDescription: p.metaDescription || "",
      metaKeywords: p.metaKeywords || "",
    });
    setEditId(p.id);
    setShowForm(true);
    setError("");
    window.scrollTo(0, 0);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = { ...form, categoryId: form.categoryId || null };
      if (editId) await api.updateProduct(editId, data);
      else await api.createProduct(data);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete product "${name}"?`)) return;
    try { await api.deleteProduct(id); load(); } catch (err: any) { setError(err.message); }
  };

  const catName = (id?: string) => cats.find(c => c.id === id)?.name || "—";

  return (
    <AdminGuard>
      <AdminLayout title="Products">
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search products..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
              <button onClick={openNew} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                + Add Product
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{editId ? "Edit Product" : "New Product"}</h3>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={form.categoryId}
                      onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    >
                      <option value="">-- No Category --</option>
                      {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specification</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g. 2.5% Withanolides"
                      value={form.specification}
                      onChange={e => setForm(f => ({ ...f, specification: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CAS Number</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g. 90147-43-6"
                      value={form.casNumber}
                      onChange={e => setForm(f => ({ ...f, casNumber: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload
                      label="Product Image"
                      value={form.imageUrl}
                      onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={form.sortOrder}
                      onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2 justify-center">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 text-green-600" />
                      Active (visible on website)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 text-green-600" />
                      Featured (shown on homepage)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                    <span className="ml-1 font-normal text-gray-400 text-xs">(formatted text — renders exactly as shown on the website)</span>
                  </label>
                  <RichTextEditor
                    value={form.description}
                    onChange={val => setForm(f => ({ ...f, description: val }))}
                    placeholder="Describe this product — benefits, extraction method, applications..."
                  />
                </div>

                {/* SEO Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">🔍 SEO Settings <span className="text-gray-400 font-normal text-xs">(optional)</span></h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title <span className="text-gray-400 font-normal">(50–60 chars)</span></label>
                      <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} placeholder={`${form.name || "Product Name"} | Pukhraj Herbals`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description <span className="text-gray-400 font-normal">(150–160 chars)</span></label>
                      <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" rows={2} value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} placeholder="Brief description for search engines..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                      <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.metaKeywords} onChange={e => setForm(f => ({ ...f, metaKeywords: e.target.value }))} placeholder="herbal extract, ayurvedic, botanical..." />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-60 transition-colors">
                    {saving ? "Saving..." : "Save Product"}
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
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Product</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Category</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Specification</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pageItems.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-lg flex-shrink-0">🌿</div>
                            )}
                            <div>
                              <div className="font-medium text-gray-800">{p.name}</div>
                              {p.featured && <span className="text-xs text-amber-600 font-medium">★ Featured</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-gray-500">{catName(p.categoryId)}</td>
                        <td className="px-6 py-3 text-gray-500">{p.specification || "—"}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {p.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right space-x-2">
                          <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                          <button onClick={() => handleDelete(p.id, p.name)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {pageItems.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">{search ? "No products match your search." : "No products yet. Click \"+ Add Product\" to create one."}</td></tr>
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
