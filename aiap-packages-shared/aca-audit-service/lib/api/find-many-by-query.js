/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'audit-service-router-audits-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');

const findManyByQuery = async (context, params) => {
  try {
    const DATA_SOURCE = getDatasourceV1App();
    const RET_VAL = await DATA_SOURCE.audits.findManyByQuery(context, params);
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
