# FPL Drink League

แดชบอร์ดสรุปคะแนนเพื่อนใน [Drink League](https://fantasy.premierleague.com/th/leagues/530685)

แยกดูได้ 2 มุม:

- **GW สัปดาห์** — แต้ม GW ของวีคนั้น แยกจากแต้ม total ที่สะสมทุกวีค พร้อมค่าปรับตามอันดับ
- **GW รวม** — แต้ม total สะสมถึงเกมวีคที่เลือก พร้อมดูว่าใครขึ้นหรือหล่นอันดับ

ข้อมูลดึงจาก FPL public API เมื่อเปิดหน้าหรือกดรีเฟรชเอง

## รันโปรเจกต์

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## ลีกที่รองรับ (Multi-League Tabs)

หน้าระบบมี Tab ด้านบนให้กดสลับดูแต่ละลีกได้ทันที:
- 🍺 **DRINK LEAGUE** (ID: `530685`) — [เปิดใน FPL](https://fantasy.premierleague.com/th/leagues/530685)
- ⚽ **PAKDEETHAILAND** (ID: `1129447`) — [เปิดใน FPL](https://fantasy.premierleague.com/th/leagues/1129447/standings/c)

หรือเข้าดูผ่าน URL Query:
- `http://localhost:3000/?league=530685` (หรือ `?league=drink-league`)
- `http://localhost:3000/?league=1129447` (หรือ `?league=pakdeethailand`)

หากต้องการเพิ่ม/แก้ไขลีก สามารถเข้าไปกำหนดเพิ่มในไฟล์ [src/lib/leagues.ts](file:///d:/work/football/FPL-Drink-league/src/lib/leagues.ts) ได้อย่างง่ายดาย

## รูปภาพ

- **รูปทีม** ใช้ badge จาก FPL API ในตารางและกราฟแข่ง
- **รูปคน** ใช้ในตารางคะแนน GW ใส่ไฟล์ใน `public/managers/` แล้วตั้งชื่อตาม FPL entry id

- `2677805.jpg` Sweet Child
- `2935522.jpg` Phakapol Litthatiyaboot
- `3053813.jpg` Yodphet Khotluecha
- `2679268.jpg` Note Suii
- `2677009.jpg` Taloey Toeyz
- `2678236.jpg` Uddy PatHawee
- `8956797.jpg` Sarawut Meekrailat

รองรับ `.jpg` `.jpeg` `.png` `.webp` ถ้ายังไม่มีรูปคน ระบบจะโชว์ตัวย่อชื่อในตาราง

## Tech

- Node.js + TypeScript
- Next.js 15
- Tailwind CSS 4
