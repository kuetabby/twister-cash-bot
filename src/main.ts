import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { startMixing } from './bridge/start';
import { fromMixing, toMixing } from './bridge/from_to';
import { amountMixing, receiverMixing } from './bridge/receiver_amount';
import { estimateMixing } from './bridge/estimate';
import {
  createOrderMixing,
  refreshOrderMixing,
} from './bridge/create_refresh_order';
import {
  amountMessageMixing,
  receiverMessageMixing,
} from './bridge/amount_receiver_message';

import { CallbackInfo, ChatStage, textInfo } from './utils';
import { keyboardMarkup } from './utils/keyboardMarkup';

import type { MixDtoConversation } from './models/Mix';

const TelegramBot = require('node-telegram-bot-api');

const botToken = '6567740479:AAGpS3H2tzHtp_7Ey-9v0PWpAnEaNLoVlgk';
// const botToken = '6859353789:AAE328JQDD9r4p5E7Oaei3LQXthfSoTTFvw';
export const bot = new TelegramBot(botToken, { polling: true });

// Store the state of each chat
let chatStates = {};

let mixStates = {} as MixDtoConversation;
let mixStage = {};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // replace with your allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      // 'Origin,Content-Type,Authorization,Accept,User-Agent,Cache-Control,Pragma,x-api-key',
      'x-api-key',
    credentials: true,
    exposedHeaders: 'Content-Length',
    maxAge: 43200, // 12 hours
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  bot.on('message', async (msg) => {
    const chatId: number = msg.chat.id;
    const messageId = msg.message_id;
    const messageText = msg.text;

    // console.log(msg, 'msg');
    // console.log(messageId, 'messageId');

    if (messageText === '/start') {
      chatStates[chatId] = ChatStage.START;
      // Path to the video file
      const videoPath =
        'https://res.cloudinary.com/dwppcshmi/video/upload/f_auto:video,q_auto/v1/rabbit_images/rratt0pwlwpjmg2hmhnj';

      await bot.sendVideo(chatId, videoPath, {
        parse_mode: 'Markdown',
        caption: textInfo.welcome,
        reply_markup: JSON.stringify({
          inline_keyboard: keyboardMarkup.start,
        }),
      });
    }

    if (mixStage[chatId] && mixStates[chatId]) {
      if (mixStage[chatId] === CallbackInfo.AMOUNT) {
        amountMessageMixing({
          chatId,
          messageId,
          messageText,
          states: mixStates,
        });
      }

      if (mixStage[chatId] === CallbackInfo.RECEIVER) {
        receiverMessageMixing({
          chatId,
          messageId,
          messageText,
          states: mixStates,
        });
      }
    }
  });

  bot.on('callback_query', async (callbackQuery) => {
    const query = callbackQuery;
    const message = query.message;

    const chatId: number = message.chat.id;
    const data = JSON.parse(callbackQuery.data);

    // console.log(data, 'data');
    // console.log(message, 'message');
    // console.log(chatStates, 'chatStates');

    switch (data.command) {
      case CallbackInfo.MIX:
        startMixing({
          chatId,
          messageId: message.message_id,
          data,
          stages: mixStage,
          states: mixStates,
        });
        break;

      case CallbackInfo.ABOUT:
        bot.sendMessage(chatId, textInfo.about, {
          parse_mode: 'Markdown',
        });
        break;

      case CallbackInfo.SOCIALS:
        bot.editMessageReplyMarkup(
          {
            inline_keyboard: keyboardMarkup.socials,
          },
          {
            chat_id: chatId,
            message_id: message.message_id,
          },
        );
        break;

      case CallbackInfo.FROM_TOKEN:
        fromMixing({
          chatId,
          messageId: message.message_id,
          stages: mixStage,
        });
        break;

      case CallbackInfo.TO_TOKEN:
        toMixing({
          chatId,
          messageId: message.message_id,
          stages: mixStage,
        });
        break;

      case CallbackInfo.RECEIVER:
        receiverMixing({
          chatId,
          messageId: message.message_id,
          stages: mixStage,
          states: mixStates,
        });
        break;

      case CallbackInfo.AMOUNT:
        amountMixing({
          chatId,
          messageId: message.message_id,
          stages: mixStage,
          states: mixStates,
        });
        break;

      case CallbackInfo.ESTIMATE_EXCHANGE:
        estimateMixing({
          chatId,
          messageId: message.message_id,
          stages: mixStage,
          states: mixStates,
        });
        break;

      case CallbackInfo.CREATE_ORDER:
        if (mixStage[chatId] && mixStates[chatId]) {
          createOrderMixing({
            chatId,
            messageId: message.message_id,
            stages: mixStage,
            states: mixStates,
            chatStates,
          });
        }
        break;

      case CallbackInfo.REFRESH_ORDER:
        if (data.id) {
          refreshOrderMixing({
            chatId,
            messageId: message.message_id,
            stages: mixStage,
            orderId: data.id ?? '',
          });
        }
        break;

      case CallbackInfo.BACK:
        bot.editMessageReplyMarkup(
          {
            inline_keyboard: keyboardMarkup.start,
          },
          {
            chat_id: chatId,
            message_id: message.message_id,
          },
        );
        break;

      case CallbackInfo.EXIT:
        delete chatStates[chatId];
        delete mixStates[chatId];
        delete mixStage[chatId];
        bot.deleteMessage(chatId, message.message_id);
        break;

      default:
        return;
    }
  });

  await app.listen(3001);
}
bootstrap();
