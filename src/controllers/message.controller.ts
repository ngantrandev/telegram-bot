import { askGemini } from '@/src/services/AIService';

const MAX_MESSAGE_LENGTH = 4096; // Telegram message length limit

export const handleMessage = async (message: string) => {
  try {
    const generativeResponse = await askGemini(message);

    const substrings = [];

    for (let i = 0; i < generativeResponse.length; i += MAX_MESSAGE_LENGTH) {
      substrings.push(generativeResponse.substring(i, i + MAX_MESSAGE_LENGTH));
    }

    return substrings;
  } catch (error) {
    console.error(error);
    return [];
  }
};
