import dotenv from 'dotenv'
dotenv.config({ path: 'config.env' })
import { Telegraf, RichMessage, Markup } from '@icanseeuanywhere/telekaf'
const { RichMarkdownBuilder : MD } = RichMessage
const { RichHTMLBuilder: HTML } = RichMessage
import fs from "fs";
import path from "path";
import moment from "moment-timezone";
import ora from "ora";
import { performance } from 'perf_hooks';
import FormData from 'form-data';
import pino from "pino";
import chalk from "chalk";
import os from 'os';
import axios from "axios";
import readline from "readline";
import crypto from "crypto";
import { fileURLToPath } from 'url';  
const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);
const res = await fetch(imageUrl);  
const buffer = Buffer.from(await res.arrayBuffer());    
const { fileTypeFromBuffer } = await import("file-type");  
const fileType = await fileTypeFromBuffer(buffer);  
const tmpPath = path.join(os.tmpdir(), `brat-${Date.now()}.${fileType.ext}`);

const bot = new Telegraf(process.env.BOT_TOKEN)
const gameData = new Map();

const getUptime = () => {
  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
};

function getVpsInfo() {
    const systemUptimeSeconds = os.uptime();

    const vpsRuntime = formatDuration(systemUptimeSeconds * 1000); 

    
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = `${formatBytes(usedMemory)} / ${formatBytes(totalMemory)}`;

   
    const cpus = os.cpus();
    const cpuModel = cpus[0].model.trim();
    const cpuCores = cpus.length;

    return {
        vpsRuntime,
        memoryUsage,
        cpuModel,
        cpuCores
    };
}


function formatDuration(ms) {
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / (1000 * 60)) % 60;
  const h = Math.floor(ms / (1000 * 60 * 60)) % 24;
  const d = Math.floor(ms / (1000 * 60 * 60 * 24));

  return `${d} hari ${h} jam ${m} menit ${s} detik`;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days} Day, ${hours} Hour, ${minutes} Minute, ${secs} Secs`;
}
function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

// Fungsi untuk ambil CPU usage dalam persen
function getCpuUsage() {
  return new Promise((resolve) => {
      const startMeasure = cpuAverage();
      setTimeout(() => {
      const endMeasure = cpuAverage();
      const idleDifference = endMeasure.idle - startMeasure.idle;
      const totalDifference = endMeasure.total - startMeasure.total;
      const percentageCPU = 100 - Math.round(100 * idleDifference / totalDifference);
      resolve(percentageCPU);
    }, 100);
  });
}

function cpuAverage() {
    const cpus = os.cpus();
    let totalIdle = 0, totalTick = 0;

    for (let cpu of cpus) {
    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  }
  
  return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}


//handler dl
const downloadHandler = async (ctx) => {  
  try {  
    const url = ctx.message.text.split(" ").slice(1).join(" ").trim();  
  
    // 1. Kalau kosong, kasih tau formatnya  
    if (!url) {  
      return ctx.reply(  
        "📥 Kirim link-nya juga.\n\nContoh:\n/download https://vt.tiktok.com/xxxx"  
      );  
    }  
  
    // 2. Deteksi platform dari URL  
    const isTikTok    = url.includes("tiktok.com");  
    const isYouTube   = url.includes("youtube.com") || url.includes("youtu.be");  
    const isInstagram = url.includes("instagram.com");  
  
    if (!isTikTok && !isYouTube && !isInstagram) {  
      return ctx.reply("⚠️ Cuma support link TikTok, YouTube, sama Instagram ya.");  
    }  
  
    // 3. Kasih tau lagi diproses  
    await ctx.reply("⏳ Sedang memproses...");  
  
    // 4. Panggil API sesuai platform  
    // CATATAN: endpoint di bawah contoh, verifikasi masih hidup / ganti kalau mati  
    if (isTikTok) {  
      const { data } = await axios.get(  
        `https://tikwm.com/api/?url=${encodeURIComponent(url)}`  
      );  
      const media = data?.data;  
      if (!media || !media.play) throw new Error("TikTok: media tidak ketemu");  
  
      // kirim video tanpa watermark  
      await ctx.replyWithVideo({ url: media.play });  
      // kalau mau sekalian audionya, uncomment baris ini:  
      // if (media.music) await ctx.replyWithAudio({ url: media.music });  
  
    } else if (isYouTube) {  
      const { data } = await axios.get(  
        `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${encodeURIComponent(url)}`  
      );  
      const videoUrl = data?.url || data?.result?.url;  
      if (!videoUrl) throw new Error("YouTube: media tidak ketemu");  
  
      await ctx.replyWithVideo({ url: videoUrl });  
  
    } else if (isInstagram) {  
      const { data } = await axios.get(  
        `https://api.ryzendesu.vip/api/downloader/igdl?url=${encodeURIComponent(url)}`  
      );  
      // Instagram bisa banyak media (carousel)  
      const items = data?.data || data?.result || [];  
      if (!items.length) throw new Error("Instagram: media tidak ketemu");  
  
      for (const item of items) {  
        const mediaUrl = item.url || item;  
        if (typeof mediaUrl !== "string") continue;  
        // tebak foto atau video dari ekstensi  
        if (mediaUrl.includes(".mp4")) {  
          await ctx.replyWithVideo({ url: mediaUrl });  
        } else {  
          await ctx.replyWithPhoto({ url: mediaUrl });  
        }  
      }  
    }  
  
  } catch (err) {  
    console.error(err);  
    ctx.reply("⚠️ Gagal download, cek link atau coba lagi.");  
  }  
};  
  
