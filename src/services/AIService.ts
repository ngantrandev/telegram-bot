import model from '@/configs/GoogleGenerativeAI.js';

export const askGemini = async (message: string, promt = '') => {
  if (!message || message == '') {
    return 'Sorry, you need to say something.';
  }
  const generatedContent = `${promt} ${message}`;

  try {
    const res = await model.generateContent(generatedContent);

    return 'Trả lời bởi AI🤖🤖.\n' + res.response.text();
  } catch (error) {
    console.error(error);
    return 'Sorry, I cannot answer that.';
  }
};
