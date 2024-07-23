/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-v2-rules-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { readJsonFromFile } = require('@ibm-aiap/aiap-utils-file');
const { saveOne: ruleV2SaveOne } = require('./save-one');
const { saveOne: ruleConditionsV2SaveOne } = require('../rules-conditions/save-one');

const separateConditionsFromRule = (rule) => {
  let conditions = [];
  if (
    !lodash.isEmpty(rule?.conditions) &&
    lodash.isArray(rule.conditions)
  ) {
    conditions = lodash.cloneDeep(rule.conditions);
    delete rule.conditions;
  }
  return conditions;
}

const importMany = async (context, params) => {
  try {
    const FILE = params?.file;
    const RECORDS_FROM_FILE = await readJsonFromFile(FILE);
    if (
      lodash.isEmpty(RECORDS_FROM_FILE)
    ) {
      const MESSAGE = 'Missing rules V2 in file!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = RECORDS_FROM_FILE.every(
      (record) => {
        if (
          lodash.has(record, 'key') &&
          lodash.has(record, 'engagement')
        ) {
          return true;
        }
        return false;
      }
    );
    if (
      !HAS_PROPER_FILE_STRUCTURE
    ) {
      const MESSAGE = `File is not compatible for import! File must contain 'key', and 'engagement'!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (let ruleV2 of RECORDS_FROM_FILE) {
      const RULE_CONDITIONS = separateConditionsFromRule(ruleV2);
      PROMISES.push(ruleV2SaveOne(context, { ruleV2 }));
      for (let condition of RULE_CONDITIONS) {
        PROMISES.push(ruleConditionsV2SaveOne(context, { condition }));
      }
    }
    await Promise.all(PROMISES);
    const RET_VAL = {
      status: 'SUCCESS'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${importMany.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  importMany,
}
