export const products = {
  'kopi-arabika': {
    id: 'kopi-arabika',
    name: 'Kopi Arabika Gayo',
    price: 95000,
    rating: 4.8,
    stock: 24,
    photo: 'https://picsum.photos/seed/kopi-arabika/900/600',
    description: 'Single origin dari dataran tinggi Gayo, profil rasa citrus dengan aftertaste cokelat.',
    highlights: ['Roast level: medium', 'Berat: 250 gram', 'Gratis ongkir min. 2 pcs'],
    gallery: [
      { url: 'https://picsum.photos/seed/kopi-1/900/600', caption: 'Biji setelah roasting' },
      { url: 'https://picsum.photos/seed/kopi-2/900/600', caption: 'Proses seduh V60' },
      { url: 'https://picsum.photos/seed/kopi-3/900/600', caption: 'Kemasan 250 gram' }
    ]
  }
};

export const defaultProduct = products['kopi-arabika'];

export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}
