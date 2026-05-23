import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";

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
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

interface Category { id: string; name: string; }

const emptyForm = { name: "", categoryId: "" as any, specification: "", casNumber: "", imageUrl: "", description: "", sortOrder: 0, active: true, featured: false, seoTitle: "", seoDescription: "", seoKeywords: "" };

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

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
  const [showSeo, setShowSeo] = useState(false);

  const load = () => {
    Promise.all([api.getAdminProducts(), api.getAdminCategories()])
      .then(([p, c]) => { setProds(p); setCats(c); })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return prods;
    const q = search.toLowerCase();
    return prods.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.specification || "").toLowerCase().includes(q) ||
      (p.casNumber || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      cats.find(c => c.id === p.categoryId)?.name.toLowerCase().includes(q)
    );
  }, [prods, search, cats]);

  const openNew = () => { setForm(emptyForm); setEditId(null); setShowForm(true); setShowSeo(false); setError(""); };
  const openEdit = (p: Product) => {
    setForm({ name: p.name, categoryId: p.categoryId || "", specification: p.specification || "", casNumber: p.casNumber || "", imageUrl: p.imageUrl || "", description: p.description || "", sortOrder: p.sortOrder, active: p.active, featured: p.featured, seoTitle: p.seoTitle || "", seoDescription: p.seoDescription || "", seoKeywords: p.seoKeywords || "" });
    setEditId(p.id);
    setShowForm(true);
    setShowSeo(false);
    setError("");
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
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <input
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 max-w-xs w-full"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">{filtered.length} of {prods.length}</span>
            </div>
            <button onClick={openNew} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">+ Add Product</button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{editId ? "Edit Product" : "New Product"}</h3>
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input className={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className={inp} value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                    <option value="">-- No Category --</option>
                    {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specification</label>
                  <input className={inp} placeholder="e.g. 2.5% Withanolides" value={form.specification} onChange={e => setForm(f => ({ ...f, specification: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CAS Number</label>
                  <input className={inp} placeholder="e.g. 90147-43-6" value={form.casNumber} onChange={e => setForm(f => ({ ...f, casNumber: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <ImageUpload label="Image" value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className={inp} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" className={inp} value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
                <div className="flex flex-col gap-2 mt-5">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 text-green-600" />
                    Active (visible on website)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 text-green-600" />
                    Featured (shown on homepage)
                  </label>
                </div>

                {/* SEO Section */}
                <div className="md:col-span-2">
                  <button type="button" onClick={() => setShowSeo(v => !v)} className="flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900 transition-colors">
                    <span>{showSeo ? "▾" : "▸"}</span> SEO Settings (optional)
                  </button>
                  {showSeo && (
                    <div className="mt-3 grid grid-cols-1 gap-3 border-t border-gray-100 pt-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">SEO Title</label>
                        <input className={inp} placeholder="Leave blank to use product name" value={form.seoTitle} onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description <span className="text-gray-400">(max 160 chars)</span></label>
                        <textarea className={inp} rows={2} maxLength={160} placeholder="Brief description for search engines..." value={form.seoDescription} onChange={e => setForm(f => ({ ...f, seoDescription: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Keywords <span className="text-gray-400">(comma separated)</span></label>
                        <input className={inp} placeholder="herbal extract, ashwagandha, withania somnifera" value={form.seoKeywords} onChange={e => setForm(f => ({ ...f, seoKeywords: e.target.value }))} />
                      </div>
                    </div>
                  )}
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
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Category</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Specification</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="font-medium text-gray-800">{p.name}</div>
                        {p.featured && <span className="text-xs text-amber-600 font-medium">★ Featured</span>}
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
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">{search ? `No products match "${search}".` : "No products yet."}</td></tr>
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
