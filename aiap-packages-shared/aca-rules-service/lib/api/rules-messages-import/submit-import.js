/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-rules-messages-import-submit-import';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const {
    transformToAcaErrorFormat,
} = require('@ibm-aca/aca-data-transformer');

const {
    getAcaRulesDatasourceByContext,
} = require('@ibm-aca/aca-rules-datasource-provider');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');
const { saveOne } = require('../rules-messages');

const _submitImport = async (context, params) => {
  let retVal;
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const MESSAGES_IMPORT_QUERY = {
    isImport: true,
    sort: {
      field: 'id',
      direction: 'asc'
    }
  };
  const MESSAGES_IMPORT = await DATASOURCE.rulesMessages.findManyByQuery(context, MESSAGES_IMPORT_QUERY);
  const MESSAGES_IMPORT_ITEMS = MESSAGES_IMPORT?.items;

  for (let message of MESSAGES_IMPORT_ITEMS) {
    const ID = message?.id;
    await DATASOURCE.rulesMessages.deleteOneById(context, {isImport: true, id: ID});

    await saveOne(context, { message, isImport: false, auditIsImport: true });
  }

  retVal = MESSAGES_IMPORT_ITEMS;
  return retVal;
}

const submitImport = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _submitImport, context, params);
    return RET_VAL;
  } catch(error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    logger.error('->', {ACA_ERROR});
    throw ACA_ERROR;
  }
};

module.exports = {
    submitImport,
}
