import { useEffect } from "react";

const SITE_NAME = "Pukhraj Herbals";

function setMeta(selector: string, attrName: string, attrVal: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta") as HTMLMetaElement;
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

export function useSEO({ title, description, keywords, ogImage, ogType = "website" }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;
    if (description) setMeta('meta[name="description"]', "name", "description", description);
    if (keywords) setMeta('meta[name="keywords"]', "name", "keywords", keywords);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:type"]', "property", "og:type", ogType);
    if (description) setMeta('meta[property="og:description"]', "property", "og:description", description);
    if (ogImage) setMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    if (description) setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    if (ogImage) setMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);
  }, [title, description, keywords, ogImage, ogType]);
}
