/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-service-organizations-import-submit-import';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');
const { getAcaOrganizationsDatasourceByContext } = require('@ibm-aca/aca-organizations-datasource-provider');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const { saveOne } = require('../organizations');

const _submitImport = async (context, params) => {
  let retVal;
  const DATASOURCE = getAcaOrganizationsDatasourceByContext(context);
  const IMPORT_QUERY = {
    isImport: true,
    sort: {
      field: 'id',
      direction: 'asc'
    }
  };
  const IMPORT = await DATASOURCE.organizationsImport.findManyByQuery(context, IMPORT_QUERY);
  const IMPORT_ITEMS = IMPORT?.items;

  const PROMISES = [];
  const DELETE_IDS = [];
  for (let item of IMPORT_ITEMS) {
    const ID = item?.id;
    DELETE_IDS.push(ID);
    PROMISES.push(saveOne(context, { isImport: true, organization: item }));
  }

  await Promise.all(PROMISES);
  DATASOURCE.organizationsImport.deleteManyByIds(context, DELETE_IDS);

  retVal = IMPORT_ITEMS;
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
