import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "./api";

const SettingsContext = createContext<Record<string, string>>({});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
