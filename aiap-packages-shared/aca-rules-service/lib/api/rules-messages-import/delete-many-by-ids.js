/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-rules-messages-import-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const _deleteManyByIds = async (context, params) => {
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const PARAMS = {
    isImport: true,
    ids: params,
    sort: {
      field: 'id',
      direction: 'asc'
    },
  };
  const RET_VAL = await DATASOURCE.rulesMessages.deleteManyByIds(context, PARAMS);
  return RET_VAL;
}

const deleteManyByIds = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _deleteManyByIds, context, params);
    return RET_VAL;
  } catch(error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', {ACA_ERROR});
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByIds,
}
