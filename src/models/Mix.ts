export interface MixUserDto {
  [chatId: number]: MixDto;
}

export interface MixDto {
  fromToken: string;
  toToken: string;
  amount: string;
  receiver: string;
  rateId: string;
}

export interface MixDtoConversation extends MixDto {
  fromName: string;
  fromCurrency: string;
  toName: string;
  toCurrency: string;
}

export enum MixerType {
  FLOAT = 'standard',
  FIXED = 'fixed-rate',
}

export interface EstimateExchangeParams {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  fromNetwork: string;
  toNetwork: string;
  flowType: MixerType;
}

export interface AddressValidatorParams {
  network: string;
  address: string;
}

export interface CreateExchangeDto {
  fromCurrency: string;
  fromNetwork: string;
  toCurrency: string;
  toNetwork: string;
  fromAmount: string;
  toAmount: string;
  address: string;
  flow: string;
  type: string;
  rateId: string;
}
