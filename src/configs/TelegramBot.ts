import TelegramBot from 'node-telegram-bot-api';

import { TELEGRAM_TOKEN } from '@/configs/env.ts';

/**
 * create a new instance of TelegramBot
 * please use polling on local only
 * should not use polling on production because bot will call Telegram server many many time
 */
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

export default bot;
