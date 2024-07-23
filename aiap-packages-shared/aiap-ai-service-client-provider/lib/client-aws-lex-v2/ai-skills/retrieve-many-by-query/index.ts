/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-aws-lex-v2-skill-retrieve-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ListBotsCommand,
} from '@ibm-aiap/aiap-wrapper-aws-sdk-client-lex-models-v2';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  AiServiceClientV1AwsLexV2,
} from '../..';

import {
  IRetrieveAiSkillsByQueryParamsV1,
  IRetrieveAiSkillsByQueryResponseV1,
} from '../../../types';

import { retrieveAliases } from './retrieve-aliases';
import { retrieveLocales } from './retrieve-locales';
import { retrieveIntents } from './retrieve-intents';

const _appendLocalesToBotSummary = async (
  client: AiServiceClientV1AwsLexV2,
  context: IContextV1,
  botSummary: any,
) => {
  let locales;
  try {
    locales = await retrieveLocales(client, context, { botSummary });
    botSummary.locales = locales;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendLocalesToBotSummary.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _appendLocalesToBotSummaries = async (
  client: AiServiceClientV1AwsLexV2,
  context: IContextV1,
  botSummaries: any,
) => {
  try {
    const PROMISES = [];
    if (
      !lodash.isEmpty(botSummaries) &&
      lodash.isArray(botSummaries)
    ) {
      for (const BOT_SUMMARY of botSummaries) {
        PROMISES.push(
          _appendLocalesToBotSummary(client, context, BOT_SUMMARY)
        );
      }
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendLocalesToBotSummaries.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _appendIntentsToAiSkill = async (
  client: AiServiceClientV1AwsLexV2,
  context: IContextV1,
  aiSkill: any,
) => {
  let intents;
  try {
    intents = await retrieveIntents(client, context,
      {
        botSummary: aiSkill?.botSummary,
        locale: aiSkill?.locale,
      });

    aiSkill.intents = intents;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendIntentsToAiSkill.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _appendIntentsToAiSkills = async (
  client: AiServiceClientV1AwsLexV2,
  context: IContextV1,
  aiSkills: any,
) => {
  try {
    const PROMISES = [];
    if (
      !lodash.isEmpty(aiSkills) &&
      lodash.isArray(aiSkills)
    ) {
      for (const AI_SKILL of aiSkills) {
        PROMISES.push(
          _appendIntentsToAiSkill(client, context, AI_SKILL)
        );
      }
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendIntentsToAiSkills.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _sanitizeBotSummaries = (
  botSummaries: any,
) => {
  if (
    lodash.isArray(botSummaries) &&
    !lodash.isEmpty(botSummaries)
  ) {
    botSummaries = botSummaries.forEach((item) => {
      if (
        lodash.isObject(item)
      ) {
        item.latestBotVersion = lodash.isEmpty(item.latestBotVersion) ? 'DRAFT' : item.latestBotVersion;
      }
    });
  }
}

const _appendAliasesToBotSummary = async (
  client: AiServiceClientV1AwsLexV2,
  context: IContextV1,
  botSummary: any,
) => {
  let aliases;
  try {
    aliases = await retrieveAliases(client, context, { botSummary });
    botSummary.aliases = aliases;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendAliasesToBotSummary.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _appendAliasesToBotSummaries = async (
  client: AiServiceClientV1AwsLexV2,
  context: IContextV1,
  botSummaries: any,
) => {
  try {
    const PROMISES = [];
    if (
      !lodash.isEmpty(botSummaries) &&
      lodash.isArray(botSummaries)
    ) {
      for (const BOT_SUMMARY of botSummaries) {
        PROMISES.push(
          _appendAliasesToBotSummary(client, context, BOT_SUMMARY)
        );
      }
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_appendAliasesToBotSummaries.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const retrieveManyByQuery = async (
  client: AiServiceClientV1AwsLexV2,
  context: IContextV1,
  params: IRetrieveAiSkillsByQueryParamsV1,
): Promise<IRetrieveAiSkillsByQueryResponseV1> => {
  let input;
  let botSummaries;
  let command;
  let commandResponse;

  const AI_SKILLS: Array<any> = [];
  let retVal;
  try {
    input = {};
    command = new ListBotsCommand(input);

    commandResponse = await client.modelsService.send(command);

    botSummaries = commandResponse?.botSummaries;
    _sanitizeBotSummaries(botSummaries);
    await _appendAliasesToBotSummaries(client, context, botSummaries);
    await _appendLocalesToBotSummaries(client, context, botSummaries);
    let aiSkill;

    for (const BOT_SUMMARY of botSummaries) {
      if (
        !lodash.isEmpty(BOT_SUMMARY?.locales) &&
        lodash.isArray(BOT_SUMMARY?.locales)
      ) {
        let tmpAliases;
        for (const LOCALE of BOT_SUMMARY.locales) {
          aiSkill = {
            botSummary: BOT_SUMMARY,
            locale: LOCALE,
          };
          if (
            !lodash.isEmpty(BOT_SUMMARY?.aliases) &&
            lodash.isArray(BOT_SUMMARY?.aliases)
          ) {
            tmpAliases = lodash.orderBy(
              BOT_SUMMARY?.aliases,
              [(alias) => { return alias?.creationDateTime || new Date() }],
              ['asc']
            );
            aiSkill.aliases = tmpAliases;
            aiSkill.alias = tmpAliases[0];
          }
          delete aiSkill.botSummary.locales;
          delete aiSkill.botSummary.aliases;
          AI_SKILLS.push(aiSkill);
        }
      }
    }
    await _appendIntentsToAiSkills(client, context, AI_SKILLS);
    retVal = AI_SKILLS;
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