// Handle tourl
const ApiKey = "6d207e02198a847aa98d0a2a901485a5";
const RequestURL = "https://freeimage.host/api/1/upload";
const processImageUpload = async (ctx, fileUrl) => {
  try {
    const response = await axios.get(fileUrl.href, { responseType: 'stream' });
    const tempPath = path.join(__dirname, path.basename(fileUrl.pathname));
    const writer = fs.createWriteStream(tempPath);
    response.data.pipe(writer);

    writer.on('finish', async () => {
      const formData = new FormData();
      formData.append('source', fs.createReadStream(tempPath));
      formData.append('type', 'file');
      formData.append('key', ApiKey);

      const uploadResponse = await axios.post(RequestURL, formData, {
        headers: formData.getHeaders(),
      });

      if (uploadResponse.data && uploadResponse.data.image && uploadResponse.data.image.url) {
        const fileUrl = uploadResponse.data.image.url;
        ctx.reply(`<b><mark>Nih link fotonya bang</mark></b> : \n${fileUrl}`);
      } else {
        ctx.reply('An unexpected error occured during uploading your image. Kindly Wait a Moment. If the issue still persist, Please contact Developer!');
      } fs.unlinkSync(tempPath);
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    ctx.reply('There was an error during uploading your image. Please try again. If the issue still persist, Please contact Developer!');
  }
};

bot.on('photo', async (ctx) => {
  const photo = ctx.message.photo[ctx.message.photo.length - 1];
  const fileId = photo.file_id;
  const fileUrl = await ctx.telegram.getFileLink(fileId);
  await processImageUpload(ctx, fileUrl);
});

bot.on('document', async (ctx) => {
  const file = ctx.message.document;
  const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
  if (supportedFormats.includes(file.mime_type)) {
    const fileUrl = await ctx.telegram.getFileLink(file.file_id);
    await processImageUpload(ctx, fileUrl);
  } else {
    ctx.reply("Apologies, but I can only upload images in PNG and JPG/JPEG formats.");
  }
});

bot.on('video', (ctx) => {
  ctx.reply("Apologies, but I am unable to upload video-type format.");
});


const randomImages = [
"https://files.catbox.moe/dfo13q.jpg",
];

const photo = (src) => `<img src="${src}"/>`
const getRandomImage = () =>
  randomImages[Math.floor(Math.random() * randomImages.length)];


//=======///
function komentarMiskin(nilai) {
  if (nilai >= 100) return "💀 Miskin absolut, utang warisan.";
  if (nilai >= 90) return "🥹 Mau beli gorengan mikir 3x.";
  if (nilai >= 80) return "😩 Isi dompet: angin & harapan.";
  if (nilai >= 70) return "😭 Bayar parkir aja utang.";
  if (nilai >= 60) return "🫥 Pernah beli pulsa receh?";
  if (nilai >= 50) return "😬 Makan indomie aja dibagi dua.";
  if (nilai >= 40) return "😅 Listrik token 5 ribu doang.";
  if (nilai >= 30) return "😔 Sering nanya *gratis ga nih?*";
  if (nilai >= 20) return "🫣 Semoga dapet bansos.";
  if (nilai >= 10) return "🥲 Yang penting hidup.";
  return "😵 Gaji = 0, tagihan = tak terbatas.";
}

function komentarTampan(nilai) {
  if (nilai >= 100) return "💎 Ganteng dewa, mustahil diciptakan ulang.";
  if (nilai >= 94) return "🔥 Ganteng gila! Mirip artis Korea!";
  if (nilai >= 90) return "😎 Bintang iklan skincare!";
  if (nilai >= 83) return "✨ Wajahmu memantulkan sinar kebahagiaan.";
  if (nilai >= 78) return "🧼 Bersih dan rapih, cocok jadi influencer!";
  if (nilai >= 73) return "🆒 Ganteng natural, no filter!";
  if (nilai >= 68) return "😉 Banyak yang naksir nih kayaknya.";
  if (nilai >= 54) return "🙂 Lumayan sih... asal jangan senyum terus.";
  if (nilai >= 50) return "😐 Gantengnya malu-malu.";
  if (nilai >= 45) return "😬 Masih bisa lah asal percaya diri.";
  if (nilai >= 35) return "🤔 Hmm... mungkin bukan harinya.";
  if (nilai >= 30) return "🫥 Sedikit upgrade skincare boleh tuh.";
  if (nilai >= 20) return "🫣 Coba pose dari sudut lain?";
  if (nilai >= 10) return "😭 Yang penting akhlaknya ya...";
  return "😵 Gagal di wajah, semoga menang di hati.";
}

function komentarCantik(nilai) {
  if (nilai >= 100) return "👑 Cantiknya level dewi Olympus!";
  if (nilai >= 94) return "🌟 Glowing parah! Bikin semua iri!";
  if (nilai >= 90) return "💃 Jalan aja kayak jalan di runway!";
  if (nilai >= 83) return "✨ Inner & outer beauty combo!";
  if (nilai >= 78) return "💅 Cantik ala aesthetic tiktok!";
  if (nilai >= 73) return "😊 Manis dan mempesona!";
  if (nilai >= 68) return "😍 Bisa jadi idol nih!";
  if (nilai >= 54) return "😌 Cantik-cantik adem.";
  if (nilai >= 50) return "😐 Masih oke, tapi bisa lebih wow.";
  if (nilai >= 45) return "😬 Coba lighting lebih terang deh.";
  if (nilai >= 35) return "🤔 Unik sih... kayak seni modern.";
  if (nilai >= 30) return "🫥 Banyak yang lebih butuh makeup.";
  if (nilai >= 20) return "🫣 Mungkin inner beauty aja ya.";
  if (nilai >= 10) return "😭 Cinta itu buta kok.";
  return "😵 Semoga kamu lucu pas bayi.";
}

function komentarKaya(nilai) {
  if (nilai >= 100) return "💎 Sultan auto endorse siapa aja.";
  if (nilai >= 90) return "🛥️ Jet pribadi parkir di halaman rumah.";
  if (nilai >= 80) return "🏰 Rumahnya bisa buat konser.";
  if (nilai >= 70) return "💼 Bos besar! Duit ngalir terus.";
  if (nilai >= 60) return "🤑 Kaya banget, no debat.";
  if (nilai >= 50) return "💸 Kaya, tapi masih waras.";
  if (nilai >= 40) return "💳 Lumayan lah, saldo aman.";
  if (nilai >= 30) return "🏦 Kayanya sih... dari tampang.";
  if (nilai >= 20) return "🤔 Cukup buat traktir kopi.";
  if (nilai >= 10) return "🫠 Kaya hati, bukan dompet.";
  return "🙃 Duitnya imajinasi aja kayaknya.";
}

function komentarSabar(nilai) {
  if (nilai >= 100) return "🌟 Wah, kamu luar biasa sabar dan hebat!";
  if (nilai >= 94) return "👍 Tetap sabar, kesuksesan sudah dekat.";
  if (nilai >= 90) return "😊 Sabar itu kunci, terus semangat ya!";
  if (nilai >= 83) return "💪 Kamu kuat, sabar sedikit lagi.";
  if (nilai >= 78) return "🌱 Sabar tumbuh jadi kekuatan.";
  if (nilai >= 73) return "✨ Jangan lelah bersabar, hasilnya manis.";
  if (nilai >= 68) return "🧘‍♂️ Tenang, sabar membawa kedamaian.";
  if (nilai >= 54) return "🌸 Sabar itu indah, teruslah berusaha.";
  if (nilai >= 50) return "🌈 Percaya deh, sabar ada hadiahnya.";
  if (nilai >= 45) return "☀️ Sabar sedikit lagi, kamu pasti bisa.";
  if (nilai >= 35) return "🌻 Jangan putus asa, sabar selalu membantu.";
  if (nilai >= 30) return "🕊️ Sabar itu pelajaran berharga.";
  if (nilai >= 20) return "🌿 Terus sabar ya, jangan menyerah.";
  if (nilai >= 10) return "🤲 Sedikit sabar, banyak berkah.";
  return "🙏 Sabar ya, setiap ujian ada hikmahnya.";
}

function komentarTolol(nilai) {
  if (nilai >= 100) return "🤪 Wah, level tololmu sudah master, salut!";
  if (nilai >= 94) return "😂 Udah pinter, tapi masih suka kocak.";
  if (nilai >= 90) return "😜 Kreatif banget, tolol yang menghibur!";
  if (nilai >= 83) return "😅 Santai aja, semua orang kadang tolol.";
  if (nilai >= 78) return "😆 Lumayan kocak, jangan berubah ya.";
  if (nilai >= 73) return "😉 Tolol tapi charming, kombinasi keren.";
  if (nilai >= 68) return "😎 Asal jangan kebanyakan mikir, santuy.";
  if (nilai >= 54) return "🤭 Jangan sedih, tolol itu manusiawi.";
  if (nilai >= 50) return "🙂 Santuy, semua ada waktunya.";
  if (nilai >= 45) return "😬 Masih wajar kok, jangan dipikirin.";
  if (nilai >= 35) return "🤔 Kadang tolol itu bikin lucu, ya kan?";
  if (nilai >= 30) return "😴 Santai, jangan terlalu serius.";
  if (nilai >= 20) return "😐 Bisa jadi tolol pintar, coba terus.";
  if (nilai >= 10) return "🙃 Hidup terlalu singkat buat terlalu serius.";
  return "😵 Wah, kamu jago banget jadi tolol, jangan berubah!";
}

//========bot hears response========\\


bot.hears(['hai', 'hii', 'hi', 'halo', 'hallo', 'hwalo', 'hwloo', 'hiii'], async (ctx) => {
ctx.reply(`apa bangsat`)
})

bot.hears(['p', 'pp', 'pe', 'pppp', 'ppp'], async (ctx) => {
ctx.reply(`apasi pa pe pa pee paa pee ga sopan kntl salam yg bener`)
})


bot.start(async (ctx) => {
  const DRAFT_ID = 69
  const steps = [
  "⚡ Initializing....",
  'Reading your request...',
  "📡 Connecting Telegram...",
  '❔Searching knowledge base...',
  '❕Composing answer...',
  "📦 Loading Resources...",
  "👑 Preparing Rich Menu...",
  "✨ Done!"
  ];
  for (const step of steps) {
    await ctx.sendRichMessageDraft(
      DRAFT_ID,
      new HTML().thinking(HTML.bold(step)).build()
    )
    await new Promise((r) => setTimeout(r, 847))
    }
  
   const msg = new HTML()
    .slideshow(
    photo('https://freeimage.host/i/COC7P4e'),
    photo('https://freeimage.host/i/COC74C7'),
    photo('https://freeimage.host/i/COC76G9')
    )
    .footer('<i><u>Slide show Photo</u></i>')
    msg.heading(1, "<mark><u>Gallagher Rich Message</u></mark>")
    .divider()
    msg.heading(2, 'Information')
    msg.paragraph(
    HTML.bold("Developer : ") + ('<b>@suganzi</b>')
    )
    msg.paragraph(
     HTML.bold('Version : ') + ('<b>New Version</b>')
     )
    msg.paragraph(
    HTML.bold("Platform : ") + ('<b>Telegram</b>')
    )
    msg.paragraph(
    HTML.bold("Type Script : ") + ('<b>Special Edition</b>') 
    )
    .divider()
    msg.taskList(
    {
      text: 'Bot berhasil menggunakan Rich Message',
      checked: true
    },
    {
      text: 'Inline Keyboard siap digunakan',
      checked: true
    },
    {
      text: 'Deploy ke Node.js',
      checked: true
    },
    {
      text: 'Deploy ke VPS',
      checked: false
    }
   )
   .divider()
   msg.heading(3, 'All Menu')
   msg.details(
   HTML.bold( 'Tools menu (6)'),                 // <- dari (5) jadi (6)  
   '<table bordered striped>' +  
      '<tr><th>Commands</th><th colspan="2">Fungsi</th></tr>' +  
      '<tr><td>/gempa</td><td align="center">Berita gempa BMKG</td></tr>' +  
      '<tr><td>/done</td><td align="center">Membuat struk pembayaran</td></tr>' +  
      '<tr><td>/ping</td><td align="center">Test response bot latency</td></tr>' +  
      '<tr><td>/restart</td><td align="center">Restart bot agar tidak delay</td></tr>' +  
      '<tr><td>/tourl</td><td align="center">Image to Url</td></tr>' +  
      '<tr><td>/dl</td><td align="center">Download TikTok, YouTube, IG</td></tr>' +  // <- baris baru  
    '</table>',
    )
   msg.details(
   HTML.bold( 'Fun menu (11)'),
   '<table bordered striped>' +
      '<tr><th>Commands</th><th colspan="2">Fungsi</th></tr>' +
      '<tr><td>/brat</td><td align="center">Membuat stiker teks anomali</td></tr>' +
      '<tr><td>/pinterest</td><td align="center">Cari foto</td></tr>' +
      '<tr><td>/qc</td><td align="center">Teks jadi stiker quote</td></tr>' +
      '<tr><td>/play</td><td align="center">Mencari lagu</td></tr>' +    
      '<tr><td>/cekmiskin</td><td align="center">Cek Miskin</td></tr>' +    
      '<tr><td>/cekkaya</td><td align="center">Cek Kaya</td></tr>' +
      '<tr><td>/cektolol</td><td align="center">Cek Tolol</td></tr>' +
      '<tr><td>/cektampan</td><td align="center">Cek Tampan</td></tr>' +
      '<tr><td>/cekcantik</td><td align="center">Cek Cantik</td></tr>' +
      '<tr><td>/ceksabar</td><td align="center">Cek Sabar</td></tr>' +
      '<tr><td>/spamngl</td><td align="center">Spam pesan ngl anonim</td></tr>' +
      '</table>',
      )
    .pullQuote(
    HTML.italic('"Powered by Suganzi."'),
    'Gallagher'
    )
    .build();
    await ctx.sendRichMessage(
    msg.build(),
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Profile',
              style: 'primary',
              callback_data: 'profile'
            },
            {
              text: 'Thanks To',
              style: 'primary',
              callback_data: 'tqto'
            }
          ],
          [
            {
              text: 'Developer',
              style: 'primary',
              url: 't.me/suganzi'
            }
          ]
        ]
      }
    }
  )
});




