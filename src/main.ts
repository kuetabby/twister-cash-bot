import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { AppModule } from './app.module';
import { AppService } from './app.service';

import { CallbackInfo, ChatStage, textInfo } from './utils';
import { keyboardMarkup } from './utils/keyboardMarkup';
import { list_currency } from './utils/tokens';

import { MixDtoConversation, MixerType } from './models/Mix';

const TelegramBot = require('node-telegram-bot-api');

// const botToken = '6567740479:AAGpS3H2tzHtp_7Ey-9v0PWpAnEaNLoVlgk';
const botToken = '6859353789:AAE328JQDD9r4p5E7Oaei3LQXthfSoTTFvw';
const bot = new TelegramBot(botToken, { polling: true });

// Store the state of each chat
let chatStates = {};

let mixStates = {} as MixDtoConversation;
let mixStage = {};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpService = new HttpService();
  const appService = new AppService(httpService);

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
        'https://res.cloudinary.com/dwppcshmi/video/upload/v1704360826/rabbit_images/qynohbtmqawtv8atrysl.mp4';

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
        const tokenFromName = list_currency.find(
          (item) =>
            item.ticker === mixStates[chatId].fromToken &&
            item.network === mixStates[chatId].fromCurrency,
        ).name;
        const tokenToName = list_currency.find(
          (item) =>
            item.ticker === mixStates[chatId].toToken &&
            item.network === mixStates[chatId].toCurrency,
        ).name;

        await bot.deleteMessage(chatId, messageId - 1);

        if (isNaN(msg.text)) {
          // If the user's input is not a number, ask the user for their age again
          await bot.deleteMessage(chatId, messageId);

          await bot.sendMessage(
            chatId,
            'Invalid Amount! Please enter the right amount.',
          );

          await bot.sendMessage(
            chatId,
            `
                Enter the amount of ${tokenFromName} that you have and want to exchange for ${tokenToName}.
                
Example: If you have 0.1 ETH and want to convert it to USDT, just type 0.1
              `,
            {
              parse_mode: 'Markdown',
              // reply_to_message_id: messageId,
              reply_markup: JSON.stringify({
                inline_keyboard: [
                  [
                    {
                      text: `❌ Cancel Bridging`,
                      callback_data: JSON.stringify({
                        command: CallbackInfo.EXIT,
                      }),
                    },
                  ],
                ],
              }),
            },
          );
        } else {
          await bot.deleteMessage(chatId, messageId);

          mixStates[chatId].amount = msg.text;
          await bot.sendMessage(chatId, textInfo.mixing, {
            parse_mode: 'Markdown',
            reply_markup: JSON.stringify({
              inline_keyboard: keyboardMarkup.mixing({
                fromToken:
                  mixStates[chatId] && mixStates[chatId].fromToken
                    ? list_currency.find(
                        (item) =>
                          item.ticker === mixStates[chatId].fromToken &&
                          item.network === mixStates[chatId].fromCurrency,
                      ).name
                    : '',
                toToken:
                  mixStates[chatId] && mixStates[chatId].toToken
                    ? list_currency.find(
                        (item) =>
                          item.ticker === mixStates[chatId].toToken &&
                          item.network === mixStates[chatId].toCurrency,
                      ).name
                    : '',
                amount: mixStates[chatId] ? mixStates[chatId].amount : '',
                receiver: mixStates[chatId] ? mixStates[chatId].receiver : '',
                rateId: '',
              }),
            }),
          });
        }
      }

      if (mixStage[chatId] === CallbackInfo.RECEIVER) {
        const tokenToName = list_currency.find(
          (item) =>
            item.ticker === mixStates[chatId].toToken &&
            item.network === mixStates[chatId].toCurrency,
        ).name;

        await bot.deleteMessage(chatId, messageId - 1);

        const request = await appService.getAddressValidator({
          network: mixStates[chatId].toCurrency,
          address: msg.text,
        });
        const response = await request;

        // console.log(response, 'response');

        if (response?.isSuccess) {
          if (!response?.result && response?.message) {
            await bot.sendMessage(chatId, response?.message, {
              reply_to_message_id: messageId,
            });

            bot.sendMessage(
              chatId,
              `
            Enter your ${tokenToName} wallet address
          `,
              {
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify({
                  inline_keyboard: [
                    [
                      {
                        text: `❌ Cancel Bridging`,
                        callback_data: JSON.stringify({
                          command: CallbackInfo.EXIT,
                        }),
                      },
                    ],
                  ],
                }),
              },
            );
          } else {
            await bot.deleteMessage(chatId, messageId);
            mixStates[chatId].receiver = msg.text;
            bot.sendMessage(chatId, textInfo.mixing, {
              parse_mode: 'Markdown',
              reply_markup: JSON.stringify({
                inline_keyboard: keyboardMarkup.mixing({
                  fromToken:
                    mixStates[chatId] && mixStates[chatId].fromToken
                      ? list_currency.find(
                          (item) =>
                            item.ticker === mixStates[chatId].fromToken &&
                            item.network === mixStates[chatId].fromCurrency,
                        ).name
                      : '',
                  toToken:
                    mixStates[chatId] && mixStates[chatId].toToken
                      ? list_currency.find(
                          (item) =>
                            item.ticker === mixStates[chatId].toToken &&
                            item.network === mixStates[chatId].toCurrency,
                        ).name
                      : '',
                  amount: mixStates[chatId] ? mixStates[chatId].amount : '',
                  receiver: mixStates[chatId] ? mixStates[chatId].receiver : '',
                  rateId: '',
                }),
              }),
            });
          }
        } else {
          await bot.sendMessage(
            chatId,
            `
            <b> 😥 ${response?.message ?? ''} - Operation Cancelled </b>
              `,
            {
              parse_mode: 'HTML',
            },
          );
        }
      }
    }
  });

  bot.on('callback_query', async (callbackQuery) => {
    const query = callbackQuery;
    const message = query.message;

    const chatId: number = message.chat.id;
    const data = JSON.parse(callbackQuery.data);

    // console.log(data, 'data');

    switch (data.command) {
      case CallbackInfo.MIX:
        if (!mixStates[chatId]) {
          mixStates[chatId] = {
            amount: '',
            fromToken: '',
            fromCurrency: '',
            receiver: '',
            toToken: '',
            toCurrency: '',
            rateId: '',
          };
        }

        if (mixStage[chatId] && mixStates[chatId]) {
          if (mixStage[chatId] === CallbackInfo.FROM_TOKEN) {
            mixStates[chatId].fromToken = data?.ticker;
            mixStates[chatId].fromCurrency = data?.network;
          }

          if (mixStage[chatId] === CallbackInfo.TO_TOKEN) {
            mixStates[chatId].toToken = data?.ticker;
            mixStates[chatId].toCurrency = data?.network;
          }
        }

        if (mixStage[chatId] && message.message_id) {
          bot.deleteMessage(chatId, message.message_id);
        }

        bot.sendMessage(chatId, textInfo.mixing, {
          parse_mode: 'Markdown',
          reply_markup: JSON.stringify({
            inline_keyboard: keyboardMarkup.mixing({
              fromToken:
                mixStates[chatId] && mixStates[chatId].fromToken
                  ? list_currency.find(
                      (item) =>
                        item.ticker === mixStates[chatId].fromToken &&
                        item.network === mixStates[chatId].fromCurrency,
                    ).name
                  : '',
              toToken:
                mixStates[chatId] && mixStates[chatId].toToken
                  ? list_currency.find(
                      (item) =>
                        item.ticker === mixStates[chatId].toToken &&
                        item.network === mixStates[chatId].toCurrency,
                    ).name
                  : '',
              amount: mixStates[chatId] ? mixStates[chatId].amount : '',
              receiver: mixStates[chatId] ? mixStates[chatId].receiver : '',
              rateId: '',
            }),
          }),
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
        mixStage[chatId] = CallbackInfo.FROM_TOKEN;
        // mixStates[chatId].receiver = '';
        // mixStates[chatId].amount = '';
        bot.editMessageText(
          `
          🔼 *Choose the currency you want to deposit.*
        `,
          {
            chat_id: chatId,
            message_id: message.message_id,
            parse_mode: 'Markdown',
            reply_markup: JSON.stringify({
              inline_keyboard: keyboardMarkup.tokensFrom,
            }),
          },
        );
        break;

      case CallbackInfo.TO_TOKEN:
        mixStage[chatId] = CallbackInfo.TO_TOKEN;
        // mixStates[chatId].receiver = '';
        // mixStates[chatId].amount = '';
        bot.editMessageText(
          `
            🔽 *Choose the currency you want to receive.*
          `,
          {
            chat_id: chatId,
            message_id: message.message_id,
            parse_mode: 'Markdown',
            reply_markup: JSON.stringify({
              inline_keyboard: keyboardMarkup.tokensTo,
            }),
          },
        );
        break;

      case CallbackInfo.RECEIVER:
        mixStage[chatId] = CallbackInfo.RECEIVER;
        let tokenName = list_currency.find(
          (item) =>
            item.ticker === mixStates[chatId].toToken &&
            item.network === mixStates[chatId].toCurrency,
        ).name;

        bot.editMessageText(
          `
          Enter your ${tokenName} wallet address
          `,
          {
            chat_id: chatId,
            message_id: message.message_id,
            parse_mode: 'Markdown',
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [
                  {
                    text: `❌ Cancel Bridging`,
                    callback_data: JSON.stringify({
                      command: CallbackInfo.EXIT,
                    }),
                  },
                ],
              ],
            }),
          },
        );
        break;

      case CallbackInfo.AMOUNT:
        mixStage[chatId] = CallbackInfo.AMOUNT;
        let tokenFromName = list_currency.find(
          (item) =>
            item.ticker === mixStates[chatId].fromToken &&
            item.network === mixStates[chatId].fromCurrency,
        ).name;

        let tokenToName = list_currency.find(
          (item) =>
            item.ticker === mixStates[chatId].toToken &&
            item.network === mixStates[chatId].toCurrency,
        ).name;

        bot.editMessageText(
          `
            Enter the amount of ${tokenFromName} that you have and want to exchange for ${tokenToName}.

Example: If you have 0.1 ETH and want to convert it to USDT, just type 0.1
          `,
          {
            chat_id: chatId,
            message_id: message.message_id,
            parse_mode: 'Markdown',
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [
                  {
                    text: `❌ Cancel Bridging`,
                    callback_data: JSON.stringify({
                      command: CallbackInfo.EXIT,
                    }),
                  },
                ],
              ],
            }),
          },
        );
        break;

      case CallbackInfo.ESTIMATE_EXCHANGE:
        mixStage[chatId] = CallbackInfo.ESTIMATE_EXCHANGE;

        await bot.editMessageText('🤔 Finding the best rate...', {
          chat_id: chatId,
          message_id: message.message_id,
        });

        const estimateParams = {
          flowType: MixerType.FIXED,
          fromAmount: mixStates[chatId].amount,
          fromCurrency: mixStates[chatId].fromToken,
          fromNetwork: mixStates[chatId].fromCurrency,
          toAmount: '',
          toCurrency: mixStates[chatId].toToken,
          toNetwork: mixStates[chatId].toCurrency,
        };

        const requestEstimate = await appService.getEstimateExchange(
          estimateParams,
        );

        const responseEstimate = await requestEstimate;

        // console.log(response, 'response');

        if (responseEstimate?.isSuccess) {
          mixStates[chatId].rateId = responseEstimate?.rateId;
          await bot.editMessageText(
            `
              <b>INCOGNITOSHIFT PROTOCOL: Powered by AI to Unlock the new Experience of Web3</b>
    
  • Send: <b>${mixStates[chatId].amount} ${
              list_currency.find(
                (item) =>
                  item.ticker === mixStates[chatId].fromToken &&
                  item.network === mixStates[chatId].fromCurrency,
              ).name
            }</b>
  • Receive: <b>${responseEstimate?.toAmount ?? '-'} ${
              list_currency.find(
                (item) =>
                  item.ticker === mixStates[chatId].toToken &&
                  item.network === mixStates[chatId].toCurrency,
              ).name
            }</b>
  • Receiver Wallet: <code>${mixStates[chatId].receiver}</code>
              `,
            {
              chat_id: chatId,
              message_id: message.message_id,
              parse_mode: 'HTML',
              reply_markup: JSON.stringify({
                inline_keyboard: keyboardMarkup.estimateExchange,
              }),
            },
          );
        } else {
          await bot.editMessageText(
            `
            <b> 😥 ${responseEstimate?.message ?? ''} - Operation Cancelled </b>
              `,
            {
              chat_id: chatId,
              message_id: message.message_id,
              parse_mode: 'HTML',
            },
          );
        }
        break;

      case CallbackInfo.CREATE_ORDER:
        mixStage[chatId] = CallbackInfo.CREATE_ORDER;

        bot.editMessageText('🤔 Creating order...', {
          chat_id: chatId,
          message_id: message.message_id,
        });

        const requestOrder = await appService.createOrder({
          flow: MixerType.FIXED,
          fromAmount: mixStates[chatId].amount,
          fromCurrency: mixStates[chatId].fromToken,
          fromNetwork: mixStates[chatId].fromCurrency,
          toAmount: '',
          toCurrency: mixStates[chatId].toToken,
          toNetwork: mixStates[chatId].toCurrency,
          address: mixStates[chatId].receiver,
          type: 'direct',
          rateId: mixStates[chatId].rateId,
        });
        const responseOrder = await requestOrder;

        // console.log(responseOrder, 'res order');

        if (responseOrder) {
          await bot.editMessageText(
            `
                      *Bridging Transaction started :*

• Bridging ID: \`${responseOrder?.id ?? '-'}\`
• Send: ${responseOrder.fromAmount} ${
              list_currency.find(
                (item) =>
                  item.ticker === responseOrder.fromCurrency &&
                  item.network === responseOrder.fromNetwork,
              ).name
            }
• Receive: ${responseOrder?.toAmount ?? '-'} ${
              list_currency.find(
                (item) =>
                  item.ticker === responseOrder.toCurrency &&
                  item.network === responseOrder.toNetwork,
              ).name
            }
• Receiver Wallet: \`${responseOrder?.payoutAddress ?? '-'}\`
  
➡️ Please transfer ${mixStates[chatId].amount} ${
              list_currency.find(
                (item) =>
                  item.ticker === responseOrder.fromCurrency &&
                  item.network === responseOrder.fromNetwork,
              ).name
            } to start bridging process. 

Deposit Wallet: \`${responseOrder?.payinAddress ?? '-'}\`
  
You will get ${responseOrder?.toAmount ?? '-'} ${
              list_currency.find(
                (item) =>
                  item.ticker === responseOrder.toCurrency &&
                  item.network === responseOrder.toNetwork,
              ).name
            } for your ${responseOrder.fromAmount} ${
              list_currency.find(
                (item) =>
                  item.ticker === responseOrder.fromCurrency &&
                  item.network === responseOrder.fromNetwork,
              ).name
            }.
  
Note: You must complete this trade within a maximum of 30 minutes. Fees can vary.

📡 Status: Waiting`,
            {
              chat_id: chatId,
              message_id: message.message_id,
              parse_mode: 'Markdown',
              reply_markup: JSON.stringify({
                inline_keyboard: keyboardMarkup.refreshOrder(responseOrder?.id),
              }),
            },
          );

          delete chatStates[chatId];
          delete mixStates[chatId];
          delete mixStage[chatId];
        }
        break;

      case CallbackInfo.REFRESH_ORDER:
        mixStage[chatId] = CallbackInfo.REFRESH_ORDER;

        const requestStatusOrder = await appService.getStatusOrder(data.id);
        const responseStatusOrder = await requestStatusOrder;
        // console.log(responseStatusOrder, 'status order');

        if (responseStatusOrder?.isSuccess) {
          const statusOrder = {
            fromAmount:
              responseStatusOrder?.expectedAmountFrom ||
              responseStatusOrder?.amountFrom,
            fromCurrency: responseStatusOrder.fromCurrency,
            fromNetwork: responseStatusOrder.fromNetwork,
            toAmount:
              responseStatusOrder?.expectedAmountTo ||
              responseStatusOrder?.amountTo,
            toCurrency: responseStatusOrder.toCurrency,
            toNetwork: responseStatusOrder.toNetwork,
          };

          await bot.deleteMessage(chatId, message.message_id);
          await bot.sendMessage(
            chatId,
            `
                      *Bridging Transaction started :*

• Bridging ID: \`${responseStatusOrder?.id ?? '-'}\`
• Send: ${statusOrder.fromAmount} ${
              list_currency.find(
                (item) =>
                  item.ticker === statusOrder.fromCurrency &&
                  item.network === statusOrder.fromNetwork,
              ).name
            }
• Receive: ${statusOrder.toAmount ?? '-'} ${
              list_currency.find(
                (item) =>
                  item.ticker === statusOrder.toCurrency &&
                  item.network === statusOrder.toNetwork,
              ).name
            }
• Receiver Wallet: \`${responseStatusOrder?.payoutAddress ?? '-'}\`

Deposit Wallet: \`${responseStatusOrder?.payinAddress ?? '-'}\`
  
Note: You must complete this trade within a maximum of 30 minutes. Fees can vary.

📡 Status: ${
              responseStatusOrder?.status?.charAt(0)?.toUpperCase() +
              responseStatusOrder?.status?.slice(1)
            }`,
            {
              // chat_id: chatId,
              message_id: message.message_id,
              parse_mode: 'Markdown',
              reply_markup: JSON.stringify({
                inline_keyboard: keyboardMarkup.refreshOrder(
                  responseStatusOrder?.id,
                ),
              }),
            },
          );
        } else {
          await bot.editMessageText(
            `
            <b> 😥 ${
              responseStatusOrder?.message ?? ''
            } - Operation Cancelled </b>
              `,
            {
              chat_id: chatId,
              message_id: message.message_id,
              parse_mode: 'HTML',
            },
          );
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
