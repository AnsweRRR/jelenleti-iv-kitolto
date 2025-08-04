export type Holiday = {
  date: string;
  type: '1' | '2';
};

export async function getHolidaysForYear(apiKey: string, year: number): Promise<Holiday[]> {
  const cacheKey = `holidays-${year}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const expiry = new Date(parsed.expiry);

      if (expiry > new Date() && Array.isArray(parsed.data)) {
        return parsed.data as Holiday[];
      }
    } catch (error) {
      console.warn("Hibás cache a localStorage-ben:", error);
    }
  }

  const url = `https://szunetnapok.hu/api/${apiKey}/${year}`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.response !== "OK") {
    throw new Error(`Sikertelen API válasz: ${json.response}`);
  }

  const holidays: Holiday[] = json.days.map((d: Holiday) => ({
    date: d.date,
    type: d.type,
  }));

  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);

  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      expiry: expiry.toISOString(),
      data: holidays,
    })
  );

  return holidays;
}
