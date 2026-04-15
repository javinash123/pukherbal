const BASE = "/api";

function getToken() {
  return localStorage.getItem("admin_token");
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) => request<{ token: string; user: { id: number; name: string; email: string; role: string } }>("POST", "/auth/login", { email, password }),
  me: () => request<{ id: number; name: string; email: string; role: string }>("GET", "/auth/me"),

  // Categories (public)
  getCategories: () => request<any[]>("GET", "/categories"),
  // Categories (admin)
  getAdminCategories: () => request<any[]>("GET", "/admin/categories"),
  createCategory: (data: any) => request<any>("POST", "/admin/categories", data),
  updateCategory: (id: number, data: any) => request<any>("PUT", `/admin/categories/${id}`, data),
  deleteCategory: (id: number) => request<any>("DELETE", `/admin/categories/${id}`),

  // Products (public)
  getProducts: (categoryId?: number) => request<any[]>("GET", `/products${categoryId ? `?categoryId=${categoryId}` : ""}`),
  // Products (admin)
  getAdminProducts: () => request<any[]>("GET", "/admin/products"),
  createProduct: (data: any) => request<any>("POST", "/admin/products", data),
  updateProduct: (id: number, data: any) => request<any>("PUT", `/admin/products/${id}`, data),
  deleteProduct: (id: number) => request<any>("DELETE", `/admin/products/${id}`),

  // Blogs (public)
  getBlogs: () => request<any[]>("GET", "/blogs"),
  getBlog: (slug: string) => request<any>("GET", `/blogs/${slug}`),
  // Blogs (admin)
  getAdminBlogs: () => request<any[]>("GET", "/admin/blogs"),
  createBlog: (data: any) => request<any>("POST", "/admin/blogs", data),
  updateBlog: (id: number, data: any) => request<any>("PUT", `/admin/blogs/${id}`, data),
  deleteBlog: (id: number) => request<any>("DELETE", `/admin/blogs/${id}`),

  // Settings
  getSettings: () => request<Record<string, string>>("GET", "/settings"),
  updateSetting: (key: string, value: string) => request<any>("PUT", `/admin/settings/${key}`, { value }),
};
