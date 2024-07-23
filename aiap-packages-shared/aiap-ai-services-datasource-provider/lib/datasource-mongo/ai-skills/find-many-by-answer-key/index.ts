/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-skills-find-many-by-answer-key';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors'

import {
  IFindAiSkillsByAnswerKeyParamsV1,
  IFindAiSkillsByAnswerKeyResponseV1,
} from '../../../types';

import {
  AiServicesDatasourceMongoV1,
} from '../..';

import {
  aggregateQuery,
} from './aggregate-query';

export const findManyByAnswerKey = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IFindAiSkillsByAnswerKeyParamsV1,
): Promise<IFindAiSkillsByAnswerKeyResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiSkills;

  const ANSWER_KEY = params?.answerKey;

  let pipeline;
  try {
    if (
      lodash.isEmpty(ANSWER_KEY)
    ) {
      const MESSAGE = `Missing required params.answerKey parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    pipeline = aggregateQuery(context, params);

    const ACA_MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const SKILLS = ramda.pathOr([], ['skills'], RESULT);
    const COUNT = ramda.pathOr(0, ['count'], RESULT);

    const RET_VAL: IFindAiSkillsByAnswerKeyResponseV1 = {
      skills: SKILLS,
      count: COUNT
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, pipeline });
    logger.error(findManyByAnswerKey.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
