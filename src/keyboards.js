import { Markup } from 'telegraf';

export const mainMenuKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📄 Kartu produk', 'demo:card'),
    Markup.button.callback('🖼 Album foto', 'demo:album')
  ],
  [
    Markup.button.callback('🧾 Format teks', 'demo:format'),
    Markup.button.callback('🗳 Polling', 'demo:poll')
  ],
  [Markup.button.url('📚 Docs Telegraf', 'https://telegraf.js.org')]
]);

export const replyMenuKeyboard = Markup.keyboard([
  ['📄 Kartu produk', '🖼 Album foto'],
  ['🧾 Format teks', '🗳 Polling']
])
  .resize()
  .persistent();

export function productKeyboard(productId, quantity) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('➖', `qty:${productId}:${Math.max(1, quantity - 1)}`),
      Markup.button.callback(`${quantity} pcs`, 'noop'),
      Markup.button.callback('➕', `qty:${productId}:${quantity + 1}`)
    ],
    [Markup.button.callback('🛒 Tambah ke keranjang', `cart:${productId}:${quantity}`)],
    [Markup.button.callback('⬅️ Kembali ke menu', 'menu:main')]
  ]);
}

export const backToMenuKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('⬅️ Kembali ke menu', 'menu:main')]
]);
