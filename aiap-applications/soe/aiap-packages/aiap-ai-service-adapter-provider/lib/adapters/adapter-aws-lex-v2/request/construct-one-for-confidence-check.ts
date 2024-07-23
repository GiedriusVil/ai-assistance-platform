/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-aws-lex-v2-request-construct-one-for-confidence-check';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  uuidv4,
} from '@ibm-aca/aca-wrapper-uuid';

import {
  IAiServiceRequestV1,
  IAiServiceRequestExternalV1AwsLexV2,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IConstructRequestForConfidenceCheckParamsV1,
} from '../../../types';

export const constructOneForConfidenceCheck = async (
  context: ISoeContextV1,
  params: IConstructRequestForConfidenceCheckParamsV1,
): Promise<IAiServiceRequestV1> => {
  let text;
  let aiService;

  let external: IAiServiceRequestExternalV1AwsLexV2;

  let retVal: IAiServiceRequestV1;
  try {
    text = params?.text;
    aiService = params?.aiService;

    external = {
      botId: aiService?.aiSkill?.external?.botSummary?.botId,
      botAliasId: aiService?.aiSkill?.external?.alias?.botAliasId,
      sessionId: uuidv4(),
      localeId: aiService?.aiSkill?.external?.locale?.localeId,
      text: text,
    }

    retVal = {
      type: aiService?.type,
      version: aiService?.version,
      external: external,
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOneForConfidenceCheck.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
