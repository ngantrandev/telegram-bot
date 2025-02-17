import bot from '@/src/configs/TelegramBot';
import { handleMessage } from '@/src/controllers/message.controller';
import { sendMessage } from '@/src/services/BotService';

bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const message = msg.text;

    if (!message) {
      return;
    }

    const resultArray = await handleMessage(message);

    if (resultArray.length === 0) {
      return;
    }

    for (const result of resultArray) {
      await sendMessage(chatId, result);
    }
  } catch (error) {
    console.error(error);
    await sendMessage(msg.chat.id, 'Đã xảy ra lỗi khi xử lý tin nhắn của bạn');
  }
});

bot.on('polling_error', (error) => {
  console.log('log polling error: ', error); // => 'EFATAL'
});

console.log('You know what? I am running!');
