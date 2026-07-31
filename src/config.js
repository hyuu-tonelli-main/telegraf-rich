import 'dotenv/config';

const { BOT_TOKEN, WEBHOOK_DOMAIN, WEBHOOK_PATH, PORT } = process.env;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN belum diisi. Salin .env.example ke .env lalu isi token dari @BotFather.');
}

export const config = {
  botToken: BOT_TOKEN,
  webhook: WEBHOOK_DOMAIN
    ? {
        domain: WEBHOOK_DOMAIN,
        path: WEBHOOK_PATH || '/telegraf',
        port: Number(PORT) || 3000
      }
    : null
};
