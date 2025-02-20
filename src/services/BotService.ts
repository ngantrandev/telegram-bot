import { Stream } from 'stream';
import TelegramBot from 'node-telegram-bot-api';

import bot from '@/src/configs/TelegramBot';
import { SupportedCommands } from '@/src/helpers/utils';

/**
 *
 * @returns boolean: true if bot commands are set successfully, false otherwise
 * @description Set bot commands
 *
 */
const setBotCommand = async (): Promise<boolean> => {
  try {
    const botCommands: TelegramBot.BotCommand[] = [];

    for (const item of Object.values(SupportedCommands)) {
      const command = item.slug.replace('/', '');
      const description = item.description;

      botCommands.push({ command, description });
    }

    const result = await bot.setMyCommands(botCommands, {});

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const sendMessage = async (
  chatId: TelegramBot.ChatId,
  text: string,
  options?: TelegramBot.SendMessageOptions,
  sendChatAction: boolean = true
) => {
  try {
    if (sendChatAction) {
      await bot.sendChatAction(chatId, 'typing');
    }
    const sentMessage = await bot.sendMessage(chatId, text, options);

    return sentMessage;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const sendPhoto = async (
  chatId: TelegramBot.ChatId,
  photo: string | Stream | Buffer,
  options?: TelegramBot.SendPhotoOptions,
  fileOptions?: TelegramBot.FileOptions,
  sendChatAction: boolean = true
) => {
  try {
    if (sendChatAction) {
      await bot.sendChatAction(chatId, 'upload_photo');
    }

    await bot.sendPhoto(chatId, photo, options, fileOptions);
  } catch (error) {
    console.error(error);
  }
};

const sendChatAction = async (
  chatId: TelegramBot.ChatId,
  action: TelegramBot.ChatAction,
  options?: TelegramBot.SendChatActionOptions
) => {
  try {
    await bot.sendChatAction(chatId, action, options);
  } catch (error) {
    console.error(error);
  }
};

export { setBotCommand, sendMessage, sendPhoto, sendChatAction };
