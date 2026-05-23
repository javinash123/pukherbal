const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/api`;

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
  login: (email: string, password: string) => request<{ token: string; user: { id: string; name: string; email: string; role: string } }>("POST", "/auth/login", { email, password }),
  me: () => request<{ id: string; name: string; email: string; role: string }>("GET", "/auth/me"),

  // Categories (public)
  getCategories: () => request<any[]>("GET", "/categories"),
  getCategory: (slug: string) => request<any>("GET", `/categories/${slug}`),
  // Categories (admin)
  getAdminCategories: () => request<any[]>("GET", "/admin/categories"),
  createCategory: (data: any) => request<any>("POST", "/admin/categories", data),
  updateCategory: (id: string, data: any) => request<any>("PUT", `/admin/categories/${id}`, data),
  deleteCategory: (id: string) => request<any>("DELETE", `/admin/categories/${id}`),

  // Products (public)
  getProducts: (categoryId?: string) => request<any[]>("GET", `/products${categoryId ? `?categoryId=${categoryId}` : ""}`),
  getProduct: (slug: string) => request<any>("GET", `/products/${slug}`),
  // Products (admin)
  getAdminProducts: () => request<any[]>("GET", "/admin/products"),
  createProduct: (data: any) => request<any>("POST", "/admin/products", data),
  updateProduct: (id: string, data: any) => request<any>("PUT", `/admin/products/${id}`, data),
  deleteProduct: (id: string) => request<any>("DELETE", `/admin/products/${id}`),

  // Blogs (public)
  getBlogs: () => request<any[]>("GET", "/blogs"),
  getBlog: (slug: string) => request<any>("GET", `/blogs/${slug}`),
  // Blogs (admin)
  getAdminBlogs: () => request<any[]>("GET", "/admin/blogs"),
  createBlog: (data: any) => request<any>("POST", "/admin/blogs", data),
  updateBlog: (id: string, data: any) => request<any>("PUT", `/admin/blogs/${id}`, data),
  deleteBlog: (id: string) => request<any>("DELETE", `/admin/blogs/${id}`),

  // Testimonials (public)
  getTestimonials: () => request<any[]>("GET", "/testimonials"),
  // Testimonials (admin)
  getAdminTestimonials: () => request<any[]>("GET", "/admin/testimonials"),
  createTestimonial: (data: any) => request<any>("POST", "/admin/testimonials", data),
  updateTestimonial: (id: string, data: any) => request<any>("PUT", `/admin/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => request<any>("DELETE", `/admin/testimonials/${id}`),

  // Settings
  getSettings: () => request<Record<string, string>>("GET", "/settings"),
  updateSetting: (key: string, value: string) => request<any>("PUT", `/admin/settings/${key}`, { value }),

  // Enquiries (public)
  submitEnquiry: (data: { name: string; email: string; phone?: string; company?: string; subject?: string; message: string }) =>
    request<{ success: boolean; id: string }>("POST", "/enquiries", data),
  // Enquiries (admin)
  getAdminEnquiries: () => request<any[]>("GET", "/admin/enquiries"),
  markEnquiryRead: (id: string) => request<any>("PUT", `/admin/enquiries/${id}/read`, {}),
  deleteEnquiry: (id: string) => request<any>("DELETE", `/admin/enquiries/${id}`),

  // Hero Slides (public)
  getHeroSlides: () => request<any[]>("GET", "/hero-slides"),
  // Hero Slides (admin)
  getAdminHeroSlides: () => request<any[]>("GET", "/admin/hero-slides"),
  createHeroSlide: (data: any) => request<any>("POST", "/admin/hero-slides", data),
  updateHeroSlide: (id: string, data: any) => request<any>("PUT", `/admin/hero-slides/${id}`, data),
  deleteHeroSlide: (id: string) => request<any>("DELETE", `/admin/hero-slides/${id}`),

  // Videos (public)
  getVideos: () => request<any[]>("GET", "/videos"),
  // Videos (admin)
  getAdminVideos: () => request<any[]>("GET", "/admin/videos"),
  createVideo: (data: any) => request<any>("POST", "/admin/videos", data),
  updateVideo: (id: string, data: any) => request<any>("PUT", `/admin/videos/${id}`, data),
  deleteVideo: (id: string) => request<any>("DELETE", `/admin/videos/${id}`),

  // Visitors (admin)
  getAdminVisitors: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>("GET", `/admin/visitors${qs}`);
  },
  trackVisit: (data: { page: string; referrer?: string; sessionId?: string }) =>
    request<any>("POST", "/visitors/track", data),
  deleteOldVisitors: (days?: number) =>
    request<any>("DELETE", `/admin/visitors${days ? `?days=${days}` : ""}`),
};
