import axios from 'axios';
import { Message } from 'node-telegram-bot-api';

import bot from '@/configs/TelegramBot.js';
import botServices from '@/services/BotService.js';
import { messageRepositories } from '@/repositories/chat.repository.js';
import { getMimeTypeFromLink } from '@/helpers/utils.js';

/**
 *
 * @param url
 * @returns store buffer of dowloaded image
 * @throws error if the image is not found
 */
const dowloadImage = async (url: string): Promise<Buffer> => {
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

const dowloadVideo = async (url: string): Promise<Buffer> => {
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

const processImageFromUrl = async (msg: Message, url: string) => {
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
        await messageRepositories.createMessage(sentMessage);
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
        await messageRepositories.createMessage(sentMessage);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  } catch (error) {
    throw new Error("Can't process image link");
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
const processVideoFromUrl = async (msg: Message, url: string) => {
  try {
    const videoBuffer = await dowloadVideo(url);

    if (!videoBuffer || videoBuffer.length === 0) {
      const sentMessage = await botServices.sendMessage(
        msg.chat.id,
        'Không thể tải file từ URL.',
        {
          reply_to_message_id: msg.message_id,
        }
      );

      if (sentMessage) {
        await messageRepositories.createMessage(sentMessage);
      }
    }

    await bot.deleteMessage(msg.chat.id, msg.message_id);

    const sentMessage = await botServices.sendVideo(
      msg.chat.id,
      videoBuffer,
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
        filename: 'video.mp4',
        contentType: 'video/mp4',
      }
    );

    if (sentMessage) {
      await messageRepositories.createMessage(sentMessage);
    }
  } catch (error) {
    console.error(error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
const processAudioFromUrl = async (msg: Message, url: string) => {
  try {
    await bot.sendMessage(msg.chat.id, 'Chưa hỗ trợ xử lý audio từ liên kết.', {
      reply_to_message_id: msg.message_id,
    });
  } catch (error) {
    console.error(error);
  }
};

export const processUrl = async (msg: Message, url: string) => {
  try {
    const fileType = await getMimeTypeFromLink(url);

    if (!fileType) {
      const sentMessage = await botServices.sendMessage(
        msg.chat.id,
        'Không thể tìm thấy tệp tin từ liên kết đã cung cấp.', // can not find mime type
        {
          reply_to_message_id: msg.message_id,
        }
      );

      if (sentMessage) {
        await messageRepositories.createMessage(sentMessage);
      }

      return;
    }

    const mimeType = fileType.mime;

    if (mimeType.startsWith('image/')) {
      await processImageFromUrl(msg, url);
    } else if (mimeType.startsWith('video/')) {
      await processVideoFromUrl(msg, url);
    } else {
      await botServices.sendMessage(
        msg.chat.id,
        `Chưa hỗ trợ xử lý tệp tin ${mimeType} từ liên kết đã cung cấp.`, // not support file type
        {
          reply_to_message_id: msg.message_id,
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
};
