/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-rules-import-submit-import';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const { saveOne } = require('../rules');

const _submitImport = async (context, params) => {
  let retVal;
  try {
    const DATASOURCE = getAcaRulesDatasourceByContext(context);
    const RULES_IMPORT_QUERY = {
      sort: {
        field: 'id',
        direction: 'asc'
      }
    };
    const RULES_IMPORT = await DATASOURCE.rulesImport.findManyByQuery(context, RULES_IMPORT_QUERY);
    const RULES_IMPORT_ITEMS = ramda.path(['items'], RULES_IMPORT);

    for (let rule of RULES_IMPORT_ITEMS) {
      const ID = ramda.path(['id'], rule);
      await DATASOURCE.rulesImport.deleteOneById(context, {id: ID});

      await saveOne(context, { rule, isImport: true });
    }

    retVal = RULES_IMPORT_ITEMS;
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_submitImport.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const submitImport = async (context, params) => {
    try {
        const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _submitImport, context, params);
        return RET_VAL;
    } catch(error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
};

module.exports = {
    submitImport,
}
