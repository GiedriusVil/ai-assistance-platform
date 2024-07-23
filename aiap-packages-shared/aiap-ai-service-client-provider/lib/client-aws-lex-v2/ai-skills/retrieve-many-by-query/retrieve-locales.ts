/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-aws-lex-v2-skills-retrieve-many-by-query-retrieve-locales';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ListBotLocalesCommand,
} from '@ibm-aiap/aiap-wrapper-aws-sdk-client-lex-models-v2';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  AiServiceClientV1AwsLexV2,
} from '../..'

export const retrieveLocales = async (
  client: AiServiceClientV1AwsLexV2,
  context: IContextV1,
  params: any
) => {
  let input;
  let command;
  let response;
  let retVal;
  try {
    if (
      lodash.isEmpty(params?.botSummary?.botId)
    ) {
      const ERROR_MESSAGE = `Missing required params?.botSummary?.botId paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(params?.botSummary?.latestBotVersion)
    ) {
      const ERROR_MESSAGE = `Missing required params?.botSummary?.latestBotVersion paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }

    input = {
      botId: params?.botSummary?.botId,
      botVersion: params?.botSummary?.latestBotVersion,
    };
    command = new ListBotLocalesCommand(input);
    response = await client.modelsService.send(command);
    retVal = response?.botLocaleSummaries;
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { input })
    logger.error(retrieveLocales.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
