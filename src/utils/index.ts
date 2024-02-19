export enum ChatStage {
  START = 1,
  SOCIALS = 2,
  MIX = 3,
  WELCOME_VIDEO = 4,
  EXIT = 5,
}

export enum CallbackInfo {
  MIX = 1,
  ABOUT = 2,
  SOCIALS = 3,
  FROM_TOKEN = 4,
  TO_TOKEN = 5,
  AMOUNT = 6,
  RECEIVER = 7,
  ESTIMATE_EXCHANGE = 8,
  CREATE_ORDER = 9,
  REFRESH_ORDER = 10,
  BACK = 11,
  EXIT = 12,
}

export const adminId = 6019985262;

const welcome = `
*INCOGNITOSHIFT PROTOCOL: Powered by AI to Unlock the new Experience of Web3*

Embark on a Journey of Anonymous Trading, Rewarding Staking, and Next-Level AI-Based Asset Optimization
`;

const mixing = `*Fill all the details below to start bridging*`;

const about = `
*IS Protocol AI powered crypto bridging tools*

Using Telegram to bridge and transfer cryptocurrency while maintaining privacy, security and anonymity.

IS Protocol offers solution that enable transactional privacy and security by breaking on-chain link between sender and recipient address.

*To use the IS Protocol AI bridge:*
1. First choose the cryptocurrency you want to deposit (from currency) 
2. Select the cryptocurrency to withdraw (to currency) 
3. Enter the amount of the transaction. 
4. Enter the recipient wallet's (receiver wallet) address.
Our system completes transactions in less than 30 minutes.
`;

export const textInfo = {
  welcome,
  mixing,
  about,
};

export const isAdmin = (userId: number) => {
  return adminId === userId;
};
