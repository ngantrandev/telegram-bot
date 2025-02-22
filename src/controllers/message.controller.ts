import { Message } from 'node-telegram-bot-api';

import { askGemini } from '@/services/AIService.js';
import botServices from '@/services/BotService.js';
import {
  generateChunkedResponse,
  getMimeTypeFromLink,
  isvalidUrl,
  SupportedCommands,
} from '@/helpers/utils.js';
import { userRepositories } from '@/repositories/user.repository.js';
import {
  chatRepositories,
  messageRepositories,
} from '@/repositories/chat.repository.js';
import { processImageFromLink } from '@/services/file.service.js';

export const handleMessage = async (msg: Message) => {
  // only handle message from private chat
  if (msg.chat.type !== 'private') {
    return;
  }

  for (const command of Object.values(SupportedCommands)) {
    if (command.regex.test(msg.text || '')) {
      return;
    }
  }

  try {
    if (msg.text) {
      if (!isvalidUrl(msg.text)) {
        await processTextMessage(msg);
        return;
      }

      const fileType = await getMimeTypeFromLink(msg.text);

      if (!fileType) {
        const sentMessage = await botServices.sendMessage(
          msg.chat.id,
          'Không thể tìm thấy loại tệp tin từ liên kết đã cung cấp.',
          {
            reply_to_message_id: msg.message_id,
          }
        );

        if (sentMessage) {
          await messageRepositories.createMessage(sentMessage);
        }

        return;
      }

      if (fileType.mime.startsWith('image/')) {
        await processImageFromLink(msg, msg.text);
      }
    } else if (msg.audio) {
      await processAudioMessage(msg);
    } else if (msg.document) {
      await processDocumentMessage(msg);
    } else if (msg.photo) {
      await processPhotoMessage(msg);
    } else if (msg.sticker) {
      await processStickerMessage(msg);
    } else if (msg.video) {
      await processVideoMessage(msg);
    } else if (msg.voice) {
      await processVoiceMessage(msg);
    } else if (msg.contact) {
      await processContactMessage(msg);
    } else if (msg.location) {
      await processLocationMessage(msg);
    } else if (msg.new_chat_members) {
      await processNewChatMembers(msg);
    } else if (msg.left_chat_member) {
      await processLeftChatMember(msg);
    } else if (msg.new_chat_title) {
      await processNewChatTitle(msg);
    } else if (msg.new_chat_photo) {
      await processNewChatPhoto(msg);
    } else if (msg.delete_chat_photo) {
      await processDeleteChatPhoto(msg);
    } else if (msg.group_chat_created) {
      await processGroupChatCreated(msg);
    } else if (msg.game) {
      await processGameMessage(msg);
    } else if (msg.pinned_message) {
      await processPinnedMessage(msg);
    } else if (msg.poll) {
      await processPollMessage(msg);
    } else if (msg.dice) {
      await processDiceMessage(msg);
    } else if (msg.migrate_from_chat_id) {
      await processMigrateFromChat(msg);
    } else if (msg.migrate_to_chat_id) {
      await processMigrateToChat(msg);
    } else if (msg.channel_chat_created) {
      await processChannelChatCreated(msg);
    } else if (msg.supergroup_chat_created) {
      await processSupergroupChatCreated(msg);
    } else if (msg.successful_payment) {
      await processSuccessfulPayment(msg);
    } else if (msg.invoice) {
      await processInvoiceMessage(msg);
    } else if (msg.video_note) {
      await processVideoNoteMessage(msg);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  } catch (error) {
    await botServices.sendMessage(
      msg.chat.id,
      'Đã xảy ra lỗi khi xử lý tin nhắn.'
    );
  }
};

const processTextMessage = async (msg: Message) => {
  try {
    const chatId = msg.chat.id;
    const message = msg.text;

    if (msg.from) {
      await userRepositories.createUser(msg.from);
    }
    await chatRepositories.createChat(msg.chat);
    await messageRepositories.createMessage(msg);

    // print message in format
    console.log(
      `[Chat id: ${chatId}] - [User: ${msg.from?.first_name} ${msg.from?.last_name}] - [Text: ${message}]`
    );

    if (!message) {
      return;
    }

    await botServices.sendChatAction(chatId, 'typing');

    const generativeResponse = await askGemini(message);

    const resultArray = await generateChunkedResponse(generativeResponse);

    if (resultArray.length === 0) {
      return;
    }

    for (const result of resultArray) {
      const sentMessage = await botServices.sendMessage(chatId, result, {
        reply_to_message_id: msg.message_id,
      });

      if (sentMessage) {
        await messageRepositories.createMessage(sentMessage);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const processAudioMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý tin nhắn âm thanh.'
  );
};

const processDocumentMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý tài liệu.'
  );
};

const processPhotoMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý hình ảnh.'
  );
};

const processStickerMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý sticker.'
  );
};

const processVideoMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý video.'
  );
};

const processVoiceMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý tin nhắn thoại.'
  );
};

const processContactMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý danh bạ.'
  );
};

const processLocationMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý vị trí.'
  );
};

const processNewChatMembers = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý thành viên mới trong nhóm.'
  );
};

const processLeftChatMember = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý thành viên rời nhóm.'
  );
};

const processNewChatTitle = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý tiêu đề nhóm mới.'
  );
};

const processNewChatPhoto = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý ảnh nhóm mới.'
  );
};

const processDeleteChatPhoto = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý xóa ảnh nhóm.'
  );
};

const processGroupChatCreated = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý nhóm mới được tạo.'
  );
};

const processGameMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý trò chơi.'
  );
};

const processPinnedMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý tin nhắn ghim.'
  );
};

const processPollMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý cuộc thăm dò.'
  );
};

const processDiceMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý xúc xắc.'
  );
};

const processMigrateFromChat = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý việc di chuyển từ nhóm cũ.'
  );
};

const processMigrateToChat = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý việc di chuyển đến nhóm mới.'
  );
};

const processChannelChatCreated = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý kênh mới được tạo.'
  );
};

const processSupergroupChatCreated = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý supergroup mới được tạo.'
  );
};

const processSuccessfulPayment = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý thanh toán thành công.'
  );
};

const processInvoiceMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý hóa đơn.'
  );
};

const processVideoNoteMessage = async (msg: Message) => {
  await botServices.sendMessage(
    msg.chat.id,
    'Hiện tại tôi không hỗ trợ xử lý ghi chú video.'
  );
};
