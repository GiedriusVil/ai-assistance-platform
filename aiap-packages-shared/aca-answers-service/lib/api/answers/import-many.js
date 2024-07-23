/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-service-answers-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { _mergeAnswerStore, _appendAuditInfoToAnswers } = require('../answers-utils');
const { readJsonFromFile } = require('./imports');

const answerStoreService = require('../answer-stores');

const importMany = async (context, params) => {
  try {
    const CURRENT_ANSWER_STORE = await answerStoreService.findOneById(context, params);
    const ANSWERS_FROM_FILE = await readJsonFromFile(params.file);

    if (lodash.isEmpty(ANSWERS_FROM_FILE)) {
      const MESSAGE = `Missing answers in file!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_EMPTY_KEY = ANSWERS_FROM_FILE.every(
      answer => lodash.isEmpty(answer.key)
    );
    if (HAS_EMPTY_KEY) {
      const MESSAGE = `All 'key' properties must contain proper values!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    
    const MAPPED_ANSWERS = mapFileDataToAnswersArray(ANSWERS_FROM_FILE)

    checkFileProperStructure(MAPPED_ANSWERS);

    const ANSWERS_TO_IMPORT = { answers: MAPPED_ANSWERS };
    const UPDATED = {
      user: {
        id: context?.user?.id,
        name: context?.user?.username,
      },
      date: new Date(),
    }
    const DATASOURCE = getDatasourceByContext(context);
    const TARGET_ANSWERS = _mergeAnswerStore(CURRENT_ANSWER_STORE, ANSWERS_TO_IMPORT);
    _appendAuditInfoToAnswers(context, { answers: TARGET_ANSWERS.answers });
    const ANSWERS_PARAMS = {
      _id: TARGET_ANSWERS.id,
      created: TARGET_ANSWERS.created,
      name: TARGET_ANSWERS.name,
      updated: UPDATED,
      assistantId: TARGET_ANSWERS.assistantId,
      answers: TARGET_ANSWERS.answers
    };
    logger.debug(importMany.name, ANSWERS_PARAMS);
    await DATASOURCE.answers.importMany(context, ANSWERS_PARAMS);
    const RET_VAL = {
      status: 'SUCCESS'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(importMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const checkFileProperStructure = (answersFromFile) => {
  const HAS_PROPER_FILE_STRUCTURE = answersFromFile.every(
    answer => lodash.has(answer, 'key') && lodash.has(answer, 'values') && lodash.isArray(answer.values)
  );
  if (!HAS_PROPER_FILE_STRUCTURE) {
    const MESSAGE = `File structure is not compatible for import! File must contain 'key' and 'values' properties or answers values is not array`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
}

const mapFileDataToAnswersArray = (answers) => {
  const ANSWERS = [];
  const ANSWERS_VALUES = answers?.[0]?.values;

  if (lodash.isArray(answers) && lodash.isArray(ANSWERS_VALUES)) {
    for (let answer of answers) {
      ANSWERS.push({
        ...answer
      })
    }
  } else if (lodash.isArray(answers)) {
    for (let answer of answers) {
      const TMP_ANSWER = {
        text: answer.value,
        language: answer.language,
        output: {
          text: answer.value,
        },
        type: 'TEXT',
      }

      if (!lodash.isEmpty(answer.label)) {
        TMP_ANSWER.output.intent = { name: answer.label };
      }
      
      const ANSWER_INDEX = ANSWERS.findIndex((item) => item.key === answer.key);

      if (ANSWER_INDEX >= 0) {
        ANSWERS[ANSWER_INDEX].values.push({
          ...TMP_ANSWER
        })
      } else {
        ANSWERS.push({
          key: answer.key,
          value: answer.value,
          values: [{
            ...TMP_ANSWER
          }]
        });
      }
    }
    
  }

  return ANSWERS;
}

module.exports = {
  importMany,
}
