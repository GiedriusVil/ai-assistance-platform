/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-chatgpt-v3-request-construct-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceRequestExternalV1ChatGptV3,
  IAiServiceRequestV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateSession,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  IConstructRequestParamsV1,
} from '../../../types';

export const constructOne = async (
  context: ISoeContextV1,
  params: IConstructRequestParamsV1,
): Promise<IAiServiceRequestV1> => {

  let update;
  let updateSession;
  let updateRequestMessageText;

  let aiService;

  let text;

  let external: IAiServiceRequestExternalV1ChatGptV3;
  let retVal: IAiServiceRequestV1;
  try {
    update = params?.update;
    updateRequestMessageText = update?.request?.message?.text;

    if (
      lodash.isEmpty(update)
    ) {
      const ERROR_MESSAGE = `Missing required params.update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    if (
      !lodash.isEmpty(updateRequestMessageText)
    ) {
      text = updateRequestMessageText
        .replace(/’/g, "'")
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ');
    } else {
      text = 'hello \n';
    }
    updateSession = getUpdateSession(update);
    aiService = updateSession?.aiService;
    if (
      lodash.isEmpty(aiService)
    ) {
      const ERROR_MESSAGE = `Missing required params.update.session.aiService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    if (
      lodash.isEmpty(aiService?.external?.completion?.model)
    ) {
      const ERROR_MESSAGE = `Missing required params.update.session.aiService.external.completion.model parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isNumber(aiService?.external?.completion?.temperature)
    ) {
      const ERROR_MESSAGE = `Missing required params.update.session.aiService.external.completion.temperature parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isNumber(aiService?.external?.completion?.max_tokens)
    ) {
      const ERROR_MESSAGE = `Missing required params.update.session.aiService.external.completion.max_tokens parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isNumber(aiService?.external?.completion?.top_p)
    ) {
      const ERROR_MESSAGE = `Missing required params.update.session.aiService.external.completion.top_p parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isNumber(aiService?.external?.completion?.frequency_penalty)
    ) {
      const ERROR_MESSAGE = `Missing required params.update.session.aiService.external.completion.frequency_penalty parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isNumber(aiService?.external?.completion?.presence_penalty)
    ) {
      const ERROR_MESSAGE = `Missing required params.update.session.aiService.external.completion.presence_penalty parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    external = {
      model: aiService?.external?.completion?.model,
      prompt: text,
      temperature: aiService?.external?.completion?.temperature,
      max_tokens: aiService?.external?.completion?.max_tokens,
      top_p: aiService?.external?.completion?.top_p,
      frequency_penalty: aiService?.external?.completion?.frequency_penalty,
      presence_penalty: aiService?.external?.completion?.presence_penalty,
    }

    retVal = {
      type: aiService?.type,
      version: aiService?.version,
      external: external,
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOne.name, { ACA_ERROR, aiService });
    throw ACA_ERROR;
  }
}
