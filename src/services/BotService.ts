import { Stream } from 'stream';
import TelegramBot from 'node-telegram-bot-api';

import bot from '@/configs/TelegramBot.js';
import { SupportedCommands } from '@/helpers/utils.js';

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

    return await bot.sendPhoto(chatId, photo, options, fileOptions);
  } catch (error) {
    console.error(error);
  }
};

const sendVideo = async (
  chatId: TelegramBot.ChatId,
  video: string | Stream | Buffer,
  options?: TelegramBot.SendVideoOptions,
  fileOptions?: TelegramBot.FileOptions,
  sendChatAction: boolean = true
) => {
  try {
    if (sendChatAction) {
      await bot.sendChatAction(chatId, 'upload_video');
    }

    return await bot.sendVideo(chatId, video, options, fileOptions);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
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

const botServices = {
  setBotCommand,
  sendMessage,
  sendPhoto,
  sendChatAction,
  sendVideo,
};

export default botServices;
