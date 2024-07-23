/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-service-answers-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { aiSkillsService } = require('@ibm-aiap/aiap-ai-services-service');

const addSkillsToAnswer = async (context, answer) => {
  const PARAMS = {
    answerKey: answer.key,
  };
  const RESPONSE = await aiSkillsService.findManyByAnswerKey(context, PARAMS);
  answer.skills = RESPONSE;
  return answer;
}

const attachAnswersSkills = async (context, answers) => {
  const PROMISES = [];
  for (let answer of answers) {
    PROMISES.push(addSkillsToAnswer(context, answer));
  }
  const RET_VAL = await Promise.all(PROMISES);
  return RET_VAL;
}

const findManyByQuery = async (context, params) => {
  try {
    const ATTACH_SKILLS = params?.attachSkills;
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.answers.findManyByQuery(context, params);
    if (ATTACH_SKILLS) {
      RET_VAL.items = await attachAnswersSkills(context, RET_VAL.items);
    }
    const PARENT = await DATASOURCE.answerStores.findOneById(context, { id: params.answerStoreId });
    if (
      !lodash.isEmpty(PARENT)
    ) {
      delete PARENT.answers
    }
    RET_VAL.parent = PARENT;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByQuery,
}
