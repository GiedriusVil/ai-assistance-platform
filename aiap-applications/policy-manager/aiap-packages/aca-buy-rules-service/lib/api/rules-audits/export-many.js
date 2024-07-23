/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-service-rules-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { getBuyRulesDatasource } = require('../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const exportMany = async (context, params) => {
  try {
    const DATASOURCE = getBuyRulesDatasource(context);
    const RESULT = await DATASOURCE.rulesAudits.findManyByQuery(context, params);
    const RET_VAL = RESULT?.items;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${exportMany.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  exportMany,
}
