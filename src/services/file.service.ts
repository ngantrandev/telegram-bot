import axios from 'axios';
import { Message } from 'node-telegram-bot-api';

import bot from '@/src/configs/TelegramBot';
import botServices from '@/src/services/BotService';
import { createMessage } from '../repositories/chat.repository';

/**
 *
 * @param url
 * @returns a buffer of the image
 * @throws error if the image is not found
 */
export const dowloadImage = async (url: string): Promise<Buffer> => {
  try {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(res.data, 'binary');

    return buffer;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  } catch (error) {
    return Buffer.from('');
  }
};

export const processImageFromLink = async (msg: Message, url: string) => {
  try {
    const imageBuffer = await dowloadImage(url);

    if (imageBuffer && imageBuffer.length > 0) {
      await bot.deleteMessage(msg.chat.id, msg.message_id);

      const sentMessage = await botServices.sendPhoto(
        msg.chat.id,
        imageBuffer,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Original message',
                  url: msg.text,
                },
                {
                  text: 'Original link',
                  url: msg.text,
                },
                {
                  text: 'Dowload link',
                  url: msg.text,
                },
              ],
            ],
          },
        },
        {
          filename: 'image.jpg',
          contentType: 'image/jpeg',
        }
      );

      if (sentMessage) {
        await createMessage(sentMessage);
      }
    } else {
      const sentMessage = await botServices.sendMessage(
        msg.chat.id,
        'Không thể tải file từ URL.',
        {
          reply_to_message_id: msg.message_id,
        }
      );

      if (sentMessage) {
        await createMessage(sentMessage);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  } catch (error) {
    throw new Error("Can't process image link");
  }
};
