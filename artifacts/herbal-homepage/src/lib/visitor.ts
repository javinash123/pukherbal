import { api } from "./api";

let sessionId = "";

function getSessionId(): string {
  if (sessionId) return sessionId;
  const stored = sessionStorage.getItem("_ph_sid");
  if (stored) { sessionId = stored; return sessionId; }
  sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
  sessionStorage.setItem("_ph_sid", sessionId);
  return sessionId;
}

export function trackPageView(page: string) {
  try {
    api.trackVisit({
      page,
      referrer: document.referrer || "",
      sessionId: getSessionId(),
    }).catch(() => {});
  } catch {}
}
