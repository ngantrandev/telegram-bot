import { Chat, Message } from 'node-telegram-bot-api';

import { ChatModel, MessageModel } from '@/src/models/chat.model';

/**
 *
 * @param chat
 * @returns void
 * @description Create a new chat. If the chat already exists, it will not be created.
 *
 */
const createChat = async (chat: Chat) => {
  try {
    const chatExists = await ChatModel.findOne({ id: chat.id });

    if (chatExists) {
      console.log(`Chat id ${chat.id} already exists`);
      return;
    }

    const newChat = new ChatModel(chat);
    await newChat.save();
  } catch (error) {
    console.error(error);
  }
};

const getChatById = async (chatId: number) => {
  try {
    const chat = await ChatModel.findOne({ id: chatId });
    return chat;
  } catch (error) {
    console.error(error);
  }
};

const updateChatById = async (chatId: number, chat: Chat) => {
  try {
    await ChatModel.updateOne({ id: chat.id }, chat);
  } catch (error) {
    console.error(error);
  }
};

const deleteChatById = async (chatId: number) => {
  try {
    await ChatModel.deleteOne({ id: chatId });
  } catch (error) {
    console.error(error);
  }
};

const createMessage = async (msg: Message) => {
  try {
    const newMessage = new MessageModel(msg);
    await newMessage.save();
  } catch (error) {
    console.error(error);
  }
};

const getMessageById = async (messageId: number) => {
  try {
    const message = await MessageModel.findOne({ id: messageId });
    return message;
  } catch (error) {
    console.error(error);
  }
};

export { createChat, getChatById, updateChatById, deleteChatById };
export { createMessage, getMessageById };
