/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-chat-gpt-v3';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceV1,
  IAiSericeExternalV1ChatGptV3,
} from '@ibm-aiap/aiap--types-server';

import {
  Configuration,
  OpenAIApi
} from '@ibm-aiap/aiap-wrapper-openai';

import {
  IAiServiceClientV1,
  AiServiceClientV1,
} from '../client';

import {
  _validateAiService,
} from './validate-ai-service';

import { _dialogNodes } from './ai-dialog-nodes';
import { _entities } from './ai-entities';
import { _intents } from './ai-intents';
import { _serviceLogs } from './ai-service-logs';
import { _services } from './ai-services';
import { _skills } from './ai-skills';
import { _messages } from './messages';
import { _userData } from './user-data';
import { _changeRequest } from './ai-change-request';

export class AiServiceClientV1ChatGptV3
  extends AiServiceClientV1<IAiServiceV1>
  implements IAiServiceClientV1 {

  openAi: OpenAIApi;
  openAiConfiguration: Configuration;

  constructor(
    aiService: IAiServiceV1,
  ) {
    super(aiService);
  }

  validateAiService(
    aiService: IAiServiceV1
  ): void {
    _validateAiService(aiService);
  }

  async initialise() {
    let external: IAiSericeExternalV1ChatGptV3;
    try {
      external = this.aiService?.external as IAiSericeExternalV1ChatGptV3;

      this.openAiConfiguration = new Configuration({
        ...external,
      });
      this.openAi = new OpenAIApi(this.openAiConfiguration);

      logger.info(this.initialise.name, {});
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.initialise.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get changeRequest() {
    const RET_VAL = _changeRequest(this);
    return RET_VAL;
  }
  get dialogNodes() {
    const RET_VAL = _dialogNodes(this);
    return RET_VAL;
  }

  get entities() {
    const RET_VAL = _entities(this);
    return RET_VAL;
  }

  get intents() {
    const RET_VAL = _intents(this);
    return RET_VAL;
  }

  get messages() {
    const RET_VAL = _messages(this);
    return RET_VAL;
  }

  get serviceLogs() {
    const RET_VAL = _serviceLogs(this);
    return RET_VAL;
  }

  get services() {
    const RET_VAL = _services(this);
    return RET_VAL;
  }

  get skills() {
    const RET_VAL = _skills(this);
    return RET_VAL;
  }

  get userData() {
    const RET_VAL = _userData(this);
    return RET_VAL;
  }

}
