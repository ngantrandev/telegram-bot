import bot from '@/src/configs/TelegramBot';
import { handleMessage } from '@/src/controllers/message.controller';
import { SupportedCommands } from '@/src/helpers/utils';
import {
  handleAskCommand,
  handleStartCommand,
} from '@/src/controllers/commands.controller';
import { setBotCommand } from '@/src/services/BotService';

setBotCommand()
  .then((success) => {
    if (success) {
      console.log('Bot commands set successfully');
    } else {
      console.error('Failed to set bot commands');
    }
  })
  .catch((error) => {
    console.error('Failed to set bot commands', error);
  });

bot.onText(SupportedCommands.start.regex, handleStartCommand);

bot.onText(SupportedCommands.ask.regex, handleAskCommand);

bot.on('message', handleMessage);

bot.on('polling_error', (error) => {
  console.error('log polling error: ', error); // => 'EFATAL'
});

bot.on('error', (error) => {
  console.error('log error: ', error); // => 'EFATAL'
});

bot.on('webhook_error', (error) => {
  console.error('log webhook error: ', error); // => 'EFATAL'
});

bot.on('chat_member', (msg) => {
  console.error('log chat_member: ', msg); // => 'EFATAL'
});

bot.on('my_chat_member', (msg) => {
  console.error('log my_chat_member: ', msg); // => 'EFATAL'
});

bot.on('chat_join_request', (msg) => {
  console.error('log chat_join_request: ', msg); // => 'EFATAL'
});

bot.on('shipping_query', (msg) => {
  console.error('log shipping_query: ', msg); // => 'EFATAL'
});

bot.on('pre_checkout_query', (msg) => {
  console.error('log pre_checkout_query: ', msg); // => 'EFATAL'
});

bot.on('poll', (msg) => {
  console.error('log poll: ', msg); // => 'EFATAL'
});

bot.on('poll_answer', (msg) => {
  console.error('log poll_answer: ', msg); // => 'EFATAL'
});

bot.on('channel_post', (msg) => {
  console.error('log channel_post: ', msg); // => 'EFATAL'
});

bot.on('edited_message', (msg) => {
  console.error('log edited_message: ', msg); // => 'EFATAL'
});

bot.on('edited_message_text', (msg) => {
  console.error('log edited_message_text: ', msg); // => 'EFATAL'
});

bot.on('edited_message_caption', (msg) => {
  console.error('log edited_message_caption: ', msg); // => 'EFATAL'
});

bot.on('edited_channel_post', (msg) => {
  console.error('log edited_channel_post: ', msg); // => 'EFATAL'
});

bot.on('edited_channel_post_text', (msg) => {
  console.error('log edited_channel_post_text: ', msg); // => 'EFATAL'
});

bot.on('edited_channel_post_caption', (msg) => {
  console.error('log edited_channel_post_caption: ', msg); // => 'EFATAL'
});

bot.on('callback_query', (msg) => {
  console.error('log callback_query: ', msg); // => 'EFATAL'
});

bot.on('inline_query', (msg) => {
  console.error('log inline_query: ', msg); // => 'EFATAL'
});

bot.on('chosen_inline_result', (msg) => {
  console.error('log chosen_inline_result: ', msg); // => 'EFATAL'
});

bot.on('new_chat_members', (msg) => {
  console.error('log new_chat_members: ', msg); // => 'EFATAL'
});

bot.on('left_chat_member', (msg) => {
  console.error('log left_chat_member: ', msg); // => 'EFATAL'
});

console.log('You know what? I am running!');
