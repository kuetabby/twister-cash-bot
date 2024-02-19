import { MixDto } from 'src/models/Mix';
import { CallbackInfo } from '.';
import { list_tokens } from './tokens';

const startKeyboardMarkup = [
  [
    {
      text: '🔀 Start Bridge',
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
      }),
    },
    // {
    //   text: '🔎 Audit Tools',
    //   url: 'https://audit.twistercash.tech',
    // },
  ],
  [
    {
      text: 'ℹ️ Guideline',
      callback_data: JSON.stringify({
        command: CallbackInfo.ABOUT,
      }),
    },
    {
      text: '🔗 Socials',
      callback_data: JSON.stringify({
        command: CallbackInfo.SOCIALS,
      }),
    },
  ],
];

const socialsKeyboardMarkup = [
  [
    {
      text: 'Website',
      url: 'https://twistercash.tech',
    },
    {
      text: 'Telegram',
      url: 'https://t.me/TwisterERC20',
    },
  ],
  [
    {
      text: 'Twitter / X',
      url: 'https://x.com/twistererc20',
    },
    {
      text: 'Medium',
      url: 'https://medium.com/@TwisterCash',
    },
  ],
  [
    {
      text: '🔙 Back',
      callback_data: JSON.stringify({
        command: CallbackInfo.BACK,
      }),
    },
  ],
];

const mixingFormKeyboardMarkup = ({
  amount,
  fromToken,
  toToken,
  receiver,
}: MixDto) => {
  return [
    [
      {
        text: `From Currency: ${fromToken ?? 'None'}`,
        callback_data: JSON.stringify({
          command: CallbackInfo.FROM_TOKEN,
        }),
      },
    ],
    [
      {
        text: `To Currency: ${toToken ?? 'None'}`,
        callback_data: JSON.stringify({
          command: CallbackInfo.TO_TOKEN,
        }),
      },
    ],
    fromToken && toToken
      ? [
          {
            text: `💲 Amount: ${amount ?? 'None'}`,
            callback_data: JSON.stringify({
              command: CallbackInfo.AMOUNT,
            }),
          },
          ...(amount
            ? [
                {
                  text: `🎫 Receiver: ${receiver ?? 'None'}`,
                  callback_data: JSON.stringify({
                    command: CallbackInfo.RECEIVER,
                  }),
                },
              ]
            : []),
        ]
      : [],
    [
      ...(receiver
        ? [
            {
              text: `🔄 Start Bridging`,
              callback_data: JSON.stringify({
                command: CallbackInfo.ESTIMATE_EXCHANGE,
              }),
            },
          ]
        : []),
      {
        text: `❌ Cancel Bridging`,
        callback_data: JSON.stringify({
          command: CallbackInfo.EXIT,
        }),
      },
    ],
  ];
};

const refreshOrderKeyboardMarkup = (id: string) => {
  return [
    [
      {
        text: `⏳ Refresh Status`,
        callback_data: JSON.stringify({
          command: CallbackInfo.REFRESH_ORDER,
          id,
        }),
      },
    ],
  ];
};

const mixingEstimateKeyboardMarkup = [
  [
    {
      text: `🔀 Create Order`,
      callback_data: JSON.stringify({
        command: CallbackInfo.CREATE_ORDER,
      }),
    },
  ],
  [
    {
      text: `❌ Cancel Bridging`,
      callback_data: JSON.stringify({
        command: CallbackInfo.EXIT,
      }),
    },
  ],
];

const tokensFromKeyboardMarkup = [
  [
    {
      text: 'ETHEREUM CHAIN',
      callback_data: JSON.stringify({}),
    },
  ],
  [
    ...list_tokens.eth.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  // [
  //   {
  //     text: 'BSC CHAIN',
  //     callback_data: JSON.stringify({}),
  //   },
  // ],
  [
    {
      text: 'Networks',
      callback_data: JSON.stringify({}),
    },
  ],
  [
    ...list_tokens.networks_btc_eth.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_op_matic.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_bsc_inj.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_sol_ada.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_xrp_ftm.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_tia_sei.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_avax_tron.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    {
      text: `❌ Cancel Bridging`,
      callback_data: JSON.stringify({
        command: CallbackInfo.EXIT,
      }),
    },
  ],
];

const tokensToKeyboardMarkup = [
  [
    {
      text: 'ETHEREUM CHAIN',
      callback_data: JSON.stringify({}),
    },
  ],
  [
    ...list_tokens.eth.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  // [
  //   {
  //     text: 'BSC CHAIN',
  //     callback_data: JSON.stringify({}),
  //   },
  // ],
  [
    {
      text: 'Networks',
      callback_data: JSON.stringify({}),
    },
  ],
  [
    ...list_tokens.networks_btc_eth.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_op_matic.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_bsc_inj.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_sol_ada.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_xrp_ftm.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_tia_sei.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_avax_tron.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    ...list_tokens.networks_dym_sui.map((item) => ({
      text: item.name,
      callback_data: JSON.stringify({
        command: CallbackInfo.MIX,
        ticker: item.ticker,
        network: item.network,
        // name: item.name,
      }),
    })),
  ],
  [
    {
      text: `❌ Cancel Bridging`,
      callback_data: JSON.stringify({
        command: CallbackInfo.EXIT,
      }),
    },
  ],
];

export const keyboardMarkup = {
  start: startKeyboardMarkup,
  socials: socialsKeyboardMarkup,
  mixing: mixingFormKeyboardMarkup,
  estimateExchange: mixingEstimateKeyboardMarkup,
  tokensFrom: tokensFromKeyboardMarkup,
  tokensTo: tokensToKeyboardMarkup,
  refreshOrder: refreshOrderKeyboardMarkup,
};
