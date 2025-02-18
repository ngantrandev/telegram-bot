import { Stream } from 'stream';
import TelegramBot from 'node-telegram-bot-api';

import bot from '@/src/configs/TelegramBot';

const setBotCommand = async (
  commands: TelegramBot.BotCommand[],
  options?: {
    language_code?: string;
    scope?: TelegramBot.BotCommandScope;
  }
) => {
  try {
    const result = await bot.setMyCommands(commands, options);

    if (result) {
      console.log('Bot commands set successfully');
    } else {
      console.log('Failed to set bot commands');
    }
  } catch (error) {
    console.error(error);
    console.log('Failed to set bot commands');
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
