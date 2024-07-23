/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-charts-models-changes-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const findManyByQuery = async (context, params) => {
  const USER_ID = context?.user?.id;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.chartsModelChanges.findManyByQuery(context, params);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID });
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByQuery,
}
