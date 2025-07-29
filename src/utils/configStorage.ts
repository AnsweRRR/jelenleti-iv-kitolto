import type { Defaults } from "../components/ConfigDialog";

// chrome deklaráció, ha nincs típus
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const chrome: any;

function isChromeStorageAvailable() {
  return typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;
}

export function getConfig(): Promise<Defaults | null> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.get("attendance-config", (result: Record<string, unknown>) => {
        resolve(result["attendance-config"] as Defaults ?? null);
      });
    });
  } else {
    const saved = localStorage.getItem("attendance-config");
    return Promise.resolve(saved ? JSON.parse(saved) : null);
  }
}

export function setConfig(config: Defaults): Promise<void> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ "attendance-config": config }, () => {
        resolve();
      });
    });
  } else {
    localStorage.setItem("attendance-config", JSON.stringify(config));
    return Promise.resolve();
  }
} 