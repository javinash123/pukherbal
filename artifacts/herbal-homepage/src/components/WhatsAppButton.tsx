import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function WhatsAppButton() {
  const [phone, setPhone] = useState("");

  useEffect(() => {
    api.getSettings().then(s => {
      if (s.social_whatsapp) setPhone(s.social_whatsapp);
    }).catch(() => {});
  }, []);

  if (!phone) return null;

  const clean = phone.replace(/[^0-9+]/g, "");
  const href = `https://wa.me/${clean}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{ backgroundColor: "#25D366" }}
    >
      <svg viewBox="0 0 32 32" fill="white" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.002 2.667C8.638 2.667 2.668 8.636 2.668 16c0 2.352.643 4.558 1.762 6.455L2.668 29.333l7.085-1.738A13.28 13.28 0 0 0 16.002 29.333c7.364 0 13.334-5.97 13.334-13.333 0-7.364-5.97-13.333-13.334-13.333zm0 24c-2.146 0-4.148-.59-5.863-1.612l-.42-.25-4.207 1.032 1.062-4.094-.274-.435A10.62 10.62 0 0 1 5.335 16c0-5.88 4.787-10.667 10.667-10.667S26.668 10.12 26.668 16 21.882 26.667 16.002 26.667zm5.836-7.972c-.32-.16-1.894-.934-2.188-1.04-.294-.107-.508-.16-.722.16-.214.32-.83 1.04-.018 1.254.214.08.401.12.615.12.293 0 .614-.12.88-.32l.107-.08c.694-.587 1.067-1.12.613-1.734-.16-.214-.373-.294-.587-.35a9.14 9.14 0 0 0-.707-.214zM16 11.467c-2.5 0-4.534 2.033-4.534 4.533 0 .987.32 1.907.853 2.654l-1.12 3.253 3.36-1.067c.72.374 1.547.587 2.441.587 2.5 0 4.534-2.034 4.534-4.534S18.5 11.467 16 11.467zm0 8.267a3.74 3.74 0 0 1-2-.587l-.14-.08-1.627.52.533-1.56-.107-.147a3.71 3.71 0 0 1-.66-2.08c0-2.04 1.66-3.7 3.7-3.7s3.7 1.66 3.7 3.7-1.66 3.7-3.4 3.7z"/>
      </svg>
    </a>
  );
}
