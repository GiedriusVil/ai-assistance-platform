/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-aws-lex-v2-request-construct-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceRequestV1,
  IAiServiceRequestExternalV1AwsLexV2,
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
  let aiSkill;

  let text;

  let external: IAiServiceRequestExternalV1AwsLexV2;

  let retVal: IAiServiceRequestV1;
  try {
    if (
      lodash.isEmpty(params?.update)
    ) {
      const ERROR_MESSAGE = `Missing required params.update parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    update = params?.update;
    updateRequestMessageText = update?.request?.message?.text;
    updateSession = getUpdateSession(update);
    aiService = updateSession?.aiService;

    if (
      lodash.isEmpty(aiService)
    ) {
      const ERROR_MESSAGE = `Missing required params.update.session.aiService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isEmpty(updateRequestMessageText)
    ) {
      text = updateRequestMessageText
        .replace(/’/g, "'")
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ');
    }
    aiSkill = aiService?.aiSkill;
    if (
      lodash.isEmpty(params?.update?.traceId?.conversationId)
    ) {
      const ERROR_MESSAGE = `Missing required params?.update?.traceId?.conversationId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    external = {
      botId: aiSkill?.external?.botSummary?.botId,
      botAliasId: aiService?.aiSkill?.external?.alias?.botAliasId,
      sessionId: params?.update?.traceId?.conversationId,
      localeId: aiSkill?.external?.locale?.localeId,
      text: text,
    };

    retVal = {
      type: aiService?.type,
      version: aiService?.version,
      external: external,
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
