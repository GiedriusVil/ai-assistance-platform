/*
	© Copyright IBM Corporation 2023. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-service-organizations-find-many-lite-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  getAcaOrganizationsDatasourceByContext,
} = require('@ibm-aca/aca-organizations-datasource-provider');

const {
  executeEnrichedByLambdaModule,
} = require('@ibm-aca/aca-lambda-modules-executor');

const _findManyLiteByQuery = async (context, params) => {
  const DATASOURCE = getAcaOrganizationsDatasourceByContext(context);
  const RET_VAL = await DATASOURCE.organizations.findManyLiteByQuery(
    context,
    params
  );
  return RET_VAL;
};

const findManyLiteByQuery = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(
      MODULE_ID,
      _findManyLiteByQuery,
      context,
      params
    );
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyLiteByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findManyLiteByQuery,
};
