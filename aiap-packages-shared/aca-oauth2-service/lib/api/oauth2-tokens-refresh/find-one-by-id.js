/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-service-oauth2-tokens-refresh-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getOauth2DatasourceByContext } = require('../datasource.utils');

const findOneById = async (context, params) => {
  try {
    const DATASOURCE = getOauth2DatasourceByContext(context);
    const RET_VAL = await DATASOURCE.oauth2TokensRefresh.findOneById(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findOneById,
}
