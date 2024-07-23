/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-service-organizations-import-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaOrganizationsDatasourceByContext } = require('@ibm-aca/aca-organizations-datasource-provider');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _saveOne = async (context, params) => {
  const DATASOURCE = getAcaOrganizationsDatasourceByContext(context);
  const RET_VAL = await DATASOURCE.organizationsImport.saveOne(context, params);
  return RET_VAL;
}

const saveOne = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _saveOne, context, params);
    return RET_VAL;
  } catch(error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', {ACA_ERROR});
    throw ACA_ERROR;
  }
};

module.exports = {
    saveOne,
}
