import React, { useEffect, useState } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";

interface Enquiry {
  id: string; name: string; email: string; company?: string; phone?: string;
  productOfInterest?: string; message: string; status: string; createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  read: "bg-gray-100 text-gray-600",
  replied: "bg-green-100 text-green-700",
};

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = (status?: string) => {
    setLoading(true);
    api.getAdminEnquiries(status || undefined)
      .then(setEnquiries)
      .catch(() => setError("Failed to load enquiries"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(filter || undefined); }, [filter]);

  const markStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await api.updateEnquiry(id, { status });
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    } catch { setError("Failed to update status"); }
    finally { setUpdating(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    try {
      await api.deleteEnquiry(id);
      setEnquiries(prev => prev.filter(e => e.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch { setError("Failed to delete"); }
  };

  const counts = { all: enquiries.length, new: enquiries.filter(e => e.status === "new").length };

  return (
    <AdminGuard>
      <AdminLayout title="Enquiries">
        <div className="space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}

          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "All", value: "" },
              { label: "New", value: "new" },
              { label: "Read", value: "read" },
              { label: "Replied", value: "replied" },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === value ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {label} {value === "" && `(${counts.all})`}
                {value === "new" && counts.new > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{counts.new}</span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-6 text-gray-400 text-sm">Loading...</div>
              ) : enquiries.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No enquiries found.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {enquiries.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => setSelected(e)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === e.id ? "bg-green-50 border-l-2 border-green-600" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-gray-800 truncate">{e.name}</div>
                          <div className="text-xs text-gray-500 truncate">{e.email}</div>
                          {e.productOfInterest && (
                            <div className="text-xs text-gray-400 truncate mt-0.5">🌿 {e.productOfInterest}</div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[e.status] || STATUS_COLORS.read}`}>
                            {e.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{e.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detail */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {!selected ? (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                  Select an enquiry to view details
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{selected.name}</h3>
                      <div className="text-sm text-gray-500 mt-0.5">{selected.email}</div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[selected.status] || STATUS_COLORS.read}`}>
                      {selected.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selected.company && (
                      <div><span className="text-gray-500">Company:</span> <span className="font-medium">{selected.company}</span></div>
                    )}
                    {selected.phone && (
                      <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selected.phone}</span></div>
                    )}
                    {selected.productOfInterest && (
                      <div className="col-span-2"><span className="text-gray-500">Product of Interest:</span> <span className="font-medium">{selected.productOfInterest}</span></div>
                    )}
                    <div className="col-span-2">
                      <span className="text-gray-500">Received:</span>{" "}
                      <span className="font-medium">{new Date(selected.createdAt).toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Message:</div>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-200">
                      {selected.message}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    {selected.status !== "read" && (
                      <button
                        onClick={() => markStatus(selected.id, "read")}
                        disabled={updating === selected.id}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        Mark as Read
                      </button>
                    )}
                    {selected.status !== "replied" && (
                      <button
                        onClick={() => markStatus(selected.id, "replied")}
                        disabled={updating === selected.id}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        Mark as Replied
                      </button>
                    )}
                    <a
                      href={`mailto:${selected.email}?subject=Re: Your Enquiry at Pukhraj Herbals`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Reply via Email
                    </a>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="ml-auto bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
