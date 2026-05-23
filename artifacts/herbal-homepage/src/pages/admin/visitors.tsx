import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";

interface Visitor {
  _id: string;
  ip: string;
  page: string;
  referrer: string;
  country: string;
  city: string;
  region: string;
  device: string;
  browser: string;
  sessionId: string;
  createdAt: string;
}

interface Stats {
  topPages: { _id: string; count: number }[];
  topCountries: { _id: string; count: number }[];
  deviceStats: { _id: string; count: number }[];
}

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterDevice, setFilterDevice] = useState("");
  const [filterBrowser, setFilterBrowser] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = useCallback((pg = 1) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(pg), limit: "50" };
    if (search) params.search = search;
    if (filterDevice) params.device = filterDevice;
    if (filterBrowser) params.browser = filterBrowser;
    if (filterCountry) params.country = filterCountry;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    api.getAdminVisitors(params).then(data => {
      setVisitors(data.visitors);
      setTotal(data.total);
      setPages(data.pages);
      setStats(data.stats);
      setCurrentPage(pg);
    }).catch(() => setError("Failed to load visitors"))
      .finally(() => setLoading(false));
  }, [search, filterDevice, filterBrowser, filterCountry, startDate, endDate]);

  useEffect(() => { load(1); }, [load]);

  const handleClearOld = async () => {
    if (!confirm("Delete visitors older than 90 days?")) return;
    try {
      const r = await api.deleteOldVisitors(90);
      alert(`Deleted ${r.deleted} old records.`);
      load(1);
    } catch {}
  };

  const deviceTotal = stats?.deviceStats.reduce((a, d) => a + d.count, 0) || 1;

  return (
    <AdminGuard>
      <AdminLayout title="Visitor Analytics">
        <div className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top Pages */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Top Pages</h3>
                <div className="space-y-2">
                  {stats.topPages.slice(0, 6).map(p => (
                    <div key={p._id} className="flex items-center gap-2 text-sm">
                      <div className="flex-1 truncate text-gray-600" title={p._id}>{p._id}</div>
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{p.count}</span>
                    </div>
                  ))}
                  {stats.topPages.length === 0 && <div className="text-gray-400 text-xs">No data yet</div>}
                </div>
              </div>

              {/* Top Countries */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Top Countries</h3>
                <div className="space-y-2">
                  {stats.topCountries.slice(0, 6).map(c => (
                    <div key={c._id} className="flex items-center gap-2 text-sm">
                      <div className="flex-1 text-gray-600">{c._id || "Unknown"}</div>
                      <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{c.count}</span>
                    </div>
                  ))}
                  {stats.topCountries.length === 0 && <div className="text-gray-400 text-xs">No location data yet</div>}
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Devices</h3>
                <div className="space-y-3">
                  {stats.deviceStats.map(d => (
                    <div key={d._id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{d._id || "Unknown"}</span>
                        <span className="text-gray-500">{Math.round((d.count / deviceTotal) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.round((d.count / deviceTotal) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                  {stats.deviceStats.length === 0 && <div className="text-gray-400 text-xs">No data yet</div>}
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <input
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 xl:col-span-2"
                placeholder="Search page, country, city, IP..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={filterDevice} onChange={e => setFilterDevice(e.target.value)}>
                <option value="">All Devices</option>
                <option>Desktop</option>
                <option>Mobile</option>
                <option>Tablet</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={filterBrowser} onChange={e => setFilterBrowser(e.target.value)}>
                <option value="">All Browsers</option>
                <option>Chrome</option>
                <option>Firefox</option>
                <option>Safari</option>
                <option>Edge</option>
                <option>Other</option>
              </select>
              <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="Start date" />
              <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End date" />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-500">{total} total visits matching filters</span>
              <div className="flex gap-2">
                <button onClick={() => { setSearch(""); setFilterDevice(""); setFilterBrowser(""); setFilterCountry(""); setStartDate(""); setEndDate(""); }} className="text-sm text-gray-500 hover:text-gray-700 underline">Reset</button>
                <button onClick={handleClearOld} className="text-sm text-red-500 hover:text-red-700 underline ml-4">Delete old records (90+ days)</button>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Page</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Location</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Device</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Browser</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">IP</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {visitors.map(v => (
                      <tr key={v._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 max-w-xs">
                          <div className="truncate text-gray-800 font-medium" title={v.page}>{v.page}</div>
                          {v.referrer && <div className="text-xs text-gray-400 truncate" title={v.referrer}>from: {v.referrer}</div>}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div>{v.country || "—"}</div>
                          {v.city && <div className="text-xs text-gray-400">{v.city}{v.region ? `, ${v.region}` : ""}</div>}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{v.device || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{v.browser || "—"}</td>
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{v.ip || "—"}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(v.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                    {visitors.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No visitor data found for the selected filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Page {currentPage} of {pages}</span>
                  <div className="flex gap-2">
                    <button onClick={() => load(currentPage - 1)} disabled={currentPage <= 1} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50">Previous</button>
                    <button onClick={() => load(currentPage + 1)} disabled={currentPage >= pages} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
