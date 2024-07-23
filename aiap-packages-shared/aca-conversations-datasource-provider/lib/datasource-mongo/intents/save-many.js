
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-intents-save-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { saveOne } = require('./save-one');

const saveMany = async (datasource, context, params) => {
  try {
    const INTENTS = ramda.path(['intents'], params);
    if (
      !lodash.isArray(INTENTS)
    ) {
      const MESSAGE = `Wrong type params.intents parameter! [Expected - Array]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (let intent of INTENTS) {
      if (
        !lodash.isEmpty(intent)
      ) {
        PROMISES.push(saveOne(datasource, context, { intent }));
      }
    }
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveMany,
}
