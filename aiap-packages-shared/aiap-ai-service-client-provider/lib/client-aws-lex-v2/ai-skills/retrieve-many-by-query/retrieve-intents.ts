/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-aws-lex-v2-skills-retrieve-many-by-query-retrieve-intents';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ListIntentsCommand,
  DescribeIntentCommand,
} from '@ibm-aiap/aiap-wrapper-aws-sdk-client-lex-models-v2';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  AiServiceClientV1AwsLexV2,
} from '../..';

const _appendDescribeToIntent = async (
  client: AiServiceClientV1AwsLexV2,
  context: IContextV1,
  params: any,
) => {
  let input;
  let command;
  let commandResponse;
  try {
    if (
      !lodash.isObject(params?.intent)
    ) {
      const ERROR_MESSAGE = `Invalid params.intent attribute, has to be an object!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    input = {
      botId: params?.botSummary?.botId,
      botVersion: params?.botSummary?.latestBotVersion,
      localeId: params?.locale?.localeId,
      intentId: params?.intent?.intentId,
    }
    command = new DescribeIntentCommand(input);
    commandResponse = await client.modelsService.send(command);

    params.intent.describe = {
      sampleUtterances: commandResponse?.sampleUtterances,
    }

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendDescribeToIntent.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _appendDescribeToIntents = async (
  client: AiServiceClientV1AwsLexV2,
  context: IContextV1,
  params: any,
) => {
  try {
    if (
      !lodash.isEmpty(params?.intents) &&
      lodash.isArray(params?.intents)
    ) {
      const PROMISES = [];
      for (const INTENT of params.intents) {
        PROMISES.push(_appendDescribeToIntent(client, context, {
          botSummary: params.botSummary,
          locale: params.locale,
          intent: INTENT,
        }));
      }
      await Promise.all(PROMISES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendDescribeToIntents.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const retrieveIntents = async (
  client: AiServiceClientV1AwsLexV2,
  context: IContextV1,
  params: any,
) => {
  let input;
  let command;
  let commandResponse;
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
    if (
      lodash.isEmpty(params?.locale?.localeId)
    ) {
      const ERROR_MESSAGE = `Missing required params?.locale?.localeId paramter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    input = {
      botId: params?.botSummary?.botId,
      botVersion: params?.botSummary?.latestBotVersion,
      localeId: params?.locale?.localeId
    };
    command = new ListIntentsCommand(input);
    commandResponse = await client.modelsService.send(command);
    await _appendDescribeToIntents(client, context, {
      botSummary: params?.botSummary,
      locale: params?.locale,
      intents: commandResponse?.intentSummaries,
    });
    retVal = commandResponse?.intentSummaries;
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { input });
    logger.error(retrieveIntents.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
