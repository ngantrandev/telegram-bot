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
