import { Message } from 'node-telegram-bot-api';

import { sendChatAction, sendMessage } from '@/src/services/BotService';
import { askGemini } from '@/src/services/AIService';
import {
  generateChunkedResponse,
  SupportedCommands,
} from '@/src/helpers/utils';

export const handleAskCommand = async (msg: Message) => {
  try {
    const chatId = msg.chat.id;
    const message = msg.text;

    // print message in format
    console.log(
      `[Chat id: ${chatId}] - [User: ${msg.from?.first_name} ${msg.from?.last_name}] - [Text: ${message}]`
    );

    if (!message) {
      return;
    }

    // remove first command word
    const generativeInput = message
      .replace(SupportedCommands.ask.slug, '')
      .trim();

    await sendChatAction(chatId, 'typing');

    if (!generativeInput) {
      await sendMessage(chatId, SupportedCommands.ask.example, {
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
      await sendMessage(chatId, result, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'Markdown',
      });
    }
  } catch (error) {
    console.error(error);
    await sendMessage(msg.chat.id, 'Đã xảy ra lỗi khi xử lý tin nhắn của bạn');
  }
};

export const handleStartCommand = async (msg: Message) => {
  const chatId = msg.chat.id;
  // short description about the bot
  const message =
    'Xin chào, mình là bot hỗ trợ tìm kiếm thông tin về các bài viết trên trang web...';
  await sendMessage(chatId, message, {
    reply_to_message_id: msg.message_id,
  });
};
