import model from '@/src/configs/GoogleGenerativeAI';

export const askGemini = async (message: string, promt = '') => {
  const generatedContent = `${promt} ${message}`;

  try {
    const res = await model.generateContent(generatedContent);

    return 'Trả lời bởi AI.\n' + res.response.text();
  } catch (error) {
    console.error(error);
    return 'Sorry, I cannot answer that.';
  }
};
