# 🔮 ทำนายโชคชะตา (Fortune Prediction)

เว็บแอปพลิเคชันดูดวงและเสี่ยงทายโชคชะตาออนไลน์ระดับพรีเมียม รวมศาสตร์พยากรณ์ยอดนิยมทั้ง **ไพ่ยิปซี (Gypsy Tarot)**, **เซียมซีญี่ปุ่น (Omikuji)** และ **เซียมซีไทยโบราณ (Thai Siamsi)** ไว้ในที่เดียว พร้อมดีไซน์ Mystic Dark Theme สวยงาม แอนิเมชันลื่นไหล และรองรับระบบเสียงบรรยายคำทำนาย

---

## ✨ ฟีเจอร์หลัก (Features)

### 1. 🎴 ไพ่ยิปซีพยากรณ์ (Tarot Reading)
- **สำรับไพ่ Major Arcana 22 ใบ** ครบถ้วนตามศาสตร์โบราณ
- **รูปแบบการทำนายหลากหลาย**:
  - ☀️ **ดูดวงรายวัน (Daily)**: เสี่ยงทาย 1 ใบ เพื่อรับคำแนะนำสำหรับวันนี้
  - 🌙 **ดูดวงรายเดือน (Monthly)**: เปิดไพ่ 3 ใบ (อดีต/พื้นฐาน, ปัจจุบัน/สถานการณ์, อนาคต/ผลลัพธ์)
  - 🌟 **ดูดวงรายปี (Yearly)**: เปิดไพ่ 12 ใบ ทำนายแนวโน้มชีวิตตลอด 12 เดือน
  - ⚖️ **ถาม-ตอบ ใช่/ไม่ใช่ (Yes / No)**: ถามคำถามในใจแล้วเปิดไพ่ 1 ใบ ฟันธงความน่าจะเป็นพร้อมระดับความมั่นใจ
- **สารานุกรมไพ่ยิปซี (Tarot Encyclopedia)**: ค้นหาและอ่านความหมายเชิงลึกของไพ่แต่ละใบ (ภาพรวม, การงาน, การเงิน, ความรัก)
- **ระบบเสียงบรรยาย (Voice Reading)**: กดฟังเสียงอ่านคำทำนายภาษาไทยได้อัตโนมัติ (SpeechSynthesis API)
- **เอฟเฟกต์และแอนิเมชัน**: แอนิเมชันสับไพ่, คลิกเลือกไพ่จากสำรับ และการพลิกเปิดไพ่แบบ 3D

### 2. ⛩️ เซียมซีญี่ปุ่น (Omikuji)
- จำลองการเสี่ยงทายใบเซียมซีตามธรรมเนียมศาลเจ้าญี่ปุ่นโบราณ
- ระดับดวงชะตาหลากหลาย เช่น มหาโชค (大吉 - Dai-Kichi), โชคดี (吉 - Kichi), โชคปานกลาง (中吉 - Chū-Kichi) ฯลฯ
- คำทำนายละเอียดแยกตามหมวด: โชคลาภ ความรัก การงาน การเดินทาง สุขภาพ
- แอนิเมชันการเขย่ากระบอกเซียมซีไม้ และไม้เซียมซีพุ่งออกมา

### 3. 📜 เซียมซีไทยโบราณ (Thai Siamsi)
- เสี่ยงทายเซียมซี 28 ใบเซียมซีไทยโบราณ
- คำทำนายพร้อมบทกลอนไพเราะและคำแปลเข้าใจง่าย
- ระดับดวงชะตา (ดีมาก / ดี / ปานกลาง / ระวัง) พร้อมคำแนะนำเสริมมงคล

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Web APIs**: Web Audio API (Synthesizer Sound Effects), Web SpeechSynthesis API

---

## 🚀 เริ่มต้นใช้งาน (Getting Started)

### ความต้องการของระบบ (Prerequisites)
- [Node.js](https://nodejs.org/) (เวอร์ชัน 18 ขึ้นไป)
- `npm` หรือ `pnpm` / `yarn`

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันโหมด Development
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:5173` เพื่อเข้าใช้งาน

### 3. Build สำหรับ Production
```bash
npm run build
```
ไฟล์ Production จะถูกสร้างไว้ในโฟลเดอร์ `dist/`

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
gypsy-card/
├── public/
│   ├── cards/              # รูปภาพไพ่ยิปซี Major Arcana (0.jpg - 21.jpg)
│   └── favicon.svg         # ไอคอน Favicon ของเว็บไซต์
├── src/
│   ├── components/
│   │   ├── OmikujiPage.tsx     # คอมโพเนนต์หน้าเซียมซีญี่ปุ่น
│   │   └── ThaiSiamsiPage.tsx  # คอมโพเนนต์หน้าเซียมซีไทย
│   ├── data/
│   │   ├── tarotCards.ts       # ข้อมูลและคำทำนายไพ่ยิปซี 22 ใบ
│   │   ├── omikujiData.ts      # ข้อมูลเซียมซีญี่ปุ่น
│   │   └── thaiSiamsiData.ts   # ข้อมูลเซียมซีไทยโบราณ 28 ใบ
│   ├── App.tsx             # หน้าหลักและระบบการสลับแท็บเมนู
│   ├── index.css           # สไตล์สากลและเอฟเฟกต์สี/อนิเมชัน
│   └── main.tsx            # Entry point ของ React
├── index.html              # HTML Template หลัก
├── package.json
└── vite.config.ts
```

---