bot.action("profile", async (ctx) => {
  await ctx.deleteMessage();
  const user = ctx.from;
  const msg = new HTML()
  msg.heading(1, 'Information User')
  .divider()
  msg.table(
  [
   ['Informasi', 'Account'],
   ['Nama', `${user.first_name || '-'}  ${user.last_name || ""} `],
   ['Username', `${user.username ? "@" + user.username : "-"}`],
   ['ID', `${user.id}`]
  ],
   {
      bordered: true,
      striped: true,
      hasHeader: true
    }
  )
  .pullQuote(
    HTML.italic('"Powered by Suganzi."'),
    'Gallagher'
  )
  .build()
  await ctx.sendRichMessage(
    msg.build(),
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Back To Menu',
              style: 'danger',
              callback_data: 'back'
           }
          ]
        ]
      }
   });
});


bot.action("tqto", async (ctx) => {
  await ctx.deleteMessage();
  const msg = new HTML()
    msg.heading(1, "Thanks To")
    msg.divider()
    msg.heading(2, '📊 Credit & Support')
    msg.blockQuote(
    `<b>Mbape</b> <mark>=></mark> <b>BestFriend</b>`
     )  
    msg.blockQuote( 
    `<b>Tama</b> <mark>=></mark> <b>BestFriend</b>`
     )
   .divider()
   .pullQuote(
    HTML.italic('"Powered by Suganzi."'),
    'Gallagher'
   )
   .build()
   await ctx.sendRichMessage(
    msg.build(),
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Back To Menu',
              style: 'danger',
              callback_data: 'back'
          }
        ]
      ]
    }
  });
});

