import { defaultProduct, products } from './catalog.js';
import { escapeHtml } from './format.js';
import { backToMenuKeyboard, mainMenuKeyboard, productKeyboard, replyMenuKeyboard } from './keyboards.js';
import {
  cartMessage,
  formatShowcaseMessage,
  helpMessage,
  pollOptions,
  pollQuestion,
  productCaption,
  welcomeMessage
} from './messages.js';

const HTML = { parse_mode: 'HTML' };

export async function sendMainMenu(ctx) {
  await ctx.reply(welcomeMessage(ctx.from?.first_name || 'kawan'), {
    ...HTML,
    link_preview_options: { is_disabled: true },
    ...mainMenuKeyboard
  });
  await ctx.reply('Menu cepat aktif di bawah 👇', replyMenuKeyboard);
}

export async function sendHelp(ctx) {
  await ctx.reply(helpMessage(), { ...HTML, ...backToMenuKeyboard });
}

export async function sendProductCard(ctx, quantity = 1, product = defaultProduct) {
  await ctx.replyWithPhoto(product.photo, {
    caption: productCaption(product, quantity),
    ...HTML,
    ...productKeyboard(product.id, quantity)
  });
}

export async function sendAlbum(ctx, product = defaultProduct) {
  await ctx.replyWithMediaGroup(
    product.gallery.map((item, index) => ({
      type: 'photo',
      media: item.url,
      caption: index === 0
        ? `<b>${escapeHtml(product.name)}</b>\n${escapeHtml(item.caption)}`
        : escapeHtml(item.caption),
      parse_mode: 'HTML'
    }))
  );
  await ctx.reply('Itu tadi galeri produknya.', backToMenuKeyboard);
}

export async function sendFormatShowcase(ctx) {
  await ctx.reply(formatShowcaseMessage(), {
    ...HTML,
    link_preview_options: { is_disabled: true },
    ...backToMenuKeyboard
  });
}

export async function sendPoll(ctx) {
  await ctx.replyWithPoll(pollQuestion, pollOptions, { is_anonymous: false, allows_multiple_answers: true });
}

export async function updateQuantity(ctx, productId, quantity) {
  const product = products[productId] || defaultProduct;
  await ctx.editMessageCaption(productCaption(product, quantity), {
    ...HTML,
    ...productKeyboard(product.id, quantity)
  });
}

export async function addToCart(ctx, productId, quantity) {
  const product = products[productId] || defaultProduct;
  await ctx.reply(cartMessage(product, quantity), { ...HTML, ...backToMenuKeyboard });
}
