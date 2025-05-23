import { Message } from 'node-telegram-bot-api';

import botServices from '@/services/BotService.js';
import { askGemini } from '@/services/AIService.js';
import { generateChunkedResponse, SupportedCommands } from '@/helpers/utils.js';
import { userRepositories } from '@/repositories/user.repository.js';
import {
  chatRepositories,
  messageRepositories,
} from '@/repositories/chat.repository.js';

export const handleAskCommand = async (msg: Message) => {
  try {
    const chatId = msg.chat.id;
    const message = msg.text;

    if (msg.from) {
      await userRepositories.createUser(msg.from);
    }
    await chatRepositories.createChat(msg.chat);
    await messageRepositories.createMessage(msg);

    // print message in format
    console.log(
      `[Chat id: ${chatId}] - [User: ${msg.from?.first_name} ${msg.from?.last_name}] - [Text: ${message}]`
    );

    if (!message) {
      return;
    }

    await botServices.sendChatAction(chatId, 'typing');

    // remove first command word
    const generativeInput = message
      .replace(SupportedCommands.ask.slug, '')
      .trim();

    if (!generativeInput) {
      await botServices.sendMessage(chatId, SupportedCommands.ask.example, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'Markdown',
      });

      return;
    }

    const generativeResponse = await askGemini(generativeInput);

    const resultArray = await generateChunkedResponse(generativeResponse);

    if (resultArray.length === 0) {
      return;
    }

    for (const result of resultArray) {
      const sentMessage = await botServices.sendMessage(chatId, result, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'Markdown',
      });

      if (sentMessage) {
        await messageRepositories.createMessage(sentMessage);
      }
    }
  } catch (error) {
    console.error(error);
    await botServices.sendMessage(
      msg.chat.id,
      'Đã xảy ra lỗi khi xử lý tin nhắn của bạn'
    );
  }
};

export const handleStartCommand = async (msg: Message) => {
  const chatId = msg.chat.id;
  // short description about the bot
  const message = `Xin chào, mình là bot hỗ trợ tìm kiếm thông tin về các bài viết trên trang web...
    Bạn có thể hỏi mình bất cứ điều gì liên quan đến các bài viết trên trang web hoặc gửi đường link hình ảnh.
    `;
  await botServices.sendMessage(chatId, message, {
    reply_to_message_id: msg.message_id,
  });
};
