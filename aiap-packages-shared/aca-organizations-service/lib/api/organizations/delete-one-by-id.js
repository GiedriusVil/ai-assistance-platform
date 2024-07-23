/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-service-organizations-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaOrganizationsDatasourceByContext } = require('@ibm-aca/aca-organizations-datasource-provider');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const { organizationsAuditorService } = require('@ibm-aca/aca-auditor-service');
const runtimeDataService = require('../runtime-data');

const _deleteOneById = async (context, params) => {
  const DATASOURCE = getAcaOrganizationsDatasourceByContext(context);
  const RET_VAL = await DATASOURCE.organizations.deleteOneById(context, params);

  await runtimeDataService.deleteManyByIdsFromConfigDirectory(context, {ids: [params.id]});

  const AUDITOR_PARAMS = {
    action: 'DELETE_ONE_BY_ID',
    docId: params.id,
    docType: 'ORGANIZATION',
    doc: { id: params.id },
  };
  await organizationsAuditorService.saveOne(context, AUDITOR_PARAMS);
  return RET_VAL;
};

const deleteOneById = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _deleteOneById, context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteOneById,
};
