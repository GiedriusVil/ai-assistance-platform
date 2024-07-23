/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-rules-import-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _saveOne = async (context, params) => {
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  params.rule.status = { ...params.rule.status,selectedMessageExists: true };
  const MESSAGE_NAME = params?.rule?.message?.name;
  if (lodash.isEmpty(MESSAGE_NAME)) {
    params.rule.status = { ...params.rule.status,selectedMessageExists: false };
  }

  const RET_VAL = await DATASOURCE.rulesImport.saveOne(context, params);
  return RET_VAL;
}

const saveOne = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _saveOne, context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', {ACA_ERROR});
    throw ACA_ERROR;
  }
};

module.exports = {
    saveOne,
}
