import { useState, useEffect, useMemo } from "react";
import AdminLayout from "./layout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  message: string;
  rating: number;
  imageUrl: string;
  active: boolean;
  sortOrder: number;
}

const empty = (): Omit<Testimonial, "id"> => ({
  name: "", designation: "", company: "", message: "",
  rating: 5, imageUrl: "", active: true, sortOrder: 0,
});

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    api.getAdminTestimonials().then(setItems).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.company.toLowerCase().includes(q) ||
      t.designation.toLowerCase().includes(q) ||
      t.message.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openCreate = () => { setForm(empty()); setEditing(null); setCreating(true); setError(""); };
  const openEdit = (t: Testimonial) => { setForm({ ...t }); setEditing(t); setCreating(false); setError(""); };
  const closeModal = () => { setCreating(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.message.trim()) { setError("Name and message are required."); return; }
    setSaving(true); setError("");
    try {
      if (editing) {
        await api.updateTestimonial(editing.id, form);
      } else {
        await api.createTestimonial(form);
      }
      closeModal(); load();
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await api.deleteTestimonial(id).catch(() => {});
    load();
  };

  const handleToggle = async (t: Testimonial) => {
    await api.updateTestimonial(t.id, { active: !t.active }).catch(() => {});
    load();
  };

  const f = (key: keyof typeof form, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <AdminLayout title="Testimonials">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 max-w-xs w-full"
            placeholder="Search testimonials..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="text-sm text-gray-500 whitespace-nowrap">{filtered.length} of {items.length}</span>
        </div>
        <Button onClick={openCreate} className="bg-green-700 hover:bg-green-800 text-white whitespace-nowrap">+ Add Testimonial</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-4">{search ? `No testimonials match "${search}".` : "No testimonials yet."}</p>
          {!search && <Button onClick={openCreate} className="bg-green-700 hover:bg-green-800 text-white">Add Your First Testimonial</Button>}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-sm shrink-0">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{t.name}</div>
                    <div className="text-xs text-gray-500">{[t.designation, t.company].filter(Boolean).join(" · ")}</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-yellow-400 text-sm">
                    {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 italic">"{t.message}"</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${t.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  {t.active ? "Active" : "Inactive"}
                </button>
                <Button variant="outline" size="sm" onClick={() => openEdit(t)} className="text-xs">Edit</Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(t.id)} className="text-xs text-red-600 hover:bg-red-50 border-red-200">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {(creating || editing) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">{editing ? "Edit Testimonial" : "Add Testimonial"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Name *</label>
                <Input value={form.name} onChange={e => f("name", e.target.value)} placeholder="Customer name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Designation</label>
                  <Input value={form.designation} onChange={e => f("designation", e.target.value)} placeholder="CEO, Manager..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Company</label>
                  <Input value={form.company} onChange={e => f("company", e.target.value)} placeholder="Company name" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Message *</label>
                <Textarea value={form.message} onChange={e => f("message", e.target.value)} placeholder="What did they say about your products?" className="min-h-[100px] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Rating (1–5)</label>
                  <select
                    value={form.rating}
                    onChange={e => f("rating", Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Sort Order</label>
                  <Input type="number" value={form.sortOrder} onChange={e => f("sortOrder", Number(e.target.value))} />
                </div>
              </div>
              <div>
                <ImageUpload label="Photo (optional)" value={form.imageUrl} onChange={url => f("imageUrl", url)} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={form.active}
                  onChange={e => f("active", e.target.checked)}
                  className="w-4 h-4 accent-green-700"
                />
                <label htmlFor="active-toggle" className="text-sm font-medium text-gray-700">Active (visible on website)</label>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <Button variant="outline" onClick={closeModal} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-green-700 hover:bg-green-800 text-white">
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Testimonial"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
