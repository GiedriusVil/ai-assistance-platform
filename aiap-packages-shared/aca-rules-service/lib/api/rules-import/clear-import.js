/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-rules-import-clear-import';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');
const { findManyByQuery } = require('./find-many-by-query');

const _clearImport = async (context, params) => {
  const RET_VAL = {};
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const QUERY = {
    pagination: {
      page: 1,
      size: 999999
    },
  };
  const IMPORT_RULES = await findManyByQuery(context, QUERY);
  const IDS = IMPORT_RULES?.items?.map(el => el.id) || [];
  
  if (!lodash.isEmpty(IDS)) {
    await DATASOURCE.rulesImport.deleteManyByIds(context, IDS);
  }

  return RET_VAL;
}

const clearImport = async (context, params) => {
  try {
      const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _clearImport, context, params);
      return RET_VAL;
  } catch(error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('->', {ACA_ERROR});
      throw ACA_ERROR;
  }
};

module.exports = {
  clearImport,
}
