import axios from 'axios';

const MAX_MESSAGE_LENGTH = 4096; // Telegram message length limit

export const SupportedCommands: {
  [key: string]: {
    slug: string;
    regex: RegExp;
    description: string;
    example: string;
  };
} = {
  start: {
    slug: '/start',
    regex: /(?:^|\s)\/start(?:\s|$)/,
    description: 'Start the bot',
    example: 'Bắt đầu sử dụng bot\n***Ví dụ:*** \n```\n/start```',
  },
  ask: {
    slug: '/ask',
    regex: /(?:^|\s)\/ask(?:\s|$)/,
    description: 'Ask the bot',
    example:
      'Hãy đặt câu hỏi cho tôi!\n***Ví dụ:*** \n```\n/ask Tôi có thể câu cá mập ở sông Hồng được không?```',
  },
};

/**
 * this function will generate an array of substrings from the response
 * allow to send multiple messages if the response is too long
 * @param response
 * @returns array of substrings
 */
export const generateChunkedResponse = async (response: string) => {
  try {
    const substrings = [];

    for (let i = 0; i < response.length; i += MAX_MESSAGE_LENGTH) {
      substrings.push(response.substring(i, i + MAX_MESSAGE_LENGTH));
    }

    return substrings;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const isvalidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  } catch (error) {
    return false;
  }
};

/**
 *
 * @param url
 * @returns get file type from download link
 */
export const getMimeTypeFromLink = async (url: string) => {
  try {
    console.log(`Getting file type from link: ${url}`);
    const { fileTypeFromBuffer } = await import('file-type');

    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        Range: 'bytes=0-4095', // just need about first 4kb of the file to detect the type
      },
    });

    console.log(`Response status: ${res.status}`);

    const buffer = Buffer.from(res.data, 'binary');

    console.log(`Buffer length: ${buffer.length}`);

    const fileType = await fileTypeFromBuffer(buffer);

    console.log(`File type: ${fileType?.mime}`);

    return fileType;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  } catch (error) {
    return null;
  }
};
