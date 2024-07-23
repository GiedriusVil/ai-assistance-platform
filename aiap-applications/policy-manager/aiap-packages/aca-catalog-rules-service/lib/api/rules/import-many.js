/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-catalog-rules-service-rules-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getEventStreamByContext, AIAP_EVENT_TYPE } = require('@ibm-aiap/aiap-event-stream-provider');

const { readJsonFromFile } = require('@ibm-aiap/aiap-utils-file');
const { saveOne } = require('./save-one');
const { saveMany: saveConditions } = require('../rules-conditions/save-many');
const { saveMany: saveCatalogs } = require('../rules-catalogs/save-many');

const importMany = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    const FILE = params?.file;
    const RECORDS_FROM_FILE = await readJsonFromFile(FILE);
    if (
      lodash.isEmpty(RECORDS_FROM_FILE)
    ) {
      const MESSAGE = 'Missing catalog rules in file!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = RECORDS_FROM_FILE.every(
      record => lodash.has(record, 'id')
    );
    if (
      !HAS_PROPER_FILE_STRUCTURE
    ) {
      const MESSAGE = `Catalog rules are not compatible for import! File must contain 'id'!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (let rule of RECORDS_FROM_FILE) {
      const CONDITIONS = rule?.conditions;
      const CATALOGS = rule?.catalogs;

      PROMISES.push(saveConditions(context, { values: CONDITIONS }, { action: 'IMPORT_MANY' }));
      PROMISES.push(saveCatalogs(context, { values: CATALOGS }, { action: 'IMPORT_MANY' }));

      delete rule.conditions;
      delete rule.catalogs;
      PROMISES.push(saveOne(context, { value: rule, resetRuleEngine: false }, { action: 'IMPORT_MANY' }));
    }
    await Promise.all(PROMISES);
    getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.RESET_CATALOG_RULE_ENGINES, {});

    const RET_VAL = {
      status: 'SUCCESS'
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(`${importMany.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  importMany,
}
