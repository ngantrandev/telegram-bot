import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY as string;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN as string;

// check important env variables
if (!GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not provided');
}

if (!TELEGRAM_TOKEN) {
  throw new Error('TELEGRAM_TOKEN is not provided');
}

export { GOOGLE_API_KEY, TELEGRAM_TOKEN };
