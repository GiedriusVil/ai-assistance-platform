/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-chatgpt-v3';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  AI_SERVICE_TYPE_ENUM,
} from '@ibm-aiap/aiap--types-server';

import {
  AiServiceAdapterV1,
  IAiServiceAdapterV1,
} from '../../types';

import { _request } from './request';
import { _response } from './response';
import { _state } from './state';

export class AiServiceAdapterV1ChatGptV3
  extends AiServiceAdapterV1
  implements IAiServiceAdapterV1 {

  constructor() {
    super();
    this.type = AI_SERVICE_TYPE_ENUM.CHAT_GPT_V3;
  }

  get request() {
    const RET_VAL = _request(this);
    return RET_VAL;
  }

  get response() {
    const RET_VAL = _response(this);
    return RET_VAL;
  }

  get state() {
    const RET_VAL = _state(this);
    return RET_VAL;
  }

}
