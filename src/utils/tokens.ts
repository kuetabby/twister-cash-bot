const eth = [
  {
    ticker: 'eth',
    name: 'ETH (ERC20)',
    image: 'https://content-api.changenow.io/uploads/eth_f4ebb54ec0.svg',
    network: 'eth',
    tokenContract: null,
    legacyTicker: 'eth',
  },
  {
    ticker: 'usdt',
    name: 'USDT (ERC20)',
    image: 'https://content-api.changenow.io/uploads/usdterc20_5ae21618aa.svg',
    network: 'eth',
    tokenContract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    legacyTicker: 'usdterc20',
  },
  {
    ticker: 'usdc',
    name: 'USDC (ERC20)',
    image: 'https://content-api.changenow.io/uploads/usdcerc20_acd5759c8c.svg',
    network: 'eth',
    tokenContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    legacyTicker: 'usdc',
  },
];

const bsc = [
  {
    ticker: 'bnb',
    name: 'BNB (BEP20)',
    image: 'https://content-api.changenow.io/uploads/bnbbsc_331e969a6b.svg',
    network: 'bsc',
    tokenContract: null,
    legacyTicker: 'bnbbsc',
  },
  {
    ticker: 'usdt',
    name: 'USDT (BEP20)',
    image: 'https://content-api.changenow.io/uploads/usdtbsc_b8f3d8f316.svg',
    network: 'bsc',
    tokenContract: '0x55d398326f99059fF775485246999027B3197955',
    legacyTicker: 'usdtbsc',
  },
  {
    ticker: 'usdc',
    name: 'USDC (BEP20)',
    image: 'https://content-api.changenow.io/uploads/usdcbsc_397b9c0f7d.svg',
    network: 'bsc',
    tokenContract: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    legacyTicker: 'usdcbsc',
  },
];

const networks_btc_eth = [
  {
    ticker: 'btc',
    name: 'Bitcoin (BTC)',
    image: 'https://content-api.changenow.io/uploads/btc_1_527dc9ec3c.svg',
    network: 'btc',
    tokenContract: null,
    legacyTicker: 'btc',
  },
  {
    ticker: 'eth',
    name: 'Ethereum (ARB20)',
    image:
      'https://content-api.changenow.io/uploads/etharbitrum_796401be67.svg',
    network: 'arbitrum',
    tokenContract: null,
    legacyTicker: 'etharb',
  },
];

const networks_sol_ada = [
  {
    ticker: 'sol',
    name: 'Solana (SOL)',
    image: 'https://content-api.changenow.io/uploads/sol_3b3f795997.svg',
    network: 'sol',
    tokenContract: null,
    legacyTicker: 'sol',
  },
  {
    ticker: 'ada',
    name: 'Cardano (ADA)',
    image: 'https://content-api.changenow.io/uploads/ada_fb42809541.svg',
    network: 'ada',
    tokenContract: null,
    legacyTicker: 'ada',
  },
];

const networks_xrp_ftm = [
  {
    ticker: 'xrp',
    name: 'Ripple (XRP)',
    image: 'https://content-api.changenow.io/uploads/xrp_3b5212fd4a.svg',
    network: 'xrp',
    tokenContract: null,
    legacyTicker: 'xrp',
  },
  {
    ticker: 'ftm',
    name: 'Fantom (FTM)',
    image: 'https://content-api.changenow.io/uploads/ftm_801088098f.svg',
    network: 'ftm',
    tokenContract: null,
    legacyTicker: 'ftmmainnet',
  },
];

export const list_currency = [
  ...eth,
  ...bsc,
  ...networks_btc_eth,
  ...networks_sol_ada,
  ...networks_xrp_ftm,
];

export const list_tokens = {
  eth,
  bsc,
  networks_btc_eth,
  networks_sol_ada,
  networks_xrp_ftm,
};
