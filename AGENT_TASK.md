# Task brief pentru implementare (Printly 3D)

## Context
Repo: `/Users/florindorobantu/Documents/New project/magazin-obiecte3d`
Stack: Next.js (App Router), Tailwind v4, framer-motion, @google/model-viewer.

## Ce trebuie să existe după implementare
1) Catalog cu 9 produse reale (pozele locale din `public/products/`).
2) CTA-uri WhatsApp funcționale (desktop + mobile) care folosesc `NEXT_PUBLIC_WA_NUMBER`.
3) Layout mobil dedicat (liste verticale) + layout desktop existent, actualizat pe brand „Printly”.
4) Branding/SEO actualizat: titlu „Printly • Print 3D la comandă”.

## Fișiere cheie (deja pregătite)
- `src/data/products.ts` – produse + linkuri locale la imagini.
- `src/components/MobileProductCard.tsx` – carduri pentru varianta mobilă.
- `src/components/ProductCard.tsx` – CTA WA cu mesaj RO; folosește `NEXT_PUBLIC_WA_NUMBER`.
- `src/components/Navbar.tsx` – buton WA actualizat, brand Printly.
- `src/app/page.tsx` – layout mobil + desktop.
- `src/app/layout.tsx` – metadata RO.
- `src/app/globals.css` – fundal punctat, utilitar `no-scrollbar`.
- Imagini: `public/products/*.jpg` (copiate din pozele utilizatorului).

## Pași de execuție
1) Asigură-te că lucrezi în repo-ul corect:
   ```bash
   cd "/Users/florindorobantu/Documents/New project/magazin-obiecte3d"
   ```
2) Instalează dependențe (dacă nu sunt):
   ```bash
   npm install
   ```
3) Setează numărul real de WhatsApp în `.env.local`:
   ```
   NEXT_PUBLIC_WA_NUMBER=4xxxxxxxxx
   ```
4) Rulează local:
   ```bash
   npm run dev
   ```
   și verifică http://localhost:3000 pe mobil (390px) și desktop (1440px).

## Ce să verifici / QA checklist
- [ ] Imaginile produselor se încarcă din `/products/...`.
- [ ] Butoanele „Cere pe WhatsApp” (mobil) și „Comandă HUD_INT” (desktop) deschid `wa.me/<NUMAR>?text=...`.
- [ ] Navbar buton „Comandă WA” folosește același număr.
- [ ] Layout mobil vizibil doar pe `< md`, desktop pe `>= md`.
- [ ] Branding „Printly” + metadata RO în tab/title.
- [ ] Nicio eroare la build (`npm run dev`).

## Dacă lipsește ceva
- Dacă apar 404 pe imagini, verifică prezența fișierelor în `public/products/`.
- Dacă nu se vede layoutul nou, verifică că IDE-ul este deschis în `magazin-obiecte3d`, nu în `magazin-3d`.

## Note
Modelele 3D folosesc placeholder GLB (astronaut). Dacă se livrează GLB reale, înlocuiește `modelUrl` în `src/data/products.ts` și eventual dezactivează auto-rotate pe mobil în `ModelViewer`.
