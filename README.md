<h1 align="center">🤖 Gallagher Rich Message Bot</h1>  
  
<p align="center">  
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white" />  
  <img src="https://img.shields.io/badge/Telegraf-4.16.3-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" />  
  <img src="https://img.shields.io/badge/telekaf-4.16.8-blueviolet?style=for-the-badge" />  
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />  
  <img src="https://img.shields.io/badge/Platform-Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" />  
</p>  
  
<p align="center">  
  Bot Telegram <b>Rich Message</b> multifungsi — tools, downloader, game, & fitur seru lainnya.  
  <br/>  
  Dibuat oleh <a href="https://t.me/suganzi"><b>@suganzi</b></a> (Gallagher).  
</p>  
  
---  
  
## ✨ Tentang  
  
Bot ini dibangun pakai [`@icanseeuanywhere/telekaf`](https://www.npmjs.com/package/@icanseeuanywhere/telekaf) — fork dari **Telegraf** yang punya fitur **Rich Message** (tabel, slideshow, inline keyboard bergaya, dsb). Semua fitur dijalankan dari satu file `index.js`.  
  
## 🚀 Cara Menjalankan  
  
```bash  
# 1. Clone repo  
git clone https://github.com/<username>/telegraf-rich.git  
cd telegraf-rich  
  
# 2. Install dependency  
npm install  
  
# 3. Buat file config.env, isi token bot lu  
echo "BOT_TOKEN=isi_token_bot_disini" > config.env  
  
# 4. Jalankan  
npm start        # produksi  
npm run dev      # mode development (auto-restart)  
```  
  
> ⚠️ **Jangan pernah commit `config.env`** ke GitHub — di dalamnya ada `BOT_TOKEN` lu. File ini sudah masuk `.gitignore`.  
  
## 🛠️ Tools Menu  
  
| Command | Fungsi |  
|---|---|  
| `/gempa` | Info gempa terbaru (BMKG) + ShakeMap |  
| `/done` | Membuat struk pembayaran |  
| `/ping` | Test latency bot |  
| `/restart` | Restart bot agar tidak delay |  
| `/tourl` | Ubah gambar jadi link |  
| `/dl` | Download TikTok, YouTube, IG |  
| `/cuaca` | Cek cuaca |  
  
## 🎮 Fun Menu  
  
| Command | Fungsi |  
|---|---|  
| `/pinterest` | Cari foto di Pinterest |  
| `/qc` | Teks jadi stiker quote |  
| `/play` | Cari & kirim lagu |  
| `/cekmiskin` | Cek Miskin |  
| `/cekkaya` | Cek Kaya |  
| `/cektolol` | Cek Tolol |  
| `/cektampan` | Cek Tampan |  
| `/cekcantik` | Cek Cantik |  
| `/ceksabar` | Cek Sabar |  
| `/spamngl` | Spam pesan NGL anonim |  
| `/tebakgambar` | Game tebak gambar |  
  
## 📦 Teknologi  
  
- **Runtime:** Node.js `20.x`  
- **Framework:** Telegraf `^4.16.3` + `@icanseeuanywhere/telekaf` `^4.16.8`  
- **Library pendukung:** `axios`, `chalk`, `moment-timezone`, `ora`, `pino`, `form-data`, `dotenv`  
  
## 👤 Developer  
  
- **Telegram:** [@suganzi](https://t.me/suganzi)  
- **Alias:** Gallagher  
  
---  
  
<p align="center"><i>"Powered by Suganzi."</i></p>
