# Jelenléti ív kitöltő

Ez egy **Chrome Extensionként** is használható webes alkalmazás, amely segít a havi **jelenléti ívek automatikus kitöltésében**.  
A PDF sablon feltöltése után megadhatóak az alapadatok (munkaidő, aláírás), kijelölhetők a szabadság- és táppénzes napok, majd az alkalmazás legenerálja a kitöltött jelenléti ívet.

---

## ✨ Funkciók

- 📂 **PDF sablon feltöltése** – egyéni jelenléti ív PDF-ből.
- ⚙️ **Alapadatok beállítása** – érkezés, távozás, ledolgozott órák, aláírás.
- 🖼️ **Aláírás feltöltése** – PNG aláíráskép használata, automatikus átméretezéssel.
- 📅 **Naptár nézet** – napok kijelölése szabadságra vagy táppénzre.
- 🔴 **Hétvégék és munkaszüneti napok** automatikus kiemelése az [szunetnapok.hu](https://szunetnapok.hu) API alapján.
- 💾 **Konfiguráció mentése** – az alapadatok és beállítások elmentődnek a böngészőben (localStorage).
- 📑 **Kitöltött PDF letöltése** – a feltöltött fájl nevéből `_filled` postfixszel készül az új fájl.

---

## 🚀 Telepítés és futtatás

1. **Követelmények**
   - [Node.js](https://nodejs.org/) (>= 18)
   - [pnpm](https://pnpm.io/) vagy npm/yarn

2. **Kódbázis klónozása**
   ```bash
   git clone https://github.com/felhasznalo/jelenleti-iv-kitolto.git
   cd jelenleti-iv-kitolto
   ```

3. **Függőségek telepítése**
   ```bash
   pnpm install
   # vagy: npm install
   ```

4. **Fejlesztői szerver indítása**
   ```bash
   pnpm dev
   # vagy: npm run dev
   ```

5. **Build készítése**
   ```bash
   pnpm build
   ```

---

## 🔧 Testreszabás

### Alapértelmezett adatok
Az `public/default-data.json` fájlban találhatók:
```json
{
  "arrival": "8:00",
  "leave": "16:30",
  "worked": "8",
  "signature": "Gipsz Jakab"
}
```
Ezeket a felhasználó a **fogaskerék ikonra kattintva** felül tudja írni. A változtatások automatikusan elmentődnek a böngésző `localStorage`-jába.

### Aláírás
- Feltölthető egy saját aláírás PNG fájl.
- Ha nincs feltöltve, a program nem tesz aláírást a dokumentumba.
- A kép automatikusan átméreteződik, hogy ne lógjon ki a cellából.

### Háttérkép & lábléc
- A háttérkép a `public/background.jpg`.
- A láblécben megjelenő logó/kép a `public/footer-image.png`.

---

## 🌐 Chrome Extension mód

1. Build készítése:
   ```bash
   pnpm build
   ```
2. A buildelt fájlok a `dist/` mappába kerülnek.
3. Chrome böngészőben:  
   - Nyisd meg a `chrome://extensions/` oldalt  
   - Kapcsold be a **Fejlesztői módot**  
   - Válaszd a **Betöltés kicsomagolt bővítményként** opciót, és tallózd be a `dist/` mappát.

---

## 📡 API használat (szunetnapok.hu)

Az alkalmazás az [szunetnapok.hu](https://szunetnapok.hu) API-ját használja a munkaszüneti napok és áthelyezett munkanapok jelölésére.

- Az adatok **cachelve** vannak a `localStorage`-ban 1 évig.
- Ez csökkenti a felesleges API hívásokat.

---

## 👨‍💻 Fejlesztőknek

- **UI könyvtárak**: [MUI](https://mui.com/), [MUI X Date Pickers](https://mui.com/x/react-date-pickers/)  
- **PDF kezelés**: [pdf-lib](https://pdf-lib.js.org/)  
- **Dátum kezelés**: [date-fns](https://date-fns.org/)  

Projekt felépítése:
```
src/
 ├── components/   # újrafelhasználható komponensek (FileUploadStep, DataStep, CalendarStep, stb.)
 ├── pages/        # oldalak (FillForm)
 ├── utils/        # segédfüggvények (pl. holidays.ts)
 ├── App.tsx       # belépési pont
public/
 ├── default-data.json   # alapadatok
 ├── background.jpg      # háttér
 ├── footer-image.png    # lábléc kép
```

---

## 📜 Licenc

MIT License