bot.action("back", async (ctx) => {
  await ctx.deleteMessage();
  const msg = new HTML()
    .slideshow(
    photo('https://freeimage.host/i/COC7P4e'),
    photo('https://freeimage.host/i/COC74C7'),
    photo('https://freeimage.host/i/COC76G9')
    )
    .footer('<i><u>Slide show Photo</u></i>')
    msg.heading(1, "<mark><u>Gallagher Rich Message</u></mark>")
    .divider()
    msg.heading(2, 'Information')
    msg.paragraph(
    HTML.bold("Developer : ") + ('<b>@suganzi</b>')
    )
    msg.paragraph(
     HTML.bold('Version : ') + ('<b>New Version</b>')
     )
    msg.paragraph(
    HTML.bold("Platform : ") + ('<b>Telegram</b>')
    )
    msg.paragraph(
    HTML.bold("Type Script : ") + ('<b>Special Edition</b>') 
    )
    .divider()
    msg.taskList(
    {
      text: 'Bot berhasil menggunakan Rich Message',
      checked: true
    },
    {
      text: 'Inline Keyboard siap digunakan',
      checked: true
    },
    {
      text: 'Deploy ke Node.js',
      checked: true
    },
    {
      text: 'Deploy ke VPS',
      checked: false
    }
   )
   .divider()
   msg.heading(3, 'All Menu')
   msg.details(
   HTML.bold( 'Tools menu (6)'),                 // <- dari (5) jadi (6)  
   '<table bordered striped>' +  
      '<tr><th>Commands</th><th colspan="2">Fungsi</th></tr>' +  
      '<tr><td>/gempa</td><td align="center">Berita gempa BMKG</td></tr>' +  
      '<tr><td>/done</td><td align="center">Membuat struk pembayaran</td></tr>' +  
      '<tr><td>/ping</td><td align="center">Test response bot latency</td></tr>' +  
      '<tr><td>/restart</td><td align="center">Restart bot agar tidak delay</td></tr>' +  
      '<tr><td>/tourl</td><td align="center">Image to Url</td></tr>' +  
      '<tr><td>/dl</td><td align="center">Download TikTok, YouTube, IG</td></tr>' +  // <- baris baru  
    '</table>',
   )
   msg.details(
   HTML.bold( 'Fun menu (11)'),
   '<table bordered striped>' +
      '<tr><th>Commands</th><th colspan="2">Fungsi</th></tr>' +
      '<tr><td>/brat</td><td align="center">Membuat stiker teks anomali</td></tr>' +
      '<tr><td>/pinterest</td><td align="center">Cari foto</td></tr>' +
      '<tr><td>/qc</td><td align="center">Teks jadi stiker quote</td></tr>' +
      '<tr><td>/play</td><td align="center">Mencari lagu</td></tr>' +    
      '<tr><td>/cekmiskin</td><td align="center">Cek Miskin</td></tr>' +    
      '<tr><td>/cekkaya</td><td align="center">Cek Kaya</td></tr>' +
      '<tr><td>/cektolol</td><td align="center">Cek Tolol</td></tr>' +
      '<tr><td>/cektampan</td><td align="center">Cek Tampan</td></tr>' +
      '<tr><td>/cekcantik</td><td align="center">Cek Cantik</td></tr>' +
      '<tr><td>/ceksabar</td><td align="center">Cek Sabar</td></tr>' +
      '<tr><td>/spamngl</td><td align="center">Spam pesan ngl anonim</td></tr>' +
      '</table>',
      )
    .pullQuote(
    HTML.italic('"Powered by Suganzi."'),
    'Gallagher'
    )
    .build();
    await ctx.sendRichMessage(
    msg.build(),
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Profile',
              style: 'primary',
              callback_data: 'profile'
            },
            {
              text: 'Thanks To',
              style: 'primary',
              callback_data: 'tqto'
            }
          ],
          [
            {
              text: 'Developer',
              style: 'primary',
              url: 't.me/suganzi'
            }
          ]
        ]
      }
    }
  )
});


