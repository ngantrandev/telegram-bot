const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

// max message length in Telegram
const MAX_TELEGRAM_MESSAGE_LENGTH = 4096;

// Khởi tạo bot Telegram với chế độ polling
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Khởi tạo client Gemini API thông qua thư viện @google/generative-ai
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;
    if (!userMessage) return;

    // Gửi tin nhắn thông báo "Đang suy nghĩ..."
    const thinkingMessage = await bot.sendMessage(chatId, 'Đang suy nghĩ...');

    try {
        // Xây dựng prompt theo yêu cầu
        const promt = `Bạn là một AI thông minh có thể trả lời mọi câu hỏi của người dùng. Tên của bạn là Gemini Custom AI, phiên bản 2.0, do Ngạn hướng dẫn.`;
        const generateContent = `${promt} Hỹ trả lời câu hỏi sau: ${userMessage}`;

        // Gọi Gemini API thông qua thư viện
        const result = await model.generateContent(generateContent);

        // Lấy kết quả text từ phản hồi
        const fullText = result.response.text();

        // convert fulltext into array of strings with 4096 characters each a substring
        // 4096 is the maximum length of a message in Telegram
        const substrings = [];
        for (let i = 0; i < fullText.length; i += MAX_TELEGRAM_MESSAGE_LENGTH) {
            substrings.push(
                fullText.substring(i, i + MAX_TELEGRAM_MESSAGE_LENGTH)
            );
        }

        // Xóa tin nhắn "Đang suy nghĩ..."
        await bot.deleteMessage(chatId, thinkingMessage.message_id);

        // Gửi các phần kết quả về cho người dùng
        for (const part of substrings) {
            await bot.sendMessage(chatId, part);
        }
    } catch (error) {
        await bot.sendMessage(
            chatId,
            'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.'
        );
        await bot.deleteMessage(chatId, thinkingMessage.message_id);
    }
});

console.log('Bot đang chạy...');
