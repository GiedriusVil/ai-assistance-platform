/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-service-organizations-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaOrganizationsDatasourceByContext } = require('@ibm-aca/aca-organizations-datasource-provider');
const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');
const { organizationsAuditorService } = require('@ibm-aca/aca-auditor-service');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');
const { deepDifference } = require('@ibm-aca/aca-wrapper-obj-diff');
const { findOneById } = require('./find-one-by-id');
const { getAcaOrganizationsCacheProvider } = require('@ibm-aca/aca-organizations-cache-provider');
const runtimeDataService = require('../runtime-data');

const retrieveOrganizationChanges = async (context, messageNewValue) => {
  const MESSAGE_ID = ramda.path(['id'], messageNewValue);
  let messageCurrentValue;
  if (
    !lodash.isEmpty(MESSAGE_ID)
  ) {
    messageCurrentValue = await findOneById(context, { id: MESSAGE_ID });
  }
  const RET_VAL = deepDifference(messageCurrentValue, messageNewValue);
  return {
    currentValue: messageCurrentValue,
    diff: RET_VAL
  };
}

const _generateActionTitle = (params) => {
  const IS_NEW = lodash.isEmpty(params?.currentValue);
  const IS_IMPORT = params?.isImport || false;

  const IMPORT_PREFIX = IS_IMPORT ? 'IMPORT_' : '';
  const ACTION_TYPE = IS_NEW ? 'CREATE_ONE' : 'SAVE_ONE';

  const RET_VAL = IMPORT_PREFIX.concat(ACTION_TYPE);
  return RET_VAL;
}

const _saveOne = async (context, params) => {
  const DATASOURCE = getAcaOrganizationsDatasourceByContext(context);
  const ORGANIZATION = params?.organization;

  appendAuditInfo(context, ORGANIZATION);

  const DOC_CHANGES = await retrieveOrganizationChanges(context, ORGANIZATION);
  const RET_VAL = await DATASOURCE.organizations.saveOne(context, params);

  await runtimeDataService.synchronizeWithConfigDirectory(context, { value: RET_VAL });

  const orgCacheProvider = getAcaOrganizationsCacheProvider();
  await orgCacheProvider.organizations.reloadOneByExternalId(context, { externalId: RET_VAL?.external?.id });

  params.currentValue = DOC_CHANGES.currentValue;
  const ACTION_TYPE = _generateActionTitle(params);

  const AUDITOR_PARAMS = {
    action: ACTION_TYPE,
    docId: RET_VAL.id,
    docType: 'ORGANIZATION',
    doc: ORGANIZATION,
  };

  const IS_NEW = lodash.isEmpty(params?.currentValue);
  if (!IS_NEW) {
    AUDITOR_PARAMS.docChanges = DOC_CHANGES.diff;
  }

  await organizationsAuditorService.saveOne(context, AUDITOR_PARAMS);

  return RET_VAL;
}

const saveOne = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _saveOne, context, params);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
}
