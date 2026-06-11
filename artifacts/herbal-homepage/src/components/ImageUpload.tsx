import React, { useRef, useState } from "react";
import { API_BASE, resolveImageUrl } from "@/lib/api";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

function isUploadedFile(url: string) {
  return url.includes("/api/uploads/");
}

export function ImageUpload({ value, onChange, label = "Image" }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [tab, setTab] = useState<"upload" | "url">(value && !isUploadedFile(value) ? "url" : "upload");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      onChange(data.url);
      setTab("upload");
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      <div className="flex gap-1 mb-3 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === "upload" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          📁 Upload from Computer
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === "url" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          🔗 Paste URL
        </button>
      </div>

      {tab === "upload" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
            id="img-upload-input"
          />
          <label
            htmlFor="img-upload-input"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
              ${uploading ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-green-50 hover:border-green-400"}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-green-600 font-medium">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">📤</span>
                <span className="text-sm font-medium text-gray-600">Click to choose an image</span>
                <span className="text-xs text-gray-400">JPG, PNG, GIF, WebP, SVG — max 10MB</span>
              </div>
            )}
          </label>
          {uploadError && <p className="mt-1.5 text-xs text-red-500">{uploadError}</p>}
        </div>
      ) : (
        <div>
          <input
            type="url"
            value={isUploadedFile(value) ? "" : value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      )}

      {value && (
        <div className="mt-3 flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={resolveImageUrl(value) || value}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200 bg-gray-50"
              onError={e => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect fill='%23f3f4f6' width='96' height='96' rx='8'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-size='28' fill='%239ca3af'%3E🖼%3C/text%3E%3C/svg%3E";
              }}
            />
            <button
              type="button"
              onClick={handleRemove}
              title="Remove image"
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors shadow"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Current image</p>
            <p className="text-xs text-gray-400 truncate">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
