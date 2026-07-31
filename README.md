# Telegraf Rich Message Bot

Bot Telegram dengan [Telegraf](https://telegraf.js.org) yang fokus pada **rich message**: teks berformat HTML, inline keyboard interaktif, foto dengan caption, album (media group), reply keyboard, dan polling.

## Fitur

| Perintah | Isi |
| --- | --- |
| `/start` | Menu utama: pesan sambutan HTML + inline keyboard + reply keyboard |
| `/card` | Kartu produk: foto + caption HTML + tombol `➖ / ➕` yang mengedit caption secara live |
| `/album` | Album 3 foto (media group) dengan caption |
| `/format` | Contoh bold, italic, underline, strikethrough, spoiler, link, code, blockquote (biasa & expandable), code block |
| `/poll` | Polling native multi-jawaban |

Semua teks di-escape lewat helper di `src/format.js`, jadi nama produk atau input pengguna tidak merusak parsing HTML.

## Menjalankan

```bash
npm install
cp .env.example .env   # isi BOT_TOKEN dari @BotFather
npm start              # long polling
```

Untuk mode webhook, isi `WEBHOOK_DOMAIN` (dan opsional `WEBHOOK_PATH`, `PORT`) di `.env`.

## Struktur

```
src/
  index.js     # registrasi command, action, dan launch bot
  handlers.js  # aksi yang mengirim/mengedit pesan
  messages.js  # penyusunan isi pesan
  format.js    # helper format HTML + escaping
  keyboards.js # inline & reply keyboard
  catalog.js   # data contoh produk
```

## Menambah menu baru

1. Tambahkan penyusun teks di `src/messages.js`.
2. Tambahkan handler di `src/handlers.js`.
3. Daftarkan `bot.command(...)` / `bot.action(...)` di `src/index.js` dan tombolnya di `src/keyboards.js`.
