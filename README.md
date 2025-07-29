# Live Streaming Bola

## 📌 Fitur
- Next.js + Supabase CRUD FULL
- Tailwind CSS
- Admin Auth
- Import jadwal API-Football (tambahkan di admin)
- SSR untuk homepage jadwal

## 🚀 Setup

1. `npm install`
2. Buat `.env.local` dari `.env.example`
3. Jalankan `npm run dev`
4. Deploy ke Vercel/Netlify ➜ set env di dashboard

## ✅ Tables
- Supabase `matches`:
  - id (uuid)
  - sport
  - date
  - dateTime
  - team1
  - team2
  - league

## 🔒 RLS & Auth
Aktifkan RLS + buat policy admin only.
