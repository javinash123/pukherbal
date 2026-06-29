import { useEffect } from "react";
import { Switch, Route, Router, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { SettingsProvider } from "@/lib/settings";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Categories from "@/pages/categories";
import CategoryDetail from "@/pages/category-detail";
import Blog from "@/pages/blog";
import BlogDetail from "@/pages/blog-detail";
import Contact from "@/pages/contact";
import Certifications from "@/pages/certifications";
import Sustainability from "@/pages/sustainability";
import Manufacturing from "@/pages/manufacturing";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCategories from "@/pages/admin/categories";
import AdminProducts from "@/pages/admin/products";
import AdminBlogs from "@/pages/admin/blogs";
import AdminSettings from "@/pages/admin/settings";
import AdminEnquiries from "@/pages/admin/enquiries";
import AdminHeroSlides from "@/pages/admin/hero-slides";
import AdminVideoItems from "@/pages/admin/video-items";
import Sitemap from "@/pages/sitemap";

const queryClient = new QueryClient();

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [location]);
  return null;
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/products" component={Products} />
      <Route path="/products/:slug" component={ProductDetail} />
      <Route path="/categories" component={Categories} />
      <Route path="/categories/:slug" component={CategoryDetail} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/certifications" component={Certifications} />
      <Route path="/sustainability" component={Sustainability} />
      <Route path="/manufacturing" component={Manufacturing} />
      <Route path="/sitemap" component={Sitemap} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/blogs" component={AdminBlogs} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/enquiries" component={AdminEnquiries} />
      <Route path="/admin/hero-slides" component={AdminHeroSlides} />
      <Route path="/admin/video-items" component={AdminVideoItems} />
      <Route path="/admin" component={AdminLogin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SettingsProvider>
            <Router base={base}>
              <ScrollToTop />
              <AppRouter />
            </Router>
          </SettingsProvider>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
