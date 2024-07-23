/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-service-validation-engagements-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getDatasourceByContext } = require('./../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const exportMany = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RESULT = await DATASOURCE.validationEngagements.findManyByQuery(context, params);
    const RET_VAL = RESULT?.items;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(exportMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  exportMany,
}
