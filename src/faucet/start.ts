import { bot } from 'src/main';

// import { CallbackInfo, textInfo } from 'src/utils';
// import { list_currency } from 'src/utils/tokens';
// import { keyboardMarkup } from 'src/utils/keyboardMarkup';

import { AnalyzeStartDto } from 'src/models/Analyze';
import { CallbackInfo } from 'src/utils';

export const startFaucet = async ({
  states,
  chatId,
  messageId,
  stages,
}: // data,
AnalyzeStartDto) => {
  if (!states[chatId]) {
    states[chatId] = {
      walletAddress: '',
    };
  }

  //   if (stages[chatId] && states[chatId]) {
  //     if (stages[chatId] === CallbackInfo.FROM_TOKEN) {
  //       states[chatId].fromToken = data?.ticker;
  //       states[chatId].fromCurrency = data?.network;
  //     }

  //     if (stages[chatId] === CallbackInfo.TO_TOKEN) {
  //       states[chatId].toToken = data?.ticker;
  //       states[chatId].toCurrency = data?.network;
  //     }
  //   }

  if (stages[chatId] && messageId) {
    bot.deleteMessage(chatId, messageId);
  }

  await bot.sendMessage(
    chatId,
    `
*Zeal-AI Testnet*

Network Name: Zeal-AI
Symbol: ZAI
Chain ID: 2302

RPC: www.rpc.zeal-ai.net
Explorer: www.explorer.zeal-ai.net
Faucet: www.faucet.zeal-ai.net

*This feature will be live soon*
`,
    {
      parse_mode: 'Markdown',
      //   reply_to_message_id: messageId,
      //   reply_markup: JSON.stringify({
      //     inline_keyboard: [
      //       [
      //         {
      //           text: `❌ Cancel`,
      //           callback_data: JSON.stringify({
      //             command: CallbackInfo.EXIT,
      //           }),
      //         },
      //       ],
      //     ],
      //   }),
    },
  );
};