//=======All Fitur========//
bot.command('fitur', async (ctx) => {
 try {





  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Failed.");
  }

});

bot.command('dl', downloadHandler);

bot.command('tourl', async (ctx) => {
 ctx.reply('Silahkan kirim foto untuk menjadikan link otomatis');
});

bot.command('done', async (ctx) => {
 try {
    const input = ctx.message.text.split(" ").slice(1).join(" ");

  if (!input) {
    return ctx.reply(
`📌 *FORMAT SALAH!*

Gunakan format berikut:
/done <nama barang>,<harga>,<metode bayar>

*Contoh:*
\`/done jasa install panel,15000,Dana\``, {
      parse_mode: "Markdown"
    });
  }

  const [namaBarang, hargaBarang, metodeBayar] = input.split(",").map(part => part?.trim());
  if (!namaBarang || !hargaBarang) {
    return ctx.reply(
`❗ *FORMAT TIDAK LENGKAP!*

Minimal isi *nama barang* dan *harga*.

*Contoh:*
\`/done jasa install panel,15000,Dana\``, {
      parse_mode: "Markdown"
    });
  }
  const hargaFormatted = `Rp${Number(hargaBarang).toLocaleString("id-ID")}`;
  const metodePembayaran = metodeBayar || "Tidak disebutkan";
  const now = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const user = ctx.from;
  const msg = new HTML()
  msg.heading(1, "TRANSAKSI BERHASIL")
  .divider
  msg.table(
  [
     ["", ""],
      [
        `Barang`,
        `${namaBarang}`
      ],
      [
        'Nominal',
        ` ${hargaFormatted}`
      ],
      [
        `Payment`,
        `${metodePembayaran}`
      ],
      [
        `Waktu Transaksi`,
        `${now}`
      ]
    ],
    
    {
      bordered: true,
      striped: true,
      hasHeader: true
    }
    )
    msg.taskList(
    {
      text: '<b>Pembayaran dikonfirmasi</b>',
      checked: true
    }
    )
   .pullQuote(
    HTML.italic('"Terima kasih telah membeli produk kami."'),
    `By ${user.username ? "@" + user.username : "-"}`
    )
  .build()
  await ctx.sendRichMessage(msg.build(),);
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Failed.");
  }

});


bot.command('cekkaya', async (ctx) => {
 try {
   const user = ctx.from;
   const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const msg = new HTML()
   msg.table(
   [
     ['Hasil Cek Kaya'],
     [ 
       '<b>Nama</b>',
       `<b>${user.first_name || '-'}  ${user.last_name || ""}</b>`
     ],
     [
       '<b>Nilai</b>',
       `<b>${nilai}</b>`
     ],
     [
      '<b>Komentar</b>',
      `<b>${komentarKaya(nilai)}</b>`
     ]
   ],
    {
      bordered: true,
      striped: true,
      hasHeader: true
    }
   )
   .build()
   await ctx.sendRichMessage(msg.build(),);
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Failed.");
  }

});

bot.command('cektolol', async (ctx) => {
 try {
   const user = ctx.from;
   const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const msg = new HTML()
   msg.table(
   [
     ['Hasil Cek Tolol'],
     [ 
       '<b>Nama</b>',
       `<b>${user.first_name || '-'}  ${user.last_name || ""}</b>`
     ],
     [
       '<b>Nilai</b>',
       `<b>${nilai}</b>`
     ],
     [
      '<b>Komentar</b>',
      `<b>${komentarTolol(nilai)}</b>`
     ]
   ],
    {
      bordered: true,
      striped: true,
      hasHeader: true
    }
   )
   .build()
   await ctx.sendRichMessage(msg.build(),);
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Failed.");
  }

});

bot.command('cektampan', async (ctx) => {
 try {
   const user = ctx.from;
   const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const msg = new HTML()
   msg.table(
   [
     ['Hasil Cek Tampan'],
     [ 
       '<b>Nama</b>',
       `<b>${user.first_name || '-'}  ${user.last_name || ""}</b>`
     ],
     [
       '<b>Nilai</b>',
       `<b>${nilai}</b>`
     ],
     [
      '<b>Komentar</b>',
      `<b>${komentarTampan(nilai)}</b>`
     ]
   ],
    {
      bordered: true,
      striped: true,
      hasHeader: true
    }
   )
   .build()
   await ctx.sendRichMessage(msg.build(),);
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Failed.");
  }

});

bot.command('cekcantik', async (ctx) => {
 try {
   const user = ctx.from;
   const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const msg = new HTML()
   msg.table(
   [
     ['Hasil Cek Cantik'],
     [ 
       '<b>Nama</b>',
       `<b>${user.first_name || '-'}  ${user.last_name || ""}</b>`
     ],
     [
       '<b>Nilai</b>',
       `<b>${nilai}</b>`
     ],
     [
      '<b>Komentar</b>',
      `<b>${komentarCantik(nilai)}</b>`
     ]
   ],
    {
      bordered: true,
      striped: true,
      hasHeader: true
    }
   )
   .build()
   await ctx.sendRichMessage(msg.build(),);
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Failed.");
  }

});

