/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'answers-service-answer-aca-answers-service-lib-api-answers-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const { tenantsService } = require('@ibm-aiap/aiap-app-service');
const { findOneById } = require('../answer-stores/find-one-by-id');
const { v4: uuidv4 } = require('uuid');

const _retrieveSourceAnswerStore = async (context, params) => {
  const SOURCE_TENANT_ID = params?.pullConfiguration?.tenantId;
  if (lodash.isEmpty(SOURCE_TENANT_ID)) {
    throw new Error(
      `[${MODULE_ID}] Missing mandatory params.pullConfiguration.tenantId attribute!`
    );
  }
  const SOURCE_ANSWER_STORE_ID = params?.pullConfiguration?.answerStoreId;
  if (lodash.isEmpty(SOURCE_ANSWER_STORE_ID)) {
    throw new Error(
      `[${MODULE_ID}] Missing mandatory params.pullConfiguration.answerStoreId attribute!`
    );
  }
  const SOURCE_TENANT = await tenantsService.findOneById(context, {
    id: SOURCE_TENANT_ID,
  });
  const CONTEXT = lodash.cloneDeep(context);
  CONTEXT.user.session.tenant = SOURCE_TENANT;
  const RET_VAL = await findOneById(CONTEXT, { id: SOURCE_ANSWER_STORE_ID });
  return RET_VAL;
};

const _mergeAnswerStoreAnswers = (targetAnswers, sourceAnswers) => {
  if (
    !lodash.isEmpty(sourceAnswers) &&
    lodash.isArray(sourceAnswers) &&
    lodash.isArray(targetAnswers)
  ) {
    for (let sourceAnswer of sourceAnswers) {
      const isAnswerKeySameCondition = (item) => {
        let condition = false;
        if (
          sourceAnswer &&
          sourceAnswer.key &&
          item &&
          item.key &&
          item.key === sourceAnswer.key
        ) {
          condition = true;
        }
        return condition;
      };
      let targetAnswer = targetAnswers.find(isAnswerKeySameCondition);
      if (targetAnswer) {
        _mergeAnswer(targetAnswer, sourceAnswer);
      } else {
        targetAnswers.push(sourceAnswer);
      }
    }
  }
};

const _mergeAnswerStore = (target, source) => {
  if (lodash.isEmpty(target)) {
    throw new Error(`[${MODULE_ID}] Missing mandatory target parameter!`);
  }
  const RET_VAL = lodash.cloneDeep(target);
  if (!RET_VAL.answers) {
    RET_VAL.answers = [];
  }
  const SOURCE_ANSWERS = ramda.pathOr([], ['answers'], source);
  _mergeAnswerStoreAnswers(RET_VAL.answers, SOURCE_ANSWERS);
  return RET_VAL;
};

const _mergeAnswer = (targetAnswer, sourceAnswer) => {
  if (!lodash.isEmpty(targetAnswer) && !lodash.isEmpty(sourceAnswer)) {
    targetAnswer.value = sourceAnswer.value;
    targetAnswer.values = sourceAnswer.values;
  }
};

const _idTestAndAdd = (answers) => {
  let validAnswers = [];
  for (let answer of answers) {
    if (!answer.id) {
      answer.id = uuidv4();
      validAnswers.push(answer);
    } else {
      validAnswers.push(answer);
    }
  }
  return validAnswers;
};

const _appendAuditInfoToAnswers = (context, params) => {
  const ANSWERS = params?.answers;

  if (
    lodash.isEmpty(ANSWERS) ||
    !lodash.isArray(ANSWERS)
  ) {
    throw new Error(
      `[${MODULE_ID}] params.answers is missing or not an array!`
    );
  }

  ANSWERS.forEach((answer) => {
    appendAuditInfo(context, answer);
  });
};

module.exports = {
  _retrieveSourceAnswerStore,
  _mergeAnswerStore,
  _mergeAnswer,
  _mergeAnswerStoreAnswers,
  _idTestAndAdd,
  _appendAuditInfoToAnswers,
};
