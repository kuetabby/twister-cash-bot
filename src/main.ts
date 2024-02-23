import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import bridgeCommand from './bridge';
import analyzeCommand from './analyzer';

import { CallbackInfo, ChatStage, textInfo } from './utils';
import { keyboardMarkup } from './utils/keyboardMarkup';

import type { MixDtoConversation } from './models/Mix';
import type { AnalyzeDtoConversation } from './models/Analyze';
import faucetCommand from './faucet';

const TelegramBot = require('node-telegram-bot-api');

const botToken = '6567740479:AAGpS3H2tzHtp_7Ey-9v0PWpAnEaNLoVlgk';
// const botToken = '6859353789:AAE328JQDD9r4p5E7Oaei3LQXthfSoTTFvw';
export const bot = new TelegramBot(botToken, { polling: true });

// Store the state of each chat
let chatStates = {};

let mixStates = {} as MixDtoConversation;
let mixStage = {};

let analyzeStates = {} as AnalyzeDtoConversation;

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
    const messageText = msg.text;

    if (messageText === '/start') {
      chatStates[chatId] = ChatStage.START;
      // Path to the video file
      const videoPath =
        'https://res.cloudinary.com/dwppcshmi/video/upload/f_auto:video,q_auto/v1/rabbit_images/d4qpniiqweleflvdtigw';

      await bot.sendVideo(chatId, videoPath, {
        parse_mode: 'Markdown',
        caption: textInfo.welcome,
        reply_markup: JSON.stringify({
          inline_keyboard: keyboardMarkup.start,
        }),
      });
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

  bridgeCommand({
    stages: mixStage,
    states: mixStates,
    chatStates,
  });

  analyzeCommand({
    stages: mixStage,
    states: analyzeStates,
  });

  faucetCommand({
    stages: mixStage,
    states: analyzeStates,
  });

  await app.listen(3001);
}
bootstrap();