bot.command('ceksabar', async (ctx) => {
 try {
   const user = ctx.from;
   const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const msg = new HTML()
   msg.table(
   [
     ['Hasil Cek Sabar'],
     [ 
       '<b>Nama</b>',
       `<b>${user.first_name || '-'}  ${user.last_name || ""}</b>`
     ],
     [
       '<b>Nilai</b>',
       `<b>${nilai}</b>`
     ],
     [
      '<b>Komentar</b>',
      `<b>${komentarSabar(nilai)}</b>`
     ]
   ],
    {
      bordered: true,
      striped: true,
      hasHeader: true
    }
   )
   .build()
   await ctx.sendRichMessage(msg.build(),);
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Failed.");
  }

});

bot.command('cekmiskin', async (ctx) => {
 try {
   const user = ctx.from;
   const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const msg = new HTML()
   msg.table(
   [
     ['Hasil Cek Miskinl'],
     [ 
       '<b>Nama</b>',
       `<b>${user.first_name || '-'}  ${user.last_name || ""}</b>`
     ],
     [
       '<b>Nilai</b>',
       `<b>${nilai}</b>`
     ],
     [
      '<b>Komentar</b>',
      `<b>${komentarMiskin(nilai)}</b>`
     ]
   ],
    {
      bordered: true,
      striped: true,
      hasHeader: true
    }
   )
   .build()
   await ctx.sendRichMessage(msg.build(),);
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Failed.");
  }
});


bot.command("spamngl", async (ctx) => {
  try {
 const args = ctx.message.text.split(" ").slice(1);
 if (args.length < 1) {
 return ctx.reply("🪧 ☇ Format: /spamngl rainonesday 10");
 }
 const usernameRaw = args[0];
 const username = usernameRaw;
 const amountRaw = args[1];
 const amount = parseInt(amountRaw, 10);
 const delay = 200;
 if (isNaN(amount) || amount < 1) {
 return ctx.reply("❌ ☇ Masukan jumlah dan harus berupa angka");
 }

 await ctx.reply(`⏳ ☇ Mengirim ${amount} pesan spam ke $@alvaronyabobo22`);

 for (let i = 1; i <= amount; i++) {
 try {
 const deviceId = crypto.randomBytes(21).toString("hex");

 const message = "WOY NGENTOT MUKA LU KAYAK TAIK";
 const body = `username=$@alvaronyabobo22&question=${encodeURIComponent(message)}&deviceId=${deviceId}`;

 await fetch("https://ngl.link/api/submit", {
 method: "POST",
 headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }, body,
 }); } catch (err) { }
 if (i < amount) { if (i % 50 === 0) { try { } catch (e) {} await new Promise((r) => setTimeout(r, delay + 200)) } else await new Promise((r) => setTimeout(r, delay)); } }
 } catch (error) {
 console.error(error); ctx.reply("❌ ☇ Gagal menghubungi api, oba lagi nanti");
 }
});



bot.command('gempa', async (ctx) => {
    try {
    const msg = new HTML()
    const res = await fetch( "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json" );
    const data = await res.json();
    const g = data.Infogempa.gempa;
    msg.heading(1, '📢 Latest Earthquake (BMKG)')
    msg.table(
    [
      ['Informasi Gempa'],
      [
        'Tanggal',
        `${g.Tanggal}`
      ],
      [
        'Jam',
        `${g.Jam}`
      ],
      [
        'Wilayah',
        `${g.Wilayah}`
      ],
      [
        'Magnitudo',
        `${g.Magnitude}`
      ],
      [
        'Potensi',
        `${g.Potensi}`
      ],
      [
        'Kedalaman',
        `${g.Kedalaman}`
      ],
      [
        'Koordinat',
        `${g.Coordinates}`
      ],
      [
        'Dirasakan',
        `${g.Dirasakan || "-"}`
      ]
    ],
    {
      bordered: true,
      striped: true,
      hasHeader: true
    }
    )
  .pullQuote(
    HTML.italic('"Powered by Suganzi."'),
    'Gallagher'
  )
  
   .build()
   await ctx.sendRichMessage(msg.build(),);
 } catch (err) {
 console.error(err);
 ctx.reply('Failed');
 }
});

bot.command("ping", async (ctx) => {
  try {
     const start = performance.now();
    const end = performance.now();
    const speed = (end - start).toFixed(4);
    const uptime = moment.duration(process.uptime(), 'seconds');
    const formattedUptime = `${uptime.hours()}h ${uptime.minutes()}m ${uptime.seconds()}s`;
    const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
    const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
    const usedMem = (totalMem - freeMem).toFixed(2);
    const cpuUsage = await getCpuUsage();
    const msg = new HTML()
    msg.photo('https://freeimage.host/i/CNMJorJ')
    msg.heading(2, '📊 Infomasi Test Bot Latency')
    msg.table(
    [
      ['Informasi Panel'],
      [
        `Speed`,
        `${speed} ms`
      ],
      [
        'Uptime',
        ` ${formattedUptime}`
      ],
      [
        `Ram`,
        `${usedMem} MB / ${totalMem} MB`
      ],
      [
        `CPU Usage`,
        `${cpuUsage}%`
      ]
    ],
    
    {
      bordered: true,
      striped: true,
      hasHeader: true
    }
    )
   .pullQuote(
    HTML.italic('"Powered by Suganzi."'),
    'Gallagher'
  )
   .build()
   await ctx.sendRichMessage(msg.build(),);
   } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Failed.");
  }
});

bot.command("restart", async (ctx) => {
  try {
    await ctx.reply("🔄 Bot akan restart dalam beberapa detik...");
    setTimeout(() => {
      process.exit(0); 
    }, 3000);
  } catch {
    ctx.reply("❌ Terjadi kesalahan saat mencoba restart bot.");
  }
});

