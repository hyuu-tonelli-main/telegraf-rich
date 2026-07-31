import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from './config.js';
import {
  addToCart,
  sendAlbum,
  sendFormatShowcase,
  sendHelp,
  sendMainMenu,
  sendPoll,
  sendProductCard,
  updateQuantity
} from './handlers.js';

const bot = new Telegraf(config.botToken);

const commands = [
  { command: 'start', description: 'Menu utama' },
  { command: 'card', description: 'Kartu produk dengan tombol' },
  { command: 'album', description: 'Kirim album foto' },
  { command: 'format', description: 'Contoh format teks kaya' },
  { command: 'poll', description: 'Kirim polling' },
  { command: 'help', description: 'Bantuan' }
];

bot.start(sendMainMenu);
bot.help(sendHelp);
bot.command('card', (ctx) => sendProductCard(ctx));
bot.command('album', sendAlbum);
bot.command('format', sendFormatShowcase);
bot.command('poll', sendPoll);

bot.hears('📄 Kartu produk', (ctx) => sendProductCard(ctx));
bot.hears('🖼 Album foto', sendAlbum);
bot.hears('🧾 Format teks', sendFormatShowcase);
bot.hears('🗳 Polling', sendPoll);

bot.action('menu:main', async (ctx) => {
  await ctx.answerCbQuery();
  await sendMainMenu(ctx);
});

bot.action('noop', (ctx) => ctx.answerCbQuery());

bot.action('demo:card', async (ctx) => {
  await ctx.answerCbQuery();
  await sendProductCard(ctx);
});

bot.action('demo:album', async (ctx) => {
  await ctx.answerCbQuery();
  await sendAlbum(ctx);
});

bot.action('demo:format', async (ctx) => {
  await ctx.answerCbQuery();
  await sendFormatShowcase(ctx);
});

bot.action('demo:poll', async (ctx) => {
  await ctx.answerCbQuery();
  await sendPoll(ctx);
});

bot.action(/^qty:([\w-]+):(\d+)$/, async (ctx) => {
  const [, productId, quantity] = ctx.match;
  await ctx.answerCbQuery(`Jumlah: ${quantity}`);
  await updateQuantity(ctx, productId, Number(quantity));
});

bot.action(/^cart:([\w-]+):(\d+)$/, async (ctx) => {
  const [, productId, quantity] = ctx.match;
  await ctx.answerCbQuery('Masuk keranjang ✅');
  await addToCart(ctx, productId, Number(quantity));
});

bot.on(message('text'), (ctx) =>
  ctx.reply('Perintah tidak dikenal. Kirim /help untuk melihat daftar perintah.')
);

bot.catch((error, ctx) => {
  console.error(`Error pada update ${ctx.update.update_id}:`, error);
});

async function onLaunch() {
  await bot.telegram.setMyCommands(commands);
  console.log(
    config.webhook
      ? `Bot berjalan via webhook di ${config.webhook.domain}${config.webhook.path}`
      : 'Bot berjalan dengan long polling.'
  );
}

const launchOptions = config.webhook
  ? {
      webhook: {
        domain: config.webhook.domain,
        hookPath: config.webhook.path,
        port: config.webhook.port
      }
    }
  : {};

bot.launch(launchOptions, () => {
  onLaunch().catch((error) => console.error('Gagal mendaftarkan daftar perintah:', error));
}).catch((error) => {
  console.error('Gagal menjalankan bot:', error);
  process.exit(1);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
