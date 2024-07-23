/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IAiServiceV1,
  IAiServiceExternalV1WaV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  BasicAuthenticator,
  IamAuthenticator,
  AssistantV1,
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import {
  _validateAiService,
} from './validate-ai-service';

import {
  IAiServiceClientV1,
  AiServiceClientV1,
} from '../client';

import { _dialogNodes } from './ai-dialog-nodes';
import { _entities } from './ai-entities';
import { _intents } from './ai-intents';
import { _serviceLogs } from './ai-service-logs';
import { _services } from './ai-services';
import { _skills } from './ai-skills';
import { _messages } from './messages';
import { _userData } from './user-data';
import { _changeRequest } from './ai-change-request';

export class AiServiceClientV1WaV1
  extends AiServiceClientV1<IAiServiceV1>
  implements IAiServiceClientV1 {

  authenticator: IamAuthenticator | BasicAuthenticator;
  assistant: AssistantV1;

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
    let external: IAiServiceExternalV1WaV1;
    let version: string;
    let url: string;
    let authType: string;
    let username: string;
    let password: string;
    try {
      external = this.aiService?.external as IAiServiceExternalV1WaV1;
      version = external?.version;
      url = external?.url;
      authType = external?.authType;
      username = external?.username;
      password = external?.password;
      if (
        (
          authType === 'IAM' ||
          authType === 'iam'
        ) &&
        username === 'apikey'
      ) {
        this.authenticator = new IamAuthenticator({
          apikey: password
        });
      } else {
        this.authenticator = new BasicAuthenticator({
          username: username,
          password: password,
        });
      }
      const ASSISTANT_USER_OPTIONS = {
        version: version,
        serviceUrl: url,
        authenticator: this.authenticator,
      }

      this.assistant = new AssistantV1(ASSISTANT_USER_OPTIONS);

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