bot.command("brat", async (ctx) => {  
  const text = ctx.message.text?.split(" ").slice(1).join(" ");  
  if (!text) {  
    return ctx.reply("⚠️ Contoh penggunaan:\n/brat Hello World!");  
  }  
  
  try {  
    const imageUrl = `https://api-simplebot.vercel.app/imagecreator/brat?apikey=free&text=${encodeURIComponent(text)}`;  
    const res = await fetch(imageUrl);  
  
    // cek dulu API-nya balikin gambar apa bukan  
    const ctype = res.headers.get("content-type") || "";  
    if (!ctype.startsWith("image")) {  
      console.error("API bukan balikin gambar:", ctype);  
      return ctx.reply("❌ API brat lagi bermasalah / gak balikin gambar.");  
    }  
  
    const buffer = Buffer.from(await res.arrayBuffer());   // <- fix #1  
  
    const { fileTypeFromBuffer } = await import("file-type"); // <- butuh npm i file-type  
    const fileType = await fileTypeFromBuffer(buffer);  
    if (!fileType) throw new Error("Gagal deteksi tipe file");  
  
    const tmpPath = path.join(os.tmpdir(), `brat-${Date.now()}.${fileType.ext}`); // <- fix #3  
  
    fs.writeFileSync(tmpPath, buffer);  
  
    // tes pakai foto dulu biar keliatan teksnya; kalau udah oke ganti ke sticker  
    await ctx.replyWithPhoto({ source: tmpPath });  
    // await ctx.replyWithSticker({ source: tmpPath });  
  
    fs.unlinkSync(tmpPath);  
  } catch (err) {  
    console.error("❌ Gagal kirim stiker brat:", err);  
    ctx.reply("❌ Error pas buat stikernya bre.");  
  }  
});
bot.command("pinterest", async ctx => {
  const query = ctx.message.text.split(' ').slice(1).join(' ');

  if (!query) {
    return ctx.reply('⚠️ Harap masukkan kata kunci pencarian!\n\nContoh: /pinterest ambatukam`', {
      parse_mode: 'Markdown'
    });
  }

  const waitMsg = await ctx.reply(`🔍 Mencari gambar Pinterest untuk: *${query}*...`, {
    parse_mode: 'Markdown'
  });

  try {
    const apiEndpoint = `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`;
    const response = await axios.get(apiEndpoint);

    if (!response.data || !response.data.status || !response.data.data.length) {
      await ctx.telegram.deleteMessage(ctx.chat.id, waitMsg.message_id);
      return ctx.reply('❌ Gambar tidak ditemukan untuk kata kunci tersebut.');
    }

    const results = response.data.data;

    // Mengambil hasil PERTAMA (index 0) secara berurutan, bukan acak
    const firstImage = results[0];
    const imageUrl = firstImage.images || firstImage.url || firstImage;

    await ctx.telegram.deleteMessage(ctx.chat.id, waitMsg.message_id);

    await ctx.replyWithPhoto(imageUrl, {
      caption: `🖼 *Hasil Utama Pinterest*\n📌 Kata Kunci: _${query}_`,
      parse_mode: 'Markdown'
    });

  } catch (error) {
    console.error('Error searching Pinterest:', error.message);
    try {
      await ctx.telegram.deleteMessage(ctx.chat.id, waitMsg.message_id);
    } catch (e) {}

    ctx.reply('❌ Terjadi kesalahan saat mengambil gambar.');
  }

});

bot.command('qc', async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    
    if (!text) return ctx.reply('tolong masukan argumen, contoh /qc query');
    
    
    const obj = {
        type: 'quote',
        format: 'png',
        backgroundColor: '#232023',
        width: 512,
        height: 768,
        scale: 2,
        messages: [{
            entities: [],
            avatar: true,
            from: {
                id: 1,
                name: ctx.from.first_name,
                photo: {
                    url: await ctx.telegram.getUserProfilePhotos(ctx.from.id, { limit: 1 }).then((photos) => {
                        return photos.photos.length > 0 
                            ? photos.photos[0][0].file_id
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
                    }),
                }
            },
            text: text,
            replyMessage: {},
        }],
    };

    try {
        const response = await axios.post('https://bot.lyo.su/quote/generate', obj, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const buffer = Buffer.from(response.data.result.image, 'base64');
        const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`;

        // Kirim sticker
        await ctx.telegram.sendSticker(ctx.chat.id, dataUrl);
    } catch (error) {
        console.error('Error generating sticker:', error);
        ctx.reply('Terjadi kesalahan saat membuat sticker.');
    }
});
  bot.command('play', async (ctx) => {
    try {
      const query = ctx.message.text.split(' ').slice(1).join(' ');
      if (!query) {
        return ctx.reply('Kirim judul lagu setelah perintah.\n\nContoh: `/play akhir tak bahagia`', {
          parse_mode: 'Markdown'
        });
      }

      await ctx.reply('🔎 Sedang mencari lagu...');

      const url = `https://api.fasturl.link/downup/ytdown-v1?name=${encodeURIComponent(query)}&format=mp3&quality=320&server=auto`;

      const response = await axios.get(url, {
        headers: {
          'accept': 'application/json'
        }
      });

      const res = response.data;

      if (res.status !== 200 || !res.result || !res.result.media) {
        return ctx.reply('❌ Gagal mendapatkan lagu. Coba lagi dengan judul yang berbeda.');
      }

      const {
        title,
        media,
        url: ytUrl,
        metadata,
        author
      } = res.result;

      const thumbUrl = metadata.thumbnail;
      const tempThumbPath = path.join(__dirname, `thumb-${Date.now()}.jpg`);

      // Download thumbnail
      const thumbRes = await fetch(thumbUrl);
      const thumbBuffer = await thumbRes.arrayBuffer();
      fs.writeFileSync(tempThumbPath, Buffer.from(thumbBuffer));

      // Kirim info lagu
      await ctx.replyWithPhoto(
        { url: thumbUrl },
        {
          caption: `🎶 *${title}*\n👤 *${author.name}*\n🕒 *${metadata.duration}*\n📺 [Tonton di YouTube](${ytUrl})\n\nSedang mengirim audionya...`,
          parse_mode: 'Markdown'
        }
      );

      // Kirim audio dengan thumbnail
      await ctx.replyWithAudio(
        { url: media, filename: `${title}.mp3` },
        {
          title,
          performer: author.name,
          thumb: { source: tempThumbPath }
        }
      );

      // Hapus file sementara
      fs.unlinkSync(tempThumbPath);

    } catch (err) {
      console.error('Error /play:', err);
      ctx.reply('🚫 Terjadi kesalahan saat mengambil lagu.');
    }
  });








