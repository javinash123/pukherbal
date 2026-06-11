export const API_BASE: string = import.meta.env.VITE_API_BASE || "/api";

/**
 * Converts a stored image URL (e.g. /api/uploads/file.jpg) to a full URL
 * using the current API base. Absolute URLs are returned unchanged.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Handle /api/uploads/... (new format from upload route)
  if (url.startsWith("/api/")) return `${API_BASE}${url.slice(4)}`;
  // Handle /pukhrajherbals/api/uploads/... (old stored format — strip the base prefix)
  const apiIdx = url.indexOf("/api/");
  if (apiIdx !== -1) return `${API_BASE}${url.slice(apiIdx + 4)}`;
  return url;
}

function getToken() { return localStorage.getItem("admin_token"); }

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) => request<{ token: string; user: { id: string; name: string; email: string; role: string } }>("POST", "/auth/login", { email, password }),
  me: () => request<{ id: string; name: string; email: string; role: string }>("GET", "/auth/me"),

  // Categories (public)
  getCategories: () => request<any[]>("GET", "/categories"),
  getCategory: (slug: string) => request<any>("GET", `/categories/${slug}`),
  getAdminCategories: () => request<any[]>("GET", "/admin/categories"),
  createCategory: (data: any) => request<any>("POST", "/admin/categories", data),
  updateCategory: (id: string, data: any) => request<any>("PUT", `/admin/categories/${id}`, data),
  deleteCategory: (id: string) => request<any>("DELETE", `/admin/categories/${id}`),

  // Products (public)
  getProducts: (categoryId?: string) => request<any[]>("GET", `/products${categoryId ? `?categoryId=${categoryId}` : ""}`),
  getProduct: (slug: string) => request<any>("GET", `/products/${slug}`),
  getAdminProducts: () => request<any[]>("GET", "/admin/products"),
  createProduct: (data: any) => request<any>("POST", "/admin/products", data),
  updateProduct: (id: string, data: any) => request<any>("PUT", `/admin/products/${id}`, data),
  deleteProduct: (id: string) => request<any>("DELETE", `/admin/products/${id}`),

  // Blogs (public)
  getBlogs: () => request<any[]>("GET", "/blogs"),
  getBlog: (slug: string) => request<any>("GET", `/blogs/${slug}`),
  getAdminBlogs: () => request<any[]>("GET", "/admin/blogs"),
  createBlog: (data: any) => request<any>("POST", "/admin/blogs", data),
  updateBlog: (id: string, data: any) => request<any>("PUT", `/admin/blogs/${id}`, data),
  deleteBlog: (id: string) => request<any>("DELETE", `/admin/blogs/${id}`),

  // Settings
  getSettings: () => request<Record<string, string>>("GET", "/settings"),
  updateSetting: (key: string, value: string) => request<any>("PUT", `/admin/settings/${key}`, { value }),

  // Enquiries
  createEnquiry: (data: any) => request<any>("POST", "/enquiries", data),
  getAdminEnquiries: (status?: string) => request<any[]>("GET", `/admin/enquiries${status ? `?status=${status}` : ""}`),
  updateEnquiry: (id: string, data: any) => request<any>("PUT", `/admin/enquiries/${id}`, data),
  deleteEnquiry: (id: string) => request<any>("DELETE", `/admin/enquiries/${id}`),

  // Hero Slides
  getHeroSlides: () => request<any[]>("GET", "/hero-slides"),
  getAdminHeroSlides: () => request<any[]>("GET", "/admin/hero-slides"),
  createHeroSlide: (data: any) => request<any>("POST", "/admin/hero-slides", data),
  updateHeroSlide: (id: string, data: any) => request<any>("PUT", `/admin/hero-slides/${id}`, data),
  deleteHeroSlide: (id: string) => request<any>("DELETE", `/admin/hero-slides/${id}`),

  // Video Items
  getVideoItems: () => request<any[]>("GET", "/video-items"),
  getAdminVideoItems: () => request<any[]>("GET", "/admin/video-items"),
  createVideoItem: (data: any) => request<any>("POST", "/admin/video-items", data),
  updateVideoItem: (id: string, data: any) => request<any>("PUT", `/admin/video-items/${id}`, data),
  deleteVideoItem: (id: string) => request<any>("DELETE", `/admin/video-items/${id}`),
};
