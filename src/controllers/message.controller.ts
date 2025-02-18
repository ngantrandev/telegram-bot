import { Message } from 'node-telegram-bot-api';

import { askGemini } from '@/src/services/AIService';
import { sendChatAction, sendMessage } from '@/src/services/BotService';
import { generateChunkedResponse } from '@/src/helpers/utils';

export const handleMessage = async (msg: Message) => {
  // only handle message from private chat
  if (msg.chat.type !== 'private') {
    return;
  }

  try {
    const chatId = msg.chat.id;
    const message = msg.text;

    if (!message) {
      return;
    }

    await sendChatAction(chatId, 'typing');

    const generativeResponse = await askGemini(message);

    const resultArray = await generateChunkedResponse(generativeResponse);

    if (resultArray.length === 0) {
      return;
    }

    for (const result of resultArray) {
      await sendMessage(chatId, result, {
        reply_to_message_id: msg.message_id,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
