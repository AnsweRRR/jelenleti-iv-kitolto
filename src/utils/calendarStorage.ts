export type StoredDayTypes = {
  expiry: string;
  data: [number, "leave" | "sick"][];
};

const STORAGE_KEY = "calendar-day-types";

export function saveDayTypes(year: number, month: number, dayTypes: Map<number, "leave" | "sick">) {
  const key = `${STORAGE_KEY}-${year}-${month}`;
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + 2); // 2 hónap

  const data: StoredDayTypes = {
    expiry: expiry.toISOString(),
    data: Array.from(dayTypes.entries())
  };

  localStorage.setItem(key, JSON.stringify(data));
}

export function loadDayTypes(year: number, month: number): Map<number, "leave" | "sick"> {
  const key = `${STORAGE_KEY}-${year}-${month}`;
  const raw = localStorage.getItem(key);
  if (!raw) return new Map();

  try {
    const parsed: StoredDayTypes = JSON.parse(raw);
    if (new Date(parsed.expiry) < new Date()) {
      localStorage.removeItem(key);
      return new Map();
    }
    return new Map(parsed.data);
  } catch (e) {
    console.error("Hibás dayTypes cache:", e);
    return new Map();
  }
}
