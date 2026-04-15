import React, { type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Link } from "wouter";

interface Props {
  children: ReactNode;
  title: string;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/categories", label: "Categories", icon: "📂" },
  { href: "/admin/products", label: "Products", icon: "🌿" },
  { href: "/admin/blogs", label: "Blog Posts", icon: "📝" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout({ children, title }: Props) {
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-sm">PH</div>
            <div>
              <div className="font-semibold text-sm">Pukhraj Herbals</div>
              <div className="text-green-400 text-xs">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location === item.href || location.startsWith(item.href + "/") ? "bg-green-700 text-white" : "text-green-200 hover:bg-green-800 hover:text-white"}`}>
                <span>{item.icon}</span>
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-green-800">
          <div className="text-xs text-green-400 mb-3 px-4">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-green-200 hover:bg-green-800 hover:text-white transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          <div className="text-sm text-gray-500">Welcome, {user?.name}</div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
