import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import {
  AddressValidatorParams,
  CreateExchangeDto,
  EstimateExchangeParams,
  MixerType,
} from './models/Mix';
import { AnalyzeResultDto } from './models/Analyze';

// const changeNowKey =
//   'e7dd253a844bb1b84d69a570911edf77c3952d1ccb6bc8acc743aea2e94df12c';

const baseUrl = 'https://api.changenow.io/v2';

const apiKey = {
  changeNow: 'e7dd253a844bb1b84d69a570911edf77c3952d1ccb6bc8acc743aea2e94df12c',
  goPlus: '9eH13SpSxsrEtoHlgGjf',
};

let retries = 3;
@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getMinExchangeAmount() {
    console.log('running');

    // var config = {
    //   method: 'get',
    //   maxBodyLength: Infinity,
    //   url: ,
    //   headers: {
    //     'x-api-key': changeNowKey,
    //   },
    // };

    const request = await this.httpService.axiosRef.get('', {
      headers: {
        'x-api-key': apiKey.changeNow,
      },
      maxBodyLength: Infinity,
    });

    // const request = await this.httpService.get(
    //   ,
    //   {
    // );

    const response = await request.data;

    console.log(response, 'response');

    return response;

    // axios(config)
    // .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  }

  async getEstimateExchange({
    flowType,
    fromCurrency,
    fromAmount,
    fromNetwork,
    toAmount,
    toCurrency,
    toNetwork,
  }: EstimateExchangeParams) {
    try {
      const request = await this.httpService.axiosRef.get(
        `/exchange/estimated-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromAmount=${fromAmount}&toAmount=&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}&flow=${flowType}&type=direct&${
          flowType === MixerType.FIXED ? 'useRateId=true' : ''
        }`,
        {
          baseURL: baseUrl,
          timeout: 100000,
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'x-changenow-api-key': apiKey.changeNow,
          },
        },
      );

      const response = await request.data;
      return {
        ...response,
        isSuccess: true,
      };
    } catch (error) {
      let errMsg;
      if (error.response) {
        errMsg = error.response?.data;
        // The server responded with a status other than 2xx
        // console.error('Server responded with an error:', error.response.data);
        // console.error('Status code:', error.response.status);
        // console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // console.error('No response received:', error.request);
        errMsg = error.request;
      } else {
        errMsg = error.message;
        // Something else happened while setting up the request
        // console.error('Error', error.message);
      }
      return {
        ...errMsg,
        isSuccess: false,
      };
    }
  }

  async getAddressValidator({ address, network }: AddressValidatorParams) {
    const currency = network.toLowerCase() === 'bsc' ? 'bnb' : network;

    try {
      const request = await this.httpService.axiosRef.get(
        `/validate/address?currency=${currency}&address=${address}`,
        {
          baseURL: baseUrl,
          timeout: 100000,
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
        },
      );
      const response = await request.data;
      return {
        ...response,
        isSuccess: true,
      };
    } catch (error) {
      let errMsg;
      if (error.response) {
        errMsg = error.response?.data;
        // The server responded with a status other than 2xx
        // console.error('Server responded with an error:', error.response.data);
        // console.error('Status code:', error.response.status);
        // console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // console.error('No response received:', error.request);
        errMsg = error.request;
      } else {
        errMsg = error.message;
        // Something else happened while setting up the request
        // console.error('Error', error.message);
      }
      return {
        ...errMsg,
        isSuccess: false,
      };
    }
  }

  async getStatusOrder(id: string) {
    try {
      const request = await this.httpService.axiosRef.get(
        `/exchange/by-id?id=${id}`,
        {
          baseURL: baseUrl,
          timeout: 100000,
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'x-changenow-api-key': apiKey.changeNow,
          },
        },
      );
      const response = await request.data;
      return {
        ...response,
        isSuccess: true,
      };
    } catch (error) {
      let errMsg;
      if (error.response) {
        errMsg = error.response?.data;
        // The server responded with a status other than 2xx
        // console.error('Server responded with an error:', error.response.data);
        // console.error('Status code:', error.response.status);
        // console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // console.error('No response received:', error.request);
        errMsg = error.request;
      } else {
        errMsg = error.message;
        // Something else happened while setting up the request
        // console.error('Error', error.message);
      }
      return {
        ...errMsg,
        isSuccess: false,
      };
    }
  }

  async createOrder(dto: CreateExchangeDto) {
    const request = await this.httpService.axiosRef.post('/exchange', dto, {
      baseURL: baseUrl,
      timeout: 100000,
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'x-changenow-api-key': apiKey.changeNow,
      },
    });

    const response = await request.data;
    return response;
  }

  async getResultAnalyzing(dto: AnalyzeResultDto) {
    try {
      const request = await this.httpService.axiosRef.get(
        `https://api.gopluslabs.io/api/v1/token_security/${dto.chainId}?contract_addresses=${dto.contractAddress}`,
        {
          timeout: 100000,
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'Api-Key': `Bearer ${apiKey.goPlus}`,
          },
        },
      );

      const response = await request.data;
      retries = 3;
      return response;
    } catch (error) {
      if (retries > 0) {
        retries -= 1;
        return this.getResultAnalyzing(dto);
      } else {
        retries = 3;
        return error;
      }
    }
  }
}
