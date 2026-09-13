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

ถ้าจะชี้ไปลีกอื่น สร้างไฟล์ `.env.local`:

```
LEAGUE_ID=530685
```

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
