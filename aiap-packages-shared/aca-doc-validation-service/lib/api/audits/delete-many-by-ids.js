/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-doc-validation-service-audits-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getDocValidationDatasource } = require('../datasource.utils');

const deleteManyByIds = async (context, params) => {
  try {
    const DATASOURCE = getDocValidationDatasource(context);
    const RET_VAL = await DATASOURCE.audits.deleteManyByIds(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${deleteManyByIds.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};


module.exports = {
  deleteManyByIds,
}
