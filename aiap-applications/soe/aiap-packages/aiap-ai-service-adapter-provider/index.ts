/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AiServiceAdapterV1AwsLexV2,
  AiServiceAdapterV1ChatGptV3,
  AiServiceAdapterV1WaV1,
  AiServiceAdapterV1WaV2,
} from './lib/adapters';


import {
  IAiServiceAdapterV1,
  IAiServiceAdapterV1RegistryV1,
} from './lib/types';

const REGISTRY: IAiServiceAdapterV1RegistryV1 = {
  AWS_LEX_V2: new AiServiceAdapterV1AwsLexV2(),
  CHAT_GPT_V3: new AiServiceAdapterV1ChatGptV3(),
  WA: new AiServiceAdapterV1WaV1(),
  WA_V2: new AiServiceAdapterV1WaV2(),
};

const getRegistry = (): IAiServiceAdapterV1RegistryV1 => {
  return REGISTRY;
}

export {
  IAiServiceAdapterV1,
  IAiServiceAdapterV1RegistryV1,
  //
  getRegistry,
}