//===============//

bot.command("rich", async (ctx) => {
  try {
  const msg = new HTML()
     msg.heading(1, "Gallagher Test Rich Message codes")
 .divider()
.paragraph( 
HTML.bold('bold text')                 
)         
.paragraph(
HTML.italic('italic text')                     
)
.paragraph(
HTML.underline('underlined')              
)
.paragraph(
HTML.strikethrough('crossed out')      
)      
.paragraph(
HTML.spoiler('hidden until tapped')    
)    
.paragraph(
HTML.code('inline code')           
)
.paragraph(
HTML.marked('highlighted')        
)         
.paragraph(
HTML.sub('subscript')                   
)        
.paragraph(
HTML.sup('superscript')                  
) 
.paragraph(
HTML.url('https://t.me', 'Telegram')     
)
.paragraph(
HTML.email('hi@bot.com', 'Email us')        
)
.paragraph(
HTML.phone('+6281234567', 'Call us')      
)
.paragraph(
HTML.mention(123456789, 'Alice')        
)  
.paragraph(
HTML.customEmoji('5368324170671202286', '👍') 
)
.paragraph(
HTML.time(1647531900, 'wDT', '22:45 tomorrow')
)
.paragraph(
HTML.inlineMath('E = mc^2')            
)    
.paragraph(
HTML.bold(HTML.italic('bold italic'))
)
.paragraph(
HTML.underline(HTML.spoiler('underlined spoiler'))
)
.paragraph(
HTML.inlineMath('a^2')            
)
msg.raw(
    '<table bordered striped>' +
      '<tr><th>Name</th><th colspan="2">Details</th></tr>' +
      '<tr><td>Alice</td><td align="center">98</td><td align="right">Pass</td></tr>' +
    '</table>'
  )
   // Standard block quotation
  .blockQuote(HTML.italic('"To be or not to be."'))

  // Pull quotation with attribution (cite)
  .pullQuote(
    HTML.italic('"Design is not just what it looks like."'),
    'Steve Jobs'
  )

  // Nested formatting inside quote
  msg.blockQuote(
    HTML.bold('Telekaf') + ' supports ' + HTML.marked('highlighted') +
    ' and ' + HTML.spoiler('spoiler') + ' text inside quotes.'
  )
 msg.details(
 HTML.bold( 'Tools menu (1)'),
 '<table bordered striped>' +
      '<tr><th>Commands</th><th colspan="2">Fungsi</th></tr>' +
      '<tr><td>/brat</td><td align="center">Membuat stiker teks anomali</td></tr>' +
      '<tr><td>/ping</td><td align="center">Test response bot latency</td></tr>' +
    '</table>',
 
 )

  // Open by default
  msg.details(
    HTML.bold('Fun Menu'),
    '<ul><li>/brat</li><li>/pinterest</li><li>/ping</li></ul>',
    /* open */ true
  )

   .build
   await ctx.sendRichMessage(msg.build(),);
   } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Failed.");
  }
});






//================\\
bot.action('profile', (ctx) =>
  ctx.answerCbQuery(' Profile clicked')
)

bot.action('back', (ctx) =>
  ctx.answerCbQuery('Have been to the main menu Please wait ')
)


bot.action('fun', (ctx) =>
  ctx.answerCbQuery('Fun menu clicked')
)

bot.action('tools', (ctx) =>
  ctx.answerCbQuery('Tools clicked')
)

//======Console launch=====\\
bot.launch()
bot.on("message", async (ctx) => {
  const msg = ctx.message;
  const vpsInfo = getVpsInfo();
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
   let body = msg.text ||
    msg.caption ||
    msg.document?.file_name ||
    msg.video?.file_name ||
    msg.audio?.file_name ||
    (msg.voice && '[Voice Message]') ||
    (msg.sticker && '[Sticker]') ||
    (msg.animation && '[GIF]') ||
    (msg.photo && '[Photo]') ||
    (msg.contact && '[Contact]') ||
    (msg.location && '[Location]') ||
    (msg.venue && '[Venue]') ||
    (msg.poll && '[Poll]') ||
    "";
  const prefix = global.prefix || "/"; 
  const user = ctx.from;
  const nama = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  const username = user.username ? `@${user.username}` : '(tanpa username)';
  const waktu = new Date().toLocaleTimeString();
  console.log(chalk.cyan.bold("=================================="));
  console.log(`⏰ ${waktu}`);
  console.log(chalk.blueBright(`🆔 Id : ${user.id}`));
  console.log(chalk.bold.green(`📩 Dari     : ${username} (${nama})`));
  console.log(chalk.cyan(`📝 Pesan    : ${msg.text}`));
  console.log(chalk.red.bold("=================================="));

});

console.clear();
const checkInterval = 2 * 60 * 5000; // Cek setiap 5 menit
  setInterval(() => {
      console.log(`\n[AUTO-CHECK] Memulai pengecekan CPU server...`);
      console.log(`Hasil CPU server ${vpsInfo.cpuCores}`)
  }, checkInterval);
console.log(chalk.bold.blue(`
-- ░█▀▀░█░█░█▀▀░█▀█░█▀█░▀▀█░▀█▀ --
-- ░▀▀█░█░█░█░█░█▀█░█░█░▄▀░░░█░ --
-- ░▀▀▀░▀▀▀░▀▀▀░▀░▀░▀░▀░▀▀▀░▀▀▀ --
`));
    console.log(chalk.magentaBright("Wecome To Bot Rich Message Special "));
    console.log(chalk.cyan("Developer: @suganzi"));
    console.log(chalk.blue("Version: New Version"));
    console.log(chalk.bold.red("Status: ") + chalk.bold.green("Online\n\n"));
    console.log(chalk.white.bold('🚀 Bot berjalan...'));
    

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))