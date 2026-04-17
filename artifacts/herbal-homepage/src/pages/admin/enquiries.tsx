import React, { useEffect, useState } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);

  const load = () => {
    api.getAdminEnquiries()
      .then(setEnquiries)
      .catch(() => setError("Failed to load enquiries"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleView = async (enq: Enquiry) => {
    setSelected(enq);
    if (!enq.read) {
      try {
        await api.markEnquiryRead(enq.id);
        setEnquiries(prev => prev.map(e => e.id === enq.id ? { ...e, read: true } : e));
      } catch {}
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await api.deleteEnquiry(id);
      if (selected?.id === id) setSelected(null);
      load();
    } catch (err: any) { setError(err.message); }
  };

  const unreadCount = enquiries.filter(e => !e.read).length;

  return (
    <AdminGuard>
      <AdminLayout title="Enquiries">
        <div className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {enquiries.length} total enquiries
              {unreadCount > 0 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">{unreadCount} unread</span>}
            </p>
          </div>

          <div className="flex gap-6">
            {/* Enquiry list */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-6 text-gray-400 text-sm">Loading...</div>
              ) : enquiries.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No enquiries yet.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === enq.id ? "bg-green-50 border-l-4 border-green-600" : ""}`}
                      onClick={() => handleView(enq)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!enq.read && <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0" />}
                            <span className={`font-medium text-sm ${enq.read ? "text-gray-700" : "text-gray-900"}`}>{enq.name}</span>
                            {enq.company && <span className="text-xs text-gray-400">· {enq.company}</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{enq.email}</div>
                          {enq.subject && <div className="text-sm text-gray-600 mt-1 truncate">{enq.subject}</div>}
                          <div className="text-xs text-gray-400 mt-1 line-clamp-2">{enq.message}</div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-xs text-gray-400">{new Date(enq.createdAt).toLocaleDateString()}</div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(enq.id); }}
                            className="text-xs text-red-500 hover:text-red-700 mt-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="w-96 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 self-start sticky top-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Enquiry Details</h3>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">From</div>
                    <div className="text-gray-800 font-medium">{selected.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Email</div>
                    <a href={`mailto:${selected.email}`} className="text-green-700 hover:underline">{selected.email}</a>
                  </div>
                  {selected.phone && (
                    <div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Phone</div>
                      <div className="text-gray-800">{selected.phone}</div>
                    </div>
                  )}
                  {selected.company && (
                    <div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Company</div>
                      <div className="text-gray-800">{selected.company}</div>
                    </div>
                  )}
                  {selected.subject && (
                    <div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Subject</div>
                      <div className="text-gray-800">{selected.subject}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Message</div>
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selected.message}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Received</div>
                    <div className="text-gray-600">{new Date(selected.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your enquiry"}`}
                    className="flex-1 text-center bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
