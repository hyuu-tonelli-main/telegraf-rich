import { formatRupiah } from './catalog.js';
import { blockquote, bold, bulletList, code, escapeHtml, italic, link, pre, section, spoiler } from './format.js';

export function welcomeMessage(firstName) {
  return [
    `👋 Halo ${bold(firstName)}, selamat datang di ${bold('Rich Message Bot')}.`,
    '',
    section('Yang bisa dicoba:', [
      bulletList([
        'Kartu produk dengan foto, caption HTML, dan tombol interaktif',
        'Album foto (media group) dengan caption',
        'Contoh seluruh gaya format teks Telegram',
        'Polling native dengan beberapa pilihan'
      ])
    ]),
    '',
    italic('Pilih salah satu tombol di bawah, atau kirim /help untuk daftar perintah.')
  ].join('\n');
}

export function helpMessage() {
  return section('Daftar perintah', [
    `${code('/start')} — menu utama`,
    `${code('/card')} — kartu produk dengan tombol jumlah`,
    `${code('/album')} — kirim album foto`,
    `${code('/format')} — contoh format teks kaya`,
    `${code('/poll')} — kirim polling`,
    `${code('/help')} — tampilkan pesan ini`
  ]);
}

export function productCaption(product, quantity) {
  const total = product.price * quantity;
  return [
    bold(product.name),
    blockquote(product.description),
    '',
    `${bold('Harga')}: ${escapeHtml(formatRupiah(product.price))}`,
    `${bold('Rating')}: ${'⭐️'.repeat(Math.round(product.rating))} ${escapeHtml(product.rating.toFixed(1))}`,
    `${bold('Stok')}: ${escapeHtml(product.stock)} pcs`,
    '',
    section('Detail', [bulletList(product.highlights)]),
    '',
    `${bold('Subtotal')}: ${escapeHtml(formatRupiah(total))} untuk ${escapeHtml(quantity)} pcs`
  ].join('\n');
}

export function cartMessage(product, quantity) {
  return [
    '✅ ' + bold('Ditambahkan ke keranjang'),
    '',
    `${escapeHtml(product.name)} × ${escapeHtml(quantity)}`,
    `${bold('Total')}: ${escapeHtml(formatRupiah(product.price * quantity))}`
  ].join('\n');
}

export function formatShowcaseMessage() {
  return [
    section('Contoh format HTML', [
      `${bold('Tebal')}, ${italic('miring')}, <u>garis bawah</u>, <s>coret</s>`,
      `${code('inline code')} dan ${link('tautan', 'https://core.telegram.org/bots/api#formatting-options')}`,
      `Spoiler: ${spoiler('teks tersembunyi')}`
    ]),
    '',
    blockquote('Blockquote biasa untuk mengutip pesan pengguna.'),
    blockquote(
      'Blockquote panjang yang bisa dilipat sehingga pesan tetap ringkas walaupun isinya banyak.',
      true
    ),
    '',
    pre('const bot = new Telegraf(process.env.BOT_TOKEN);\nbot.launch();', 'javascript')
  ].join('\n');
}

export const pollQuestion = 'Fitur mana yang paling kamu butuhkan?';

export const pollOptions = [
  'Kartu produk + tombol',
  'Album foto',
  'Format teks kaya',
  'Polling & quiz'
];
