import React, { useEffect, useState } from "react";
import AdminLayout from "./layout";
import AdminGuard from "./guard";
import { api } from "@/lib/api";
import { Link } from "wouter";

function StatCard({ label, value, icon, href, badge }: { label: string; value: number; icon: string; href: string; badge?: number }) {
  return (
    <Link href={href}>
      <a className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 hover:shadow-md transition-shadow relative">
        {badge ? <span className="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">{badge} new</span> : null}
        <div className="text-3xl">{icon}</div>
        <div>
          <div className="text-3xl font-bold text-gray-800">{value}</div>
          <div className="text-sm text-gray-500 mt-0.5">{label}</div>
        </div>
      </a>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, products: 0, blogs: 0, enquiries: 0, unreadEnquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAdminCategories(), api.getAdminProducts(), api.getAdminBlogs(), api.getAdminEnquiries()])
      .then(([cats, prods, blogs, enquiries]) => setStats({
        categories: cats.length,
        products: prods.length,
        blogs: blogs.length,
        enquiries: enquiries.length,
        unreadEnquiries: enquiries.filter((e: any) => !e.read).length,
      }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminGuard>
      <AdminLayout title="Dashboard">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Overview</h2>
            {loading ? (
              <div className="text-gray-400 text-sm">Loading stats...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Categories" value={stats.categories} icon="📂" href="/admin/categories" />
                <StatCard label="Products" value={stats.products} icon="🌿" href="/admin/products" />
                <StatCard label="Blog Posts" value={stats.blogs} icon="📝" href="/admin/blogs" />
                <StatCard label="Enquiries" value={stats.enquiries} icon="📬" href="/admin/enquiries" badge={stats.unreadEnquiries || undefined} />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { href: "/admin/categories", label: "Manage Categories", icon: "📂" },
                { href: "/admin/products", label: "Manage Products", icon: "🌿" },
                { href: "/admin/blogs", label: "Manage Blogs", icon: "📝" },
                { href: "/admin/enquiries", label: "View Enquiries", icon: "📬" },
                { href: "/admin/settings", label: "Site Settings", icon: "⚙️" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <a className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors text-center">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-green-800 mb-2">Admin Info</h3>
            <p className="text-sm text-green-700">Email: <strong>admin@pukhrajherbals.com</strong></p>
            <p className="text-sm text-green-700 mt-1">All changes made here reflect immediately on the public website. Data is stored in MongoDB Atlas.</p>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
