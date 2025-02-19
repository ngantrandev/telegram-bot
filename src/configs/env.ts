import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY as string;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN as string;
const APP_PORT = process.env.APP_PORT as string;
const WEBHOOK_PATH = process.env.WEBHOOK_PATH as string;
const WEBHOOK_URL = process.env.WEBHOOK_URL as string;

// check important env variables
if (!GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not provided');
}

if (!TELEGRAM_TOKEN) {
  throw new Error('TELEGRAM_TOKEN is not provided');
}

if (!APP_PORT) {
  throw new Error('APP_PORT is not provided');
}

if (!WEBHOOK_PATH) {
  throw new Error('WEBHOOK_PATH is not provided');
}

if (!WEBHOOK_URL) {
  throw new Error('WEBHOOK_URL is not provided');
}

export { GOOGLE_API_KEY, TELEGRAM_TOKEN, APP_PORT, WEBHOOK_PATH, WEBHOOK_URL };
